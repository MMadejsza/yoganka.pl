import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSwipe } from '../../../hooks/useSwipe';
import { mutateOnLoginOrSignup, queryClient } from '../../../utils/http.js';
import { client } from '../../../utils/sanityClient.js';
import SymbolOrIcon from '../../common/SymbolOrIcon';
import Logo from '../../frontend/Logo.jsx';

const logsGloballyOn = false;

const menuSideSet = [
  {
    auth: true,
    label: 'Zaloguj',
    symbol: 'login',
    link: '/login',
    text: 'Zaloguj się',
  },
  {
    auth: true,
    label: 'Konto',
    symbol: 'account_circle',
    // symbol: 'person',
    link: '/konto',
  },
  {
    auth: true,
    label: 'Admin Panel',
    symbol: 'shield_lock',
    link: '/admin-console/show-all-users',
  },
  {
    auth: true,
    label: 'Wyloguj',
    symbol: 'logout',
    link: '/login-pass/logout',
  },
];

function Nav({ side, status, setIsNavOpen }) {
  if (!status) {
    // it's still loading - you can render a spinner or return null immediately
    return null;
  }
  const navigate = useNavigate();
  const location = useLocation();

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };
  const { data: LOGO_DATA, isLoading: logoLoading } = useQuery({
    queryKey: ['logotypesData'],
    queryFn: () => client.fetch(`*[_type == "logotypes"]`),
    ...cacheConfig,
  });
  const { data: NAV_DATA, isLoading: navTabsLoading } = useQuery({
    queryKey: ['navsTabsData'],
    queryFn: () => client.fetch(`*[_type == "navs"]`),
    ...cacheConfig,
  });

  useSwipe(
    side,
    () => setIsNavOpen(true),
    () => setIsNavOpen(false),
    { edgePercent: 0.35, thresholdPercent: 0.1 }
  );

  if (logsGloballyOn) console.log('nav data', status);
  const logoutMutation = useMutation({
    mutationFn: formDataObj =>
      mutateOnLoginOrSignup(status, formDataObj, `/api/login-pass/logout`),

    onSuccess: () => {
      // Invalidate query to reload layout
      queryClient.invalidateQueries(['authStatus']);
      navigate('/');
    },
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const containerRef = useRef(null);

  const closeDrawer = () => {
    if (isMobile) setIsNavOpen(false);
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1025);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // only on desktop: nasłuchuj scrolla i ustawiaj isSticky na podstawie window.scrollY
  // useEffect(() => {
  //   if (isMobile) return; // skip on mobile

  //   // oblicz trigger raz przy montażu
  //   let triggerPos = 0;
  //   if (containerRef.current) {
  //     const rect = containerRef.current.getBoundingClientRect();
  //     triggerPos = rect.top + window.scrollY;
  //   }

  //   const handleScroll = () => {
  //     // jak przewiniemy poniżej triggerPos, włącz sticky
  //     setIsSticky(window.scrollY >= triggerPos);
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [isMobile]);
  useEffect(() => {
    if (isMobile) return;

    let triggerPos = 0;
    // compute absolute offsetTop of containerRef
    const computeTrigger = () => {
      let el = containerRef.current;
      let top = 0;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
      }
      triggerPos = top;
    };

    // initial compute and re-compute on resize
    computeTrigger();
    window.addEventListener('resize', computeTrigger);

    // scroll listener compares window.scrollY to that fixed triggerPos
    const handleScroll = () => {
      setIsSticky(window.scrollY >= triggerPos);
      setIsSticky(!(window.scrollY < triggerPos || window.scrollY == 0));
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', computeTrigger);
    };
  }, [isMobile]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (logoLoading || navTabsLoading) {
    return;
  }
  const dataSets = [LOGO_DATA, NAV_DATA];
  const anyEmpty = dataSets.some(data => !data || data.length === 0);

  const liContent = li => {
    // For restricted content
    if (li.auth) {
      // If logged In
      if (status?.isLoggedIn) {
        // Hide LogIn option
        if (li.label === 'Zaloguj') {
          return null;
        }
        if (li.label === 'Admin Panel' && status.user?.role != 'ADMIN') {
          return null;
        }

        // Logout turn into btn triggering fetch
        if (li.label === 'Wyloguj') {
          return (
            <li key={li.link} className='nav__item nav__item--side'>
              <button
                onClick={handleLogout}
                className='nav__link nav__link--side'
              >
                <SymbolOrIcon
                  type={li.icon ? 'ICON' : 'SYMBOL'}
                  specifier={li.icon || li.symbol}
                  classModifier={'side'}
                  aria-hidden={li.icon ? 'true' : null}
                />
                {li.text ?? li.label}
              </button>
            </li>
          );
        }
      } else {
        // If NOT logged in, both account and logout tabs are hidden
        if (
          li.label === 'Konto' ||
          li.label === 'Wyloguj' ||
          li.label === 'Admin Panel'
        ) {
          return null;
        }
      }
    }
    // Rest of elements
    return (
      <li key={li.link} className='nav__item nav__item--side'>
        <Link
          onClick={() => {
            closeDrawer();
            window.scrollTo(0, 0);
          }}
          to={li.link}
          className='nav__link nav__link--side'
        >
          <SymbolOrIcon
            type={li.icon ? 'ICON' : 'SYMBOL'}
            specifier={li.icon || li.symbol}
            classModifier={'side'}
            aria-hidden={li.icon ? 'true' : null}
          />
          {li.text ?? null}
        </Link>
      </li>
    );
  };

  const sideNavItems = [...NAV_DATA[0].sideNav.list, ...menuSideSet];

  return (
    <nav className={`nav ${side ? 'nav--left' : ''}`}>
      <div className='wrapper'>
        <div
          ref={containerRef}
          className={`main-nav-container${
            !isMobile && isSticky ? ' sticky' : ''
          }`}
        >
          <NavLink
            to={'/'}
            onClick={e => {
              closeDrawer();
              window.scrollTo(0, 0);
            }}
            className={({ isActive }) =>
              isActive ? 'nav__link active' : 'nav__link'
            }
          >
            {({ isActive }) => (
              <Logo
                data={LOGO_DATA[0]}
                media={isMobile ? 'mobile' : null}
                placement={`nav`}
                isActive={isActive}
              />
            )}
          </NavLink>
          <ul className='nav__list'>
            {NAV_DATA[0].mainNav.list.map(li => (
              <li key={li.label} className='nav__item'>
                {li.action ? (
                  <a
                    onClick={e => {
                      li.action(e, navigate, location);
                      closeDrawer();
                    }}
                    href={li.link}
                    className='nav__link'
                    data-scroll={li.scroll}
                  >
                    <SymbolOrIcon
                      type={li.icon ? 'ICON' : 'SYMBOL'}
                      specifier={li.icon || li.symbol}
                    />
                    {li.label}
                  </a>
                ) : (
                  <NavLink
                    to={li.link}
                    onClick={() => {
                      closeDrawer();
                      window.scrollTo(0, 0);
                    }}
                    className={({ isActive }) =>
                      isActive ? 'nav__link active' : 'nav__link'
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <SymbolOrIcon
                          specifier={li.symbol}
                          extraClass={isActive ? 'active' : ''}
                        />
                        {li.label}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
        <ul className='nav__list nav__list--side'>
          {sideNavItems.map(li => liContent(li))}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
