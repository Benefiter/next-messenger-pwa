import { cloneDeep } from 'lodash';
import { actions } from './actions';
import moment from 'moment'

export const messageReducer = (state, action) => {
  const { name, channelId } = action.payload;

  switch (action.type) {
    case actions.setUser:
      const { user } = action.payload;
      return {
        ...state,
        user,
        stats: updateStats(state)
      };
    case actions.addChannel:
      if (
        state.user === '' ||
        channelId === '' ||
        name === '' ||
        channelIdExists(state.channels, channelId)
      )
        return state;
      return {
        ...state,
        channels: [...state.channels, { name, channelId, messages: [] }],
        stats: updateStats(state),
      };
    case actions.addChannels:
      const { channels } = action.payload;

      if (state.user === '' || channels == null || channels.length === 0) {
        return state;
      }
      return {
        ...state,
        channels: addChannels(state, channels),
        stats: updateStats(state),
      };

    case actions.removeChannel:
      if (
        state.user === '' ||
        channelId === ''
      )
        return state;
      const nameOfChannel = getChannelName(channelId, state.channels);
      return {
        ...state,
        activeChannel:
          nameOfChannel === state.activeChannel ? '' : state.activeChannel,
        channels: state.channels.filter(
          c => c.channelId.toString() !== channelId.toString()
        ),
        stats: updateStats(state),
      };
    case actions.removeChannelByName:
      const { activeChannel } = state;
      if (
        state.user === '' ||
        name === '' ||
        !channelNameExists(state.channels, name)
      )
        return state;
      const removedChanState ={
        ...state,
        activeChannel: activeChannel === name ? '' : activeChannel,
        channels: state.channels.filter(c => c.name !== name),
      };
      return {
        ...removedChanState,
        stats: updateStats(removedChanState),
      };

    case actions.updateChannelMessages:
      const { messages } = action.payload;
      const changedState = {
        ...state,
        channels: addMessagesToChannel(state, messages),
      };
      return {
        ...changedState,
        stats: updateStats(changedState)
      }
    case actions.setClientConnection:
      return {
        ...state,
        clientConnection: action.payload.clientConnection,
        stats: updateStats(state),
      };
    case actions.setActiveChannel:
      const channelName = action.payload.activeChannel;
      return {
        ...state,
        activeChannel: channelName,
        activeChannelId:
          channelName === '' ? '' : getChannelId(channelName, state.channels),
        stats: updateStats(state),
      };
    case actions.removeChannelMessage:
      return {
        ...state,
        channels: removeChannelMessage(state, action),
        stats: updateStats(state),
      };
    default:
      return state;
  }
};

const getChannelId = (name, channels) => {
  const channel = channels?.find(c => c.name === name);
  return channel == null ? '' : channel.channelId;
};

const getChannelName = (channelId, channels) => {
  const channel = channels?.find(
    c => c.channelId.toString() === channelId.toString()
  );

  return channel == null ? '' : channel.name;
};

const channelIdExists = (channels, channelId) => {
  if (channelId === undefined) {
    return true;
  }

  channels?.some(c => c.channelId.toString() === channelId.toString());
};

const channelNameExists = (channels, name) =>
  channels?.some(c => c.name === name);

const addMessagesToChannel = (state, messages) => {
  const updatedChannels =
    state.channels === [] ? [] : cloneDeep(state.channels);

  messages.forEach(m => {
    const channel = updatedChannels.find(c => c.channelId === m.channelId);

    if (channel) {
      if (
        !channel.messages.some(
          cm => cm.messageId.toString() === m.messageId.toString()
        )
      ) {
        channel.messages.push(m);
      }
    }
  });
  return [...updatedChannels];
};

const addChannels = (state, channels) => {
  const updatedChannels =
    state.channels === [] ? [] : cloneDeep(state.channels);

  channels?.forEach(c => {
    if (!channelIdExists(updatedChannels, c.channelId))
      updatedChannels.push({ ...c, messages: [] });
  });
  return updatedChannels;
};

const removeChannelMessage = (state, action) => {
  const { messageId } = action.payload;
  const updatedChannels = cloneDeep(state.channels);

  let channelToUpdate = updatedChannels.find(c =>
    c.messages.some(m => m.messageId.toString() === messageId.toString())
  );

  if (channelToUpdate == null) return updatedChannels;

  const channelId = channelToUpdate.channelId;

  updatedChannels.forEach(c => {
    if (c.channelId.toString() === channelId.toString()) {
      c.messages = c.messages.filter(
        m => m.messageId.toString() !== messageId.toString()
      );
    }
  });

  return updatedChannels;
};

const updateStats = state => {
  return {
    ...state.stats,
    activeChannels: state.channels.length,
    lastMessageStat: getMostRecentMessageStat(state.channels),
  };
};

const getMostRecentMessageStat = channels => {
  let mostRecentMessage = null
  let mostRecentChannel = null
  channels.reduce((prev, curr) => {
    curr?.messages.forEach(m => {
      const msgTimestamp = moment(m?.createdOn)
      if (msgTimestamp?.isAfter(prev)) {
        mostRecentMessage = m
        mostRecentChannel = curr
        prev = msgTimestamp
      }
    })
    return prev
  }, new moment(new Date('1970-01-01Z00:00:00:000')));

  return (mostRecentMessage == null || mostRecentChannel == null) ? '' :  `Most recent message sent from ${mostRecentMessage.author} on ${mostRecentChannel.name} at ${moment(mostRecentMessage.createdOn).format('MMM DD YYYY hh:mm:ss a')}`
};
