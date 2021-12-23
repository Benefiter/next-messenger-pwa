import { Button } from 'reactstrap';

const dashboard = () => {
  return (
    <div>
      <div className='text-center'>
        <h1>Dashboard Page</h1>
        <Button onClick={() => window.history.back()}>Back</Button>
      </div>
    </div>
  );
};

export default dashboard;
