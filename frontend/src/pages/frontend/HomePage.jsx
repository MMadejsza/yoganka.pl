import { Helmet } from 'react-helmet';
import About from '../../components/frontend/About.jsx';
import Certificates from '../../components/frontend/Certificates.jsx';
import HeaderMain from '../../components/frontend/HeaderMain.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import Partners from '../../components/frontend/Partners.jsx';
import { CAMPS_DATA } from '../../DATA/CAMPS_DATA.js';
import { CLASSES_DATA } from '../../DATA/CLASSES_DATA.js';
import { EVENTS_DATA } from '../../DATA/EVENTS_DATA.js';

const products = [
  {
    id: 'wyjazdy',
    header: `Kobiece Wyjazdy z\u00a0Jogą`,
    data: CAMPS_DATA,
    limit: 2,
    moreLink: '/wyjazdy',
  },
  { id: 'zajecia', header: `Zajęcia`, data: CLASSES_DATA },
  {
    id: 'wydarzenia',
    header: `Wydarzenia`,
    data: EVENTS_DATA,
    // moreLink: '/wydarzenia',
    specifier: 'events',
  },
];
function HomePage() {
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  const isMobile = mediaQuery.matches;
  return (
    <>
      <Helmet>
        <title>Yoganka</title>
        <link rel='canonical' href='https://yoganka.pl/' />
      </Helmet>
      {isMobile ? <HeaderMain /> : null}
      <About isMobile={isMobile} />
      <OfferSection products={products} />
      <Certificates />
      <Partners />
    </>
  );
}

export default HomePage;
