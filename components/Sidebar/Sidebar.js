import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { useMessengerProvider } from '../Context/MessengerContext';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const { sidebarIsOpen, toggleSidebar } = useMessengerProvider();
  const router = useRouter();

  return (
    <>
      <Offcanvas
        color='primary'
        className='sidebar'
        fade={true}
        isOpen={sidebarIsOpen}
        toggle={toggleSidebar}
      >
        <OffcanvasHeader toggle={toggleSidebar}>Menu</OffcanvasHeader>
        <OffcanvasBody>
          <div className='py-2'>
            <Button color='info' onClick={() => {toggleSidebar(); router.push('/about')}}>
              <i className='bi-patch-question pe-1' />
              About
            </Button>
          </div>
          <div className='py-2'>
            <Button color='info' onClick={() => {toggleSidebar(); router.push('/dashboard')}}>
              <i className='bi-speedometer pe-1' />
              Dashboard
            </Button>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
