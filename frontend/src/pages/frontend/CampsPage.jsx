import { Helmet } from 'react-helmet';
import CampsBenefitsSection from '../../components/frontend/camps/CampsBenefitsSection.jsx';
import CampsGalerySection from '../../components/frontend/camps/CampsGalerySection.jsx';
import CampsIntoSection from '../../components/frontend/camps/CampsIntoSection.jsx';
import ReviewsSection from '../../components/frontend/camps/ReviewsSection.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import { CAMPS_DATA } from '../../DATA/CAMPS_DATA.js';

const products = [
  { id: 'wyjazdy', header: `Wybierz swój wyjazd`, data: CAMPS_DATA, limit: 0 },
];
function CampsPage() {
  // const mediaQuery = window.matchMedia('(max-width: 1025px)');
  // const isMobile = mediaQuery.matches;
  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>Wyjazdy Joga – Polska i zagranica | Yoganka</title>
        <meta
          name='description'
          content='Wyjazdy jogowe w Polsce - praktyka jogi, medytacja i regeneracja. Sprawdź ofertę najbliższych wyjazdów z Yoganką.'
        />
        <meta
          name='keywords'
          content='wyjazdy z jogą, joga w naturze, retreat jogowy, wyjazd weekendowy joga'
        />
        <meta name='author' content='MMadejsza' />
        <link rel='canonical' href='https://yoganka.pl/wyjazdy' />
        <meta name='robots' content='index, follow' />
        <meta property='og:locale' content='pl_PL' />
        <meta property='og:title' content='Wyjazdy z Jogą – Yoganka' />
        <meta
          property='og:description'
          content='Weekendowe i tygodniowe wyjazdy z jogą, zdrową kuchnią i mindfulness. Sprawdź terminy i zapisz się!'
        />
        <meta property='og:url' content='https://yoganka.pl/wyjazdy' />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/favicon_io/apple-touch-icon.png' />
      </Helmet>
      <CampsIntoSection />
      <CampsBenefitsSection />
      <OfferSection products={products} />
      <ReviewsSection />
      <CampsGalerySection camps={CAMPS_DATA} isMobile={true} />
    </>
  );
}

export default CampsPage;
