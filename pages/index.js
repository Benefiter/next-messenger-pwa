import Login from '../components/Login/Login';
import React from 'react';
import { startSignalRConnection } from '../services/signalR/signalrClient';
import { useMessengerProvider } from '../components/Context/MessengerContext';
import { actions } from './../reducers/message/actions';
import axios from 'axios';

const Startup = ({channels, messages}) => {
  const { dispatch } = useMessengerProvider();

  React.useEffect(() => {
    dispatch({
      type: actions.setClientConnection,
      payload: { clientConnection: startSignalRConnection() },
    });
    dispatch({ type: actions.addChannels, payload: { channels } });
    dispatch({
      type: actions.updateChannelMessages,
      payload: { messages },
    });

  }, []);
  return (
    <div>
      <Login />
    </div>
  );
};

const getChannelMessages = async (channels) => {

return Promise.all(channels.map(async c => {
  let resp
    resp = await axios.get(`https://localhost:5001/channels/${c.channelId}/messages`)
    return  resp?.data
})).then(results => results.reduce((prev, cur) => {
  return [...prev, ...cur]
},[]))
  
}

export const getStaticProps = async () => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
  const res = await axios.get('https://localhost:5001/channels');
  const channels = res.data;

  const messages = await getChannelMessages(channels)

  return {
    props: {
      channels,
      messages,
    }, // will be passed to the page component as props
  };
};

export default Startup;
