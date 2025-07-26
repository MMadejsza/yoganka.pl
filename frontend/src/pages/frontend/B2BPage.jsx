import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import IntroSection from '../../components/common/IntroSection.jsx';
import Loader from '../../components/common/Loader.jsx';
import Benefits from '../../components/frontend/b2b/B2BBenefits.jsx';
import PriceList from '../../components/frontend/b2b/PriceList.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import TurningTilesSection from '../../components/frontend/TurningTilesSection.jsx';
import { client } from '../../utils/sanityClient.js';
import { assignPageCSSModifier } from '../../utils/utils.jsx';

function B2BPage() {
  useEffect(() => assignPageCSSModifier('b2b-type'), []);

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };

  const { data: INTRO, isLoading: introLoading } = useQuery({
    queryKey: ['b2bIntro'],
    queryFn: () => client.fetch(`*[_type == "b2bIntro"][0]`),
    ...cacheConfig,
  });
  const { data: OFFER, isLoading: offerLoading } = useQuery({
    queryKey: ['b2bOffer'],
    queryFn: () => client.fetch(`*[_type == "b2bOffer"][0]`),
    ...cacheConfig,
  });
  const { data: TYPES, isLoading: typesLoading } = useQuery({
    queryKey: ['b2bOfferTypes'],
    queryFn: () => client.fetch(`*[_type == "b2bOfferTypes"]`),
    ...cacheConfig,
  });
  const { data: BENEFITS, isLoading: benefitsLoading } = useQuery({
    queryKey: ['b2bBenefits'],
    queryFn: () => client.fetch(`*[_type == "b2bBenefits"][0]`),
    ...cacheConfig,
  });
  const { data: PRICE_LIST, isLoading: priceListLoading } = useQuery({
    queryKey: ['b2bPriceList'],
    queryFn: () => client.fetch(`*[_type == "b2bPriceListAndCooperation"][0]`),
    ...cacheConfig,
  });

  // console.log(TYPES);
  console.log(OFFER);
  // console.log(BENEFITS);
  // console.log(PRICE_LIST);
  let products = null;

  if (
    introLoading ||
    offerLoading ||
    typesLoading ||
    benefitsLoading ||
    priceListLoading
  ) {
    return <Loader label={'Ładowanie'} />;
  }

  if (OFFER) {
    products = [
      {
        id: 'b2b_offer',
        header: OFFER.sectionTitle,
        data: OFFER.list,
        limit: 0,
      },
    ];
  }

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

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={'Joga dla Firm – Yoganka'} />
        <meta
          name='twitter:description'
          content={
            'Profesjonalne zajęcia jogi dla pracowników, zespołów i eventów firmowych. Online lub na miejscu.'
          }
        />
        <meta
          name='twitter:image'
          content={'/favicon_io/apple-touch-icon.png'}
        />
      </Helmet>
      {INTRO && (
        <IntroSection
          modifier={`b2b`}
          className={`camps-intro`}
          extraClass={'b2b-intro'}
          data={INTRO}
        />
      )}
      {TYPES && <TurningTilesSection tilesModifier={'wide'} data={TYPES} />}
      {OFFER && <OfferSection products={products} />}
      {BENEFITS && <Benefits content={BENEFITS} />}
      {PRICE_LIST && (
        <PriceList content={PRICE_LIST} modifier={'classes-page'} />
      )}
    </>
  );
}

export default B2BPage;
