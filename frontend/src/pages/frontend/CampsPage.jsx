import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Loader from '../../components/common/Loader.jsx';
import ReviewsSection from '../../components/frontend/camps/ReviewsSection.jsx';
import SimpleGallery from '../../components/frontend/glide/SimpleGallery.jsx';
import IntroSection from '../../components/frontend/IntroSection.jsx';
import OfferType from '../../components/frontend/OfferType.jsx';
import Section from '../../components/frontend/Section.jsx';
import TurningTilesSection from '../../components/frontend/TurningTilesSection.jsx';
import { client } from '../../utils/sanityClient.js';

function CampsPage() {
  let camps;

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };

  const { data: CAMPS_INTRO_SECTION_DATA, isLoading: campsIntroLoading } =
    useQuery({
      queryKey: ['campsIntroData'],
      queryFn: () => client.fetch(`*[_type == "campsIntro"]`),
      ...cacheConfig,
    });
  const { data: CAMPS_DATA, isLoading: campsLoading } = useQuery({
    queryKey: ['campsData'],
    queryFn: () => client.fetch(`*[_type == "camp"]`),
    ...cacheConfig,
  });
  const { data: CAMPS_BENEFITS_SECTION_DATA, isLoading: campsBenefitsLoading } =
    useQuery({
      queryKey: ['campsBenefitsData'],
      queryFn: () => client.fetch(`*[_type == "benefits"]`),
      ...cacheConfig,
    });
  const {
    data: CAMPS_PAST_GALLERY_SECTION_DATA,
    isLoading: campsPhotosLoading,
  } = useQuery({
    queryKey: ['campsPhotosData'],
    queryFn: () => client.fetch(`*[_type == "campsPhotos"]`),
    ...cacheConfig,
  });
  const { data: REVIEWS_SECTION_DATA, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviewData'],
    queryFn: () => client.fetch(`*[_type == "review"]`),
    ...cacheConfig,
  });

  if (
    campsIntroLoading ||
    campsLoading ||
    campsBenefitsLoading ||
    reviewsLoading ||
    campsPhotosLoading
  ) {
    return <Loader label={'Ładowanie'} />;
  }

  let content = null;
  let products = null;
  const dataSets = [
    CAMPS_INTRO_SECTION_DATA,
    CAMPS_DATA,
    CAMPS_BENEFITS_SECTION_DATA,
    CAMPS_PAST_GALLERY_SECTION_DATA,
    REVIEWS_SECTION_DATA,
  ];
  const anyEmpty = dataSets.some(data => !data || data.length === 0);

  if (!anyEmpty) {
    // console.log(CAMPS_DATA);
    camps = CAMPS_DATA.map(c => ({
      ...c,
      link: c.slug.current,
      type: c._type,
    }));

    products = [
      { id: 'wyjazdy', header: `Wybierz swój wyjazd`, data: camps, limit: 0 },
    ];

    content = (
      <>
        <IntroSection
          modifier={'dummy'}
          className={`intro`}
          data={CAMPS_INTRO_SECTION_DATA[0]}
        />

        <TurningTilesSection data={CAMPS_BENEFITS_SECTION_DATA} />

        <Section classy={`section--offer`}>
          {products.map(product => (
            <OfferType
              key={product.id}
              id={product.id}
              header={product.header}
              data={product.data}
              limit={product.limit}
              specifier={product.specifier}
              moreLink={product.moreLink ? product.moreLink : null}
            />
          ))}
        </Section>

        <ReviewsSection data={REVIEWS_SECTION_DATA} />

        <SimpleGallery
          givenGallery={CAMPS_PAST_GALLERY_SECTION_DATA[0].gallery}
          glideConfig={{
            type: 'carousel',
            perView: 2,
            focusAt: 'center',
            gap: 20,
            autoplay: 2200,
            animationDuration: 800,
          }}
          glideBreakpoints={{
            1024: { perView: 1 },
          }}
          title={CAMPS_PAST_GALLERY_SECTION_DATA[0].sectionTitle}
        />
      </>
    );
  }

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
      {content}
    </>
  );
}

export default CampsPage;
