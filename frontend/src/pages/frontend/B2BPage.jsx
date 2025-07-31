import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Loader from '../../components/common/Loader.jsx';
import Buttons from '../../components/frontend/Buttons.jsx';
import IntroSection from '../../components/frontend/IntroSection.jsx';
import ModalCheckList from '../../components/frontend/ModalCheckList.jsx';
import OfferType from '../../components/frontend/OfferType.jsx';
import Section from '../../components/frontend/Section.jsx';
import TurningTilesSection from '../../components/frontend/TurningTilesSection.jsx';
import {
  b2bBenefitsGroQ,
  b2bIntroGroQ,
  b2bOfferGroQ,
  b2bOfferTypesGroQ,
  b2bPriceListGroQ,
} from '../../utils/httpGroq.js';
import { client } from '../../utils/sanityClient.js';
import { assignPageCSSModifier } from '../../utils/utils.jsx';
import { protectWordBreaks } from '../../utils/validation.js';

function B2BPage() {
  useEffect(() => assignPageCSSModifier('b2b-type'), []);

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };

  const { data: INTRO, isLoading: introLoading } = useQuery({
    queryKey: ['b2bIntro'],
    queryFn: () => client.fetch(b2bIntroGroQ),
    ...cacheConfig,
  });
  const { data: OFFER, isLoading: offerLoading } = useQuery({
    queryKey: ['b2bOffer'],
    queryFn: () => client.fetch(b2bOfferGroQ),
    ...cacheConfig,
  });
  const { data: TYPES, isLoading: typesLoading } = useQuery({
    queryKey: ['b2bOfferTypes'],
    queryFn: () => client.fetch(b2bOfferTypesGroQ),
    ...cacheConfig,
  });
  const { data: BENEFITS, isLoading: benefitsLoading } = useQuery({
    queryKey: ['b2bBenefits'],
    queryFn: () => client.fetch(b2bBenefitsGroQ),
    ...cacheConfig,
  });
  const { data: PRICE_LIST, isLoading: priceListLoading } = useQuery({
    queryKey: ['b2bPriceList'],
    queryFn: () => client.fetch(b2bPriceListGroQ),
    ...cacheConfig,
  });

  if (
    introLoading ||
    offerLoading ||
    typesLoading ||
    benefitsLoading ||
    priceListLoading
  ) {
    return <Loader label={'Ładowanie'} />;
  }

  let products = null;
  if (OFFER) {
    products = [
      {
        specifier: 'b2b-offer',
        header: OFFER.sectionTitle,
        data: OFFER.list,
        limit: 0,
      },
    ];
  }
  const arePriceListBtns = Object.entries(PRICE_LIST.btnsContent).length > 0;
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
          className={`intro`}
          extraClass={'b2b-intro'}
          data={INTRO}
        />
      )}

      {OFFER && (
        <Section classy={`section--offer`}>
          {products.map((product, index) => (
            <OfferType
              key={index}
              id={product.id}
              header={product.header}
              data={product.data}
              limit={product.limit}
              specifier={product.specifier}
              moreLink={product.moreLink ? product.moreLink : null}
            />
          ))}
        </Section>
      )}

      {TYPES && <TurningTilesSection tilesModifier={'wide'} data={TYPES} />}

      {BENEFITS && (
        <Section
          classy={'section--checklist'}
          header={BENEFITS.sectionTitle}
          modifier={''}
        >
          <ModalCheckList content={BENEFITS} modifier={''} />
        </Section>
      )}

      {PRICE_LIST && (
        <Section classy='section--b2b-price' header={PRICE_LIST.sectionTitle}>
          <article className='b2b-price__content'>
            {PRICE_LIST.list.map((pContent, index) => (
              <p key={index} className='b2b-price__p'>
                {protectWordBreaks(pContent)}
              </p>
            ))}

            {arePriceListBtns && (
              <footer
                className={`modal__user-action modal__user-action--classes-page`}
              >
                <Buttons list={PRICE_LIST.btnsContent} />
              </footer>
            )}
          </article>
        </Section>
      )}
    </>
  );
}

export default B2BPage;
