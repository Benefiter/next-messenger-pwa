import React from 'react';
import { actions } from '../../reducers/message/actions';
import DeleteChannelConfirmationModal from '../Modals/DeleteChannelConfirmationModal';
import AddChannelConfirmationModal from './../Modals/AddChannelConfirmationModal';
import { Button } from 'reactstrap';
import { useMessengerProvider } from '../Context/MessengerContext';
import {
  messageAddedCallbackWrapper,
  messageDeletedCallbackWrapper,
} from './../../services/signalR/signalrClient';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import MessengerButton from '../Buttons/MessengerButton';
import ActiveChannel from './../ActiveChannel/ActiveChannel';

const ChannelAdmin = () => {
  const { state, dispatch, connected, getChannelIdFromName } =
    useMessengerProvider();
  const [deleteActiveChannel, setDeleteActiveChannel] = React.useState(false);
  const [addChannel, setAddChannel] = React.useState(false);
  const { channels, activeChannel, clientConnection } = state;

  const hasChannels = channels?.length > 0;

  React.useEffect(() => {
    if (hasChannels && channels.length === 1) {
      setActiveChannel(channels[0].name);
    }
  }, [channels, activeChannel]);

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

  const deleteChannel = () => {
    if (!connected()) return;

    const channelId = getChannelIdFromName(activeChannel);
    clientConnection.invoke('RemoveChannel', channelId).then(_ => {
      unsubscribeFromChannelMessageUpdated(channelId);
      dispatch({
        type: actions.removeChannelByName,
        payload: { name: activeChannel },
      });
    });

    setDeleteActiveChannel(false);
  };

  const setActiveChannel = channel => {
    dispatch({
      type: actions.setActiveChannel,
      payload: { activeChannel: channel },
    });
  };

  return (
    <div className='p-2 d-flex align-items-center'>
      <UncontrolledDropdown disabled={!hasChannels}>
        <DropdownToggle
          disabled={!hasChannels}
          color='bg-dark'
          caret={hasChannels}
        >
          {hasChannels ? (
            'Channels'
          ) : (
            <div>
              {`Please Add Channel `}
              <i className='bi-arrow-right-square-fill'></i>
            </div>
          )}
        </DropdownToggle>
        <DropdownMenu>
          {channels.map(c => (
            <DropdownItem key={c.id} onClick={() => setActiveChannel(c.name)}>
              {c.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
      {hasChannels && (
        <MessengerButton
          name='Delete'
          disabled={ActiveChannel == ''}
          clickHandler={() => setDeleteActiveChannel(true)}
          title='Delete Active Channel'
        />
      )}
      <MessengerButton
        clickHandler={() => setAddChannel(true)}
        className='ms-2'
        title='Add Channel'
        name='Add'
      />
      <DeleteChannelConfirmationModal
        isOpen={deleteActiveChannel}
        title={'Confirm Deletion'}
        message={`Are  you sure you want to delete channel ${activeChannel} ?`}
        confirmationAction={() => {
          deleteChannel();
        }}
        cancelAction={() => setDeleteActiveChannel(false)}
      />
      <AddChannelConfirmationModal
        confirmationAction={() => {
          setAddChannel(false);
        }}
        cancelAction={() => setAddChannel(false)}
        isOpen={addChannel}
      />
    </div>
  );
};

export default ChannelAdmin;
