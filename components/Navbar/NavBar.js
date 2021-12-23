import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
} from 'reactstrap';

import React from 'react';
import { useMessengerProvider } from '../Context/MessengerContext';
import ChannelAdmin from './../Messenger/ChannelAdmin';
import { useRouter } from 'next/router';

const NavBar = () => {
  const { state, toggleSidebar } = useMessengerProvider();
  const router = useRouter();
  const { user } = state;

  if (user === "") router.push('/')

  return (
    <div>
      <Navbar id='navbar' color='primary' expand='md' light>
        <NavbarBrand>
          <i
            className='bi-chat-left-dots-fill'
            onClick={() => toggleSidebar()}
            title='open/close Sidebar'
          />
        </NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() {}} />
        <Collapse navbar>
          <Nav className='me-auto' navbar>
              <h4 className='lh-base'> User: {user}</h4>
          </Nav>
          <ChannelAdmin />
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
