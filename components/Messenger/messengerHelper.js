import { actions } from './../../reducers/message/actions';

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
