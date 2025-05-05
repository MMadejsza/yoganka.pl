import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingBtns from '../components/common/FloatingBtns.jsx';
import Footer from '../components/frontend/Footer.jsx';
import Burger from '../components/frontend/navigation/Burger.jsx';
import Nav from '../components/frontend/navigation/Nav.jsx';
import { useAuthStatus } from '../hooks/useAuthStatus.js';
import { applyFontSize } from '../utils/userCustomerUtils.js';

function RootPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMenuSide, setIsMenuSide] = useState(false);
  const { data: status } = useAuthStatus();

  useEffect(() => {
    if (status) {
      setIsMenuSide(status?.user?.UserPrefSetting?.handedness);
    }
  }, [status]);

  // Apply user settings
  useEffect(() => {
    const prefSettings = status?.user?.UserPrefSetting;
    applyFontSize(prefSettings?.fontSize);
  }, [status?.user?.UserPrefSetting?.fontSize]);

  return (
    <>
      <div className='wrapper'>
        <Burger
          side={isMenuSide}
          isNavOpen={isNavOpen}
          setIsNavOpen={setIsNavOpen}
        />
        <Nav status={status} side={isMenuSide} setIsNavOpen={setIsNavOpen} />
        <Outlet />
        <Footer />
        <FloatingBtns side={isMenuSide} />
      </div>
    </>
  );
}

export default RootPage;
