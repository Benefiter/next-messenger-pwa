import Login from '../components/Login/Login';
import React from 'react';
import { startSignalRConnection } from '../services/signalR/signalrClient';
import { useMessengerProvider } from '../components/Context/MessengerContext';
import { actions } from './../reducers/message/actions';

const Startup = () => {
  const { dispatch } = useMessengerProvider();

  React.useEffect(() => {
    dispatch({
      type: actions.setClientConnection,
      payload: { clientConnection: startSignalRConnection() },
    });
  }, []);
  return (
    <div>
      <Login />
    </div>
  );
};

export default Startup;
