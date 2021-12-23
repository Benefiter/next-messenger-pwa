import { Button } from 'reactstrap';

const about = () => {
  return (
    <div>
      <div className='text-center'>
        <h1>About Page</h1>
        <Button onClick={() => window.history.back()}>Back</Button>
      </div>
    </div>
  );
};

export default about;
