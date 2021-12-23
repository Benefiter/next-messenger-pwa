import React from 'react';
import propTypes from 'prop-types';
import { initMessengerState } from '../../reducers/message/state';
import { messageReducer } from './../../reducers/message/reducer';
import { HubConnectionState } from '@microsoft/signalr';

const MessengerContext = React.createContext();

export const MessengerProvider = ({ children }) => {
  const [sidebarIsOpen, setSidebarIsOpen] = React.useState(false);
  const [state, dispatch] = React.useReducer(messageReducer, {
    ...initMessengerState,
  });
  const { clientConnection, channels } = state;

  const connected = () =>
    clientConnection?.state === HubConnectionState.Connected;

  const getChannelIdFromName = name => {
    const channel = channels?.find(c => c.name === name);

    return channel ? Number(channel.channelId) : 0;
  };

  const toggleSidebar = () => {
    setSidebarIsOpen(state => !state);
  };

  return (
    <MessengerContext.Provider
      value={{ state, dispatch, connected, getChannelIdFromName, sidebarIsOpen, toggleSidebar }}
    >
      {children}
    </MessengerContext.Provider>
  );
};

export const useMessengerProvider = () => {
  const context = React.useContext(MessengerContext);

//   if (context === undefined) {
//     throw new Error(
//       'useMessengerProvider must be used within a MessengerContext Provider'
//     );
//   }

  return context;
};

MessengerProvider.propTypes = {
  children: propTypes.node.isRequired,
};
