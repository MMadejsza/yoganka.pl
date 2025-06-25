import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Benefits from '../../components/frontend/b2b/B2BBenefits.jsx';
import B2BOptionsSection from '../../components/frontend/b2b/B2BBenefitsSection.jsx';
import B2BIntroSection from '../../components/frontend/b2b/B2BIntroSection.jsx';
import PriceList from '../../components/frontend/b2b/PriceList.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import { BTNS, OFFER, TYPES } from '../../DATA/B2B_DATA.js';

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
        <html lang='pl' />
        <title>Joga dla Firm - Treningi i Wellbeing | Yoganka</title>
        <meta
          name='description'
          content='Zadbaj o zdrowie psychiczne i fizyczne pracowników. Zajęcia jogi dla firm w całej Polsce - online i stacjonarnie.'
        />
        <meta
          name='keywords'
          content='joga dla firm, wellbeing, joga w pracy, benefit dla pracowników'
        />
        <meta name='author' content='MMadejsza' />
        <link rel='canonical' href='https://yoganka.pl/yoga-dla-firm' />
        <meta name='robots' content='index, follow' />
        <meta property='og:locale' content='pl_PL' />
        <meta property='og:title' content='Joga dla Firm – Yoganka' />
        <meta
          property='og:description'
          content='Profesjonalne zajęcia jogi dla pracowników, zespołów i eventów firmowych. Online lub na miejscu.'
        />
        <meta property='og:url' content='https://yoganka.pl/yoga-dla-firm' />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/favicon_io/apple-touch-icon.png' />
      </Helmet>
      <B2BIntroSection />
      <B2BOptionsSection title={'ZORGANIZUJĘ JAKO:'} list={TYPES} />
      <OfferSection products={products} />
      <Benefits title={`BENEFITY DLA\u00A0FIRMY`} />
      <PriceList
        title={`Cennik i\u00A0współpraca`}
        btns={BTNS}
        desc={[
          `Oferta jest elastyczna i\u00A0dopasowana do\u00A0potrzeb Twojej firmy.`,
          `Skontaktuj się\u00A0po szczegóły i\u00A0indywidualną wycenę,
          a\u00A0wspólnie stworzymy plan, który\u00A0przyniesie najlepsze efekty
          dla\u00A0Twojego zespołu.`,
        ]}
        modifier={'classes-page'}
      />
    </>
  );
}

export default B2BPage;
