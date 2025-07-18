import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import FloatingBtns from '../components/backend/FloatingBtns.jsx';
import Loader from '../components/common/Loader.jsx';
import ColorStyleTag from '../components/frontend/ColorStyleTag.jsx';
import Footer from '../components/frontend/Footer.jsx';
import Burger from '../components/frontend/navigation/Burger.jsx';
import Nav from '../components/frontend/navigation/Nav.jsx';
import { useAuthStatus } from '../hooks/useAuthStatus.js';
import { client } from '../utils/sanityClient.js';
import { applyFontSize } from '../utils/userCustomerUtils.js';

function RootPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMenuSide, setIsMenuSide] = useState(false);
  const {
    data: status = { isLoggedIn: false, role: null, token: null, user: null },
  } = useAuthStatus();

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

  const { data: appearanceData, isLoading: appearanceLoading } = useQuery({
    queryKey: ['appearanceData'],
    queryFn: () => client.fetch(`*[_type == "appearance"][0]`),
    staleTime: 1000 * 60 * 60, // 1h cache
  });

  if (appearanceLoading) {
    return <Loader label={'Ładowanie'} />;
  }
  console.log(appearanceData.colors);

  const extractedColors = appearanceData.colors
    ? {
        base: appearanceData.colors.base?.value,
        baseText: appearanceData.colors.baseText?.value,
        tile: appearanceData.colors.tile?.value,
        tileTitle: appearanceData.colors.tileTitle?.value,
        tileText: appearanceData.colors.tileText?.value,
        tileTextMutedBase: appearanceData.colors.tileTextMuted?.value,
        tileTextMuted: appearanceData.colors.tileTextMuted?.value,
        accentBcg: appearanceData.colors.accentBcg?.value,
        accentText: appearanceData.colors.accentText?.value,
        nav: appearanceData.colors.nav?.value,
        navMuted: appearanceData.colors.navMuted?.value,
        genericListContent: appearanceData.colors.genericListContent?.value,
      }
    : null;

  return (
    <>
      <ColorStyleTag colors={extractedColors} />
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
