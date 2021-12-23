import { Button } from 'reactstrap';

const MessengerButton = ({name, title, disabled, clickHandler, color, className}) => {
  return (
      <Button
        color={color ? color : 'info'}
        disabled={disabled}
        onClick={clickHandler}
        title={title}
        className={className}
      >
        {name}
      </Button>
  );
};

export default MessengerButton;
