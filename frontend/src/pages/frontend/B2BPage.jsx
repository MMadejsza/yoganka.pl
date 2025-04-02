import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Benefits from '../../components/frontend/b2b/B2BBenefits.jsx';
import B2BOptionsSection from '../../components/frontend/b2b/B2BBenefitsSection.jsx';
import B2BIntroSection from '../../components/frontend/b2b/B2BIntroSection.jsx';
import PriceList from '../../components/frontend/b2b/PriceList.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import { OFFER } from '../../DATA/B2B_DATA.js';

const products = [{ id: 'b2b_offer', header: `oferta`, data: OFFER, limit: 0 }];
function B2BPage() {
  // const mediaQuery = window.matchMedia('(max-width: 1025px)');
  // const isMobile = mediaQuery.matches;
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
        <title>Yoga Dla Firm</title>
        <link rel='canonical' href='https://yoganka.pl/yoga-dla-firm' />
      </Helmet>
      <B2BIntroSection />
      <B2BOptionsSection />
      <OfferSection products={products} />
      <Benefits />
      <PriceList />
    </>
  );
}

export default B2BPage;
