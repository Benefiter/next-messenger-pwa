import {
  HubConnectionBuilder,
  LogLevel,
  HubConnectionState,
} from '@microsoft/signalr';
import { actions } from './../../reducers/message/actions';

const BASE_BACKEND_URL = 'https://localhost:5001/hubs/messages';

function canConsoleLog() {
  return true;
}

const onSignalREvent = (error, eventName) => {
  const consoleLog = canConsoleLog();

  if (consoleLog) {
    console.log(eventName, error);
    return;
  }
  if (error) {
    console.log(`${eventName} Error: \r${error}`);
  }
};

const onReconnected = (connectionId, signalrClient) => {
  if (!connectionId) {
    console.log('SignalR Reconnected failed to get a connection id');
    return;
  }

  subscribeToPortalChanges(signalrClient);

  const consoleLog = canConsoleLog();

  if (consoleLog) {
    console.log(`SignalR Reconnected: ${connectionId}`);
    return;
  }
};

const subscribeToPortalChanges = signalrClient => {

  if (signalrClient.state === HubConnectionState.Connected) {
    signalrClient.invoke('SubscribeToChannelsChannel');
  }
};

export function startSignalRConnection() {
  console.log("####### startSignalRConnection called")
  const signalrClient = new HubConnectionBuilder()
    .withUrl(BASE_BACKEND_URL)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Critical)
    .build();
  const consoleLog = canConsoleLog();
  let conn = signalrClient;

  conn
    .start()
    .then(() => {
      conn.invoke('SubscribeToChannelsChannel');

      conn.onclose(error => onSignalREvent(error, 'SignalR Closed | '));
      conn.onreconnecting(error =>
        onSignalREvent(error, 'SignalR Reconnecting | ')
      );
      conn.onreconnected(connectionId => onReconnected(connectionId, signalrClient));
    })
    .catch(error => {
      if (consoleLog) {
        console.log(`SignalR failed to connect: \r${error}`);
      }
      console.log(`SignalR failed to connect: \r${error}`);
      return null;
    });
  return signalrClient;
}

export const stopSignalRConnection = clientConnection =>
  clientConnection?.stop();

  export const messageAddedCallbackWrapper = dispatch => msg => {
    dispatch({
      type: actions.updateChannelMessages,
      payload: { messages: [msg] },
    });
  };
  
  export const messageDeletedCallbackWrapper = dispatch => messageId => {
    dispatch({
      type: actions.removeChannelMessage,
      payload: { messageId },
    });
  };
  
