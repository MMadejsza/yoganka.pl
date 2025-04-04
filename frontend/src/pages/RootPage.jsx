import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingPopUps from '../components/frontend/FloatingPopUps.jsx';
import Footer from '../components/frontend/Footer.jsx';
import Burger from '../components/frontend/navigation/Burger.jsx';
import Nav from '../components/frontend/navigation/Nav.jsx';
import { useAuthStatus } from '../hooks/useAuthStatus.js';
import { applyFontSize } from '../utils/userSettingsUtils.js';

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
        <FloatingPopUps />
      </div>
    </>
  );
}

export default RootPage;
