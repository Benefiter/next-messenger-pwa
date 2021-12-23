import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MessengerButton from './../Buttons/MessengerButton';

const DeleteChannelConfirmationModal = ({
  title,
  message,
  confirmationAction,
  cancelAction,
  isOpen
}) => {
  return (
    <Modal
      autoFocus={false}
      isOpen={isOpen}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {message}
      </ModalBody>
      <ModalFooter>
        <MessengerButton name='Cancel' color='secondary' clickHandler={() => cancelAction()}/>
        <MessengerButton
          name='OK'
          color='primary'
          clickHandler={() => confirmationAction()}/>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteChannelConfirmationModal;
