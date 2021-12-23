import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React from 'react';
import { actions } from '../../reducers/message/actions';
import { messageDeletedCallbackWrapper } from '../../services/signalR/signalrClient';
import { useMessengerProvider } from '../Context/MessengerContext';
import MessengerButton from './../Buttons/MessengerButton';

const AddChannelConfirmationModal = ({
  confirmationAction,
  cancelAction,
  isOpen,
}) => {
  const { state, dispatch, connected } = useMessengerProvider();
  const { clientConnection, channels } = state;
  const [name, setName] = React.useState('');
  const [activate, setActivate] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(channels?.some(c => c.name === name));
  }, [name]);

  React.useEffect(() => {
    if (!isOpen) {
      setName('')
      setActivate(false);
      setError(false)
    }
  },[isOpen])

  const subscribeToChannelMessageUpdates = channelId => {

    if (connected()) {

      clientConnection.invoke('SubscribeToMessageChannel', channelId);

      clientConnection.on('messageAdded', messageDeletedCallbackWrapper(dispatch));

      clientConnection.on('messageDeleted',messageDeletedCallbackWrapper(dispatch));

      // Already being handle from the channel changes subscription
      // clientConnection.on('channelDeleted', channelId => {
      //   dispatch({ type: actions.removeChannel, payload: channelId });
      // });
    }
  };

  const addChannel = () => {
    if (connected()) {
      clientConnection.invoke('AddChannel', { name }).then(channel => {
        subscribeToChannelMessageUpdates(channel.channelId);
        dispatch({ type: actions.addChannel, payload: channel });
        activate &&
          dispatch({
            type: actions.setActiveChannel,
            payload: { activeChannel: name },
          });
      });
    }

    confirmationAction();
  };

  return (
    <Modal autoFocus={false} isOpen={isOpen}>
      <ModalHeader>Create Channel</ModalHeader>
      <ModalBody>
        <h4 className='pe-2 pb-2'>Channel Name</h4>
        <input
          autoFocus
          className='w-100'
          type='text'
          placeholder='Enter Channel Name'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {error && <div className="chan-error">Channel name already exists.</div>}
        <label className='p-2 align-middle' id='activate'>
          Activate
        </label>
        <input
          className={`mt-1 align-middle`}
          id='activate'
          type='checkbox'
          value={activate}
          onChange={e => setActivate(e.target.checked)}
        />
      </ModalBody>
      <ModalFooter>
        <MessengerButton name='Cancel' color='secondary' clickHandler={() => cancelAction()}/>
        <MessengerButton
          disabled={name === '' || error}
          color='primary'
          clickHandler={() => addChannel()}
          name='OK'
        />
      </ModalFooter>
    </Modal>
  );
};

export default AddChannelConfirmationModal;
