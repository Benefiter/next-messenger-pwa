import { Container, Row } from 'reactstrap';
import React from 'react';
import Footer from './../components/Footer/Footer';
import { messageDeletedCallbackWrapper } from '../components/Messenger/messengerHelper';
import { messageAddedCallbackWrapper } from './../components/Messenger/messengerHelper';
import { useMessengerProvider } from '../components/Context/MessengerContext';
import { actions } from './../reducers/message/actions';
import ActiveChannel from './../components/ActiveChannel/ActiveChannel';
import Layout from '../components/Layout';
import axios from 'axios';

const Main = ({ existingChannels, existingMessages }) => {
  
  const { state, dispatch, connected } = useMessengerProvider();

  const { clientConnection, channels } = state;

  const subscribeToChannelMessageUpdates = channelId => {
    if (connected()) {
      clientConnection.invoke('SubscribeToMessageChannel', channelId);

      clientConnection.on(
        'messageAdded',
        messageAddedCallbackWrapper(dispatch)
      );

      clientConnection.on(
        'messageDeleted',
        messageDeletedCallbackWrapper(dispatch)
      );
    }
  };

  const unsubscribeFromChannelMessageUpdated = channelId => {
    if (connected()) {
      clientConnection.off(
        'messageAdded',
        messageAddedCallbackWrapper(dispatch)
      );

      clientConnection.off(
        'messageDeleted',
        messageDeletedCallbackWrapper(dispatch)
      );
    }
  };

  const onChannelAddedCallback = newChannel => {
    dispatch({ type: actions.addChannel, payload: newChannel });
    subscribeToChannelMessageUpdates(newChannel.channelId);
  };

  const onChannelDeletedCallback = channelId => {
    const args = { type: actions.removeChannel, payload: { channelId } };
    dispatch(args);
    unsubscribeFromChannelMessageUpdated(channelId);
  };

  React.useEffect(() => {
    dispatch({ type: actions.addChannels, payload: { channels: existingChannels } });
    dispatch({
      type: actions.updateChannelMessages,
      payload: { messages: existingMessages },
    });

    if (!connected()) return;

    clientConnection.on('channelAdded', onChannelAddedCallback);

    clientConnection.on('channelDeleted', onChannelDeletedCallback);

    existingChannels.forEach(c => {
      subscribeToChannelMessageUpdates(c.channelId);
    });

    return () => {
      channels.forEach(c => unsubscribeFromChannelMessageUpdated(c.channelId));
      clientConnection.off('channelAdded', onChannelAddedCallback);

      clientConnection.off('channelDeleted', onChannelDeletedCallback);

      return () => {
        stopSignalRConnection();
        dispatch({
          type: actions.setClientConnection,
          payload: { clientConnection: null },
        });
      };
    };
  }, []);

  return (
    <>
      <Layout>
        <Container fluid>
          <Row>
            <ActiveChannel />
          </Row>
          <Row>
            <Footer />
          </Row>
        </Container>
      </Layout>
    </>
  );
};

const getChannelMessages = async channels => {
  return Promise.all(
    channels.map(async c => {
      let resp;
      resp = await axios.get(
        `https://localhost:5001/channels/${c.channelId}/messages`
      );
      return resp?.data;
    })
  ).then(results =>
    results.reduce((prev, cur) => {
      return [...prev, ...cur];
    }, [])
  );
};

export const getStaticProps = async () => {
  // **** Can't use AbortController here, generates a compiler error
  // let abortController = new AbortController()
  //   const timeout = setTimeout(() => {
  //       abortController.abort()
  //       console.log("Aborted")
  //   }, 3000)

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
  const res = await axios.get('https://localhost:5001/channels');
  const existingChannels = res.data;

  const existingMessages = await getChannelMessages(existingChannels);

  // let resp
  // await axios.get(`https://localhost:5001/channels/2/messages`, {signal: abortController.signal}).then(res => {

  //   clearTimeout(timeout)
  //   resp = res}
  //   ).catch(err => console.log(`error ${err}`))
  // console.log(resp)
  // console.log(`after`);

  
  return {
    props: {
      existingChannels,
      existingMessages,
    }, // will be passed to the page component as props
  };
};

export default Main;
