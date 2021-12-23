import NavBar from './Navbar/NavBar';
import Sidebar from './Sidebar/Sidebar';

const Layout = ({ children }) => {
  return (
    <div>
      <main>
        <NavBar/>
        <Sidebar/>
        {children}
      </main>
    </div>
  );
};

export default Layout;
