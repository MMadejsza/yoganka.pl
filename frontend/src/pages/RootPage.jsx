import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import FloatingPopUps from '../components/frontend/FloatingPopUps.jsx';
import Footer from '../components/frontend/Footer.jsx';
import Burger from '../components/frontend/navigation/Burger.jsx';
import Nav from '../components/frontend/navigation/Nav.jsx';

function RootPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <div className='wrapper'>
        <Burger isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        <Nav setIsNavOpen={setIsNavOpen} />
        <Outlet />
        <Footer />
        <FloatingPopUps />
      </div>
    </>
  );
}

export default RootPage;
