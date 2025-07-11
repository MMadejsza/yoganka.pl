import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useLocation } from 'react-router-dom';
import TabsList from '../../components/backend/TabsList.jsx';
import Benefits from '../../components/frontend/b2b/B2BBenefits.jsx';
import CampsGalerySection from '../../components/frontend/camps/CampsGalerySection.jsx';
import ClassesIntro from '../../components/frontend/classes/ClassesIntro.jsx';

const menuSet = [
  {
    name: 'Online',
    symbol: 'computer',
    link: 'online',
    limitedTo: 'customer',
  },
  {
    name: 'Stacjonarne',
    symbol: 'cottage',
    link: 'stacjonarne',
    limitedTo: 'customer',
  },
];

function ClassesPage() {
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  const isMobile = mediaQuery.matches;
  const location = useLocation();
  const isOffline = location.pathname.includes('/stacjonarne');
  const label = isOffline ? 'stacjonarne' : 'online';

  useEffect(() => {
    const wrapper = document.body.querySelector('.wrapper');
    if (wrapper) {
      wrapper.classList.add('b2b');
    }
    return () => {
      // deleting on unmount
      if (wrapper) {
        wrapper.classList.remove('b2b');
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Yoganka - Zajęcia {label}</title>
        <link rel='canonical' href={`https://yoganka.pl/zajecia/${label}`} />
      </Helmet>
      <ClassesIntro isMobile={isMobile} />
      <CampsGalerySection
        givenGalleryData={[
          // like 1 camp
          {
            pastGalleryPath: `/imgs/offer/events/main_gallery`,
            fileName: 'kobiece_wydarzenia_z_yoganka',
            pastGallerySize: 11,
            size: 11,
          },
        ]}
        // camps={CAMPS_DATA}
        isMobile={true}
        title={null}
      />
      <Benefits
      // title='Dzięki JODZE:'
      // modifier='classes-page'
      // list={[
      //   `Dbasz o stawy`,
      //   `Wzmacniasz mięśnie`,
      //   `Redukujesz ból`,
      //   `Zmniejszasz napięcia w\u00a0ciele`,
      //   `Koisz myśli`,
      // ]}
      // content={}
      />
      <main>
        <TabsList
          menuSet={menuSet}
          linkEnd={`/zajecia`}
          classModifier={`classes-page`}
        />
        <Outlet />
        {!isOffline && (
          <TabsList
            menuSet={menuSet}
            linkEnd={`/zajecia`}
            classModifier={`classes-page`}
          />
        )}
      </main>
    </>
  );
}

export default ClassesPage;
