import { renderHook, act } from '@testing-library/react-hooks';
import { useReducer } from 'react';
import { actions } from './actions';
import { messageReducer } from './reducer';
import { initMessengerState } from './state';
import moment from 'moment';

let result;
let dispatch;
const name = 'BBC1';
const channelId = '1';
const mostRecentMessageDate = 'Dec 20 2021 03:34:00 pm'
const message1 = {
  channelId: '1',
  messageId: '1',
  author: 'author1',
  content: 'Message content 1',
  createdOn: moment('Dec 17 2021 03:34:00 pm').format('MMM DD YYYY hh:mm:a'),
};

const message2 = {
  channelId: '1',
  messageId: '2',
  author: 'author2',
  content: 'Message content 2',
  createdOn: moment(mostRecentMessageDate).format('MMM DD YYYY hh:mm:a'),
};

const message3 = {
  channelId: '2',
  messageId: '3',
  author: 'author3',
  content: 'Message content 3',
  createdOn: moment('Dec 19 2021 03:34:00 pm').format('MMM DD YYYY hh:mm:a'),
};

const newMessageForChannelId_2 = {
  channelId: '2',
  messageId: '2',
  author: 'author4',
  content: 'Message content 4',
  createdOn: moment('Dec 15 2021 03:34:00 pm').format('MMM DD YYYY hh:mm:a'),
};

const stateWithUser = { ...initMessengerState, user: 'user' };
const stateWithChannel = {
  ...stateWithUser,
  channels: [{ name, channelId, messages: [] }],
  stats: {...stateWithUser.stats, activeChannels: 1}
};
const stateWithChannelAndMessages = {
  ...stateWithChannel,
  channels: [
    { channelId: '1', messages: [{ ...message1 }, { ...message2 }] },
    { channelId: '2', messages: [{ ...message3 }] },
  ],
};
const updatedStateWithChannelAndMessages = {
  ...stateWithChannel,
  channels: [
    { channelId: '1', messages: [{ ...message1 }, { ...message2 }] },
    {
      channelId: '2',
      messages: [{ ...message3 }, { ...newMessageForChannelId_2 }],
    },
  ],
  stats: {
    activeChannels: 2,
    lastMessageStat: 'Most recent message sent from author2 on undefined at Dec 20 2021 03:34:00 pm'
  }
};

const newChannels = [
  {
    channelId: '1',
    messages: [],
    name: 'BBC1'
  },
  {
    channelId: '2',
    messages: [],
    name: 'BBC2'
  },
  {
    channelId: '3',
    messages: [],
    name: 'BBC3'
  }
]

const updatedStateWithNewChannels = { ...stateWithUser, channels: [...newChannels]};


beforeEach(() => {
  result = renderHook(() =>
    useReducer(messageReducer, { ...stateWithUser })
  ).result;
  dispatch = result.current[1];
});

it('action ', () => {
  result = renderHook(() =>
    useReducer(messageReducer, { ...initMessengerState })
  ).result;
  dispatch = result.current[1];

  const user = 'user';
  act(() => {
    dispatch({ type: actions.setUser, payload: { user } });
  });

  expect(result.current[0]).toEqual({
    ...initMessengerState,
    user: user,
  });
});

it('action addChannel', () => {
  const name = 'BBC1';
  const channelId = '1';
  act(() => {
    dispatch({ type: actions.addChannel, payload: { name, channelId } });
  });

  expect(result.current[0]).toEqual({
    ...stateWithUser,
    channels: [{ name, channelId, messages: [] }],
  });
});

it('action removeChannel', () => {
  const name = 'BBC1';
  result = renderHook(() =>
    useReducer(messageReducer, { ...stateWithChannel })
  ).result;
  dispatch = result.current[1];

  act(() => {
    dispatch({ type: actions.removeChannel, payload: { channelId } });
  });

  expect(result.current[0]).toEqual({
    ...stateWithChannel,
    channels: [],
  });
});

it('action updateChannelMessages', () => {
  result = renderHook(() =>
    useReducer(messageReducer, { ...stateWithChannelAndMessages })
  ).result;
  dispatch = result.current[1];

  act(() => {
    dispatch({
      type: actions.updateChannelMessages,
      payload: { messages: [{ ...newMessageForChannelId_2 }] },
    });
  });

  expect(result.current[0]).toEqual({
    ...updatedStateWithChannelAndMessages,
  });
});

it('action addChannels', () => {
  result = renderHook(() =>
    useReducer(messageReducer, { ...stateWithUser })
  ).result;
  dispatch = result.current[1];

  act(() => {
    dispatch({
      type: actions.addChannels,
      payload: { channels: [...newChannels ] },
    });
  });

  expect(result.current[0]).toEqual({
    ...updatedStateWithNewChannels,
  });
});
