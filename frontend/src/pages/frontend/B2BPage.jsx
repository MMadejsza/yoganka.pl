import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import B2BOptionsSection from '../../components/frontend/b2b/B2BBenefitsSection.jsx';
import B2BIntroSection from '../../components/frontend/b2b/B2BIntroSection.jsx';
import { client } from '../../utils/sanityClient.js';
// import { BTNS, OFFER, TYPES } from '../../DATA/B2B_DATA.js';

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

  const { data: INTRO, isLoading: introLoading } = useQuery({
    queryKey: ['b2bIntro'],
    queryFn: () => client.fetch(`*[_type == "b2bIntro"][0]`),
  });
  const { data: OFFER, isLoading: offerLoading } = useQuery({
    queryKey: ['b2bOffer'],
    queryFn: () => client.fetch(`*[_type == "b2bOffer"][0]`),
  });
  const { data: TYPES, isLoading: typesLoading } = useQuery({
    queryKey: ['b2bOfferTypes'],
    queryFn: () => client.fetch(`*[_type == "b2bOfferTypes"][0]`),
  });
  const { data: BENEFITS, isLoading: benefitsLoading } = useQuery({
    queryKey: ['b2bBenefits'],
    queryFn: () => client.fetch(`*[_type == "b2bBenefits"][0]`),
  });
  const { data: PRICE_LIST, isLoading: priceListLoading } = useQuery({
    queryKey: ['b2bPriceList'],
    queryFn: () => client.fetch(`*[_type == "b2bPriceListAndCooperation"][0]`),
  });

  console.log(TYPES);
  console.log(OFFER);
  console.log(BENEFITS, PRICE_LIST);
  console.log(PRICE_LIST);

  const products = [
    { id: 'b2b_offer', header: `oferta`, data: OFFER, limit: 0 },
  ];
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
      {INTRO && <B2BIntroSection content={INTRO} />}
      {/* <OfferSection products={products} /> */}
      {TYPES && <B2BOptionsSection content={TYPES} />}
      {/* <Benefits title={`BENEFITY DLA\u00A0FIRMY`} /> */}
      {/* <PriceList
        title={`Cennik i\u00A0współpraca`}
        btns={BTNS}
        desc={[
          `Oferta jest elastyczna i\u00A0dopasowana do\u00A0potrzeb Twojej firmy.`,
          `Skontaktuj się\u00A0po szczegóły i\u00A0indywidualną wycenę,
          a\u00A0wspólnie stworzymy plan, który\u00A0przyniesie najlepsze efekty
          dla\u00A0Twojego zespołu.`,
        ]}
        modifier={'classes-page'}
      /> */}
    </>
  );
}

export default B2BPage;
