import { Container, Row } from 'reactstrap';
// import '../../styles.css'
import React from 'react';
import Footer from './../components/Footer/Footer';
import { messageDeletedCallbackWrapper } from '../components/Messenger/messengerHelper';
import { messageAddedCallbackWrapper } from './../components/Messenger/messengerHelper';
import { useMessengerProvider } from '../components/Context/MessengerContext';
import { actions } from './../reducers/message/actions';
import ActiveChannel from './../components/ActiveChannel/ActiveChannel';
import Layout from '../components/Layout';

const Main = () => {
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
    if (!connected()) return;

    clientConnection.on('channelAdded', onChannelAddedCallback);

    clientConnection.on('channelDeleted', onChannelDeletedCallback);

    channels.forEach(c => {
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

export default Main;
