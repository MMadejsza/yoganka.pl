import { Helmet } from 'react-helmet';
import CampsBenefitsSection from '../../components/frontend/camps/CampsBenefitsSection.jsx';
import CampsGalerySection from '../../components/frontend/camps/CampsGalerySection.jsx';
import CampsIntoSection from '../../components/frontend/camps/CampsIntoSection.jsx';
import CampsReviewsSection from '../../components/frontend/camps/CampsReviewsSection.jsx';
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
        <title>Yoganka - Wyjazdy</title>
        <link rel='canonical' href='https://yoganka.pl/wyjazdy' />
      </Helmet>
      <CampsIntoSection />
      <CampsBenefitsSection />
      <OfferSection products={products} />
      <CampsReviewsSection />
      <CampsGalerySection camps={CAMPS_DATA} isMobile={true} />
    </>
  );
}

export default CampsPage;
