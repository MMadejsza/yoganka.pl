import { useQuery } from '@tanstack/react-query';
import Loader from '../../components/common/Loader.jsx';
import GlideContainer from '../../components/frontend/glide/GlideContainer.jsx';
import SimpleGallery from '../../components/frontend/glide/SimpleGallery.jsx';
import IntroSection from '../../components/frontend/IntroSection.jsx';
import OfferType from '../../components/frontend/OfferType.jsx';
import Section from '../../components/frontend/Section.jsx';
import Seo from '../../components/frontend/Seo.jsx';
import TurningTilesSection from '../../components/frontend/TurningTilesSection.jsx';
import {
  campGroQ,
  campsBenefitsGroQ,
  campsIntroGroQ,
  campsOfferGroQ,
  campsPastPhotosGroQ,
  campsSeoGroQ,
  reviewsGroQ,
} from '../../utils/httpGroq.js';
import { client } from '../../utils/sanityClient.js';

function CampsPage() {
  let camps;

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };

  const { data: CAMPS_SEO_DATA, isLoading: campsSeoDataLoading } = useQuery({
    queryKey: ['campsSeoData'],
    queryFn: () => client.fetch(campsSeoGroQ),
    ...cacheConfig,
  });
  const { data: CAMPS_INTRO_SECTION_DATA, isLoading: campsIntroLoading } =
    useQuery({
      queryKey: ['campsIntroData'],
      queryFn: () => client.fetch(campsIntroGroQ),
      ...cacheConfig,
    });
  const {
    data: CAMPS_OFFER_SECTION_DATA,
    isLoading: campsOfferSectionLoading,
  } = useQuery({
    queryKey: ['campsOfferData'],
    queryFn: () => client.fetch(campsOfferGroQ),
    ...cacheConfig,
  });
  const { data: CAMPS_DATA, isLoading: campsLoading } = useQuery({
    queryKey: ['campsData'],
    queryFn: () => client.fetch(campGroQ),
    ...cacheConfig,
  });
  const { data: CAMPS_BENEFITS_SECTION_DATA, isLoading: campsBenefitsLoading } =
    useQuery({
      queryKey: ['campsBenefitsData'],
      queryFn: () => client.fetch(campsBenefitsGroQ),
      ...cacheConfig,
    });
  const {
    data: CAMPS_PAST_GALLERY_SECTION_DATA,
    isLoading: campsPhotosLoading,
  } = useQuery({
    queryKey: ['campsPhotosData'],
    queryFn: () => client.fetch(campsPastPhotosGroQ),
    ...cacheConfig,
  });
  const { data: REVIEWS_SECTION_DATA, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviewData'],
    queryFn: () => client.fetch(reviewsGroQ),
    ...cacheConfig,
  });

  if (
    campsSeoDataLoading ||
    campsIntroLoading ||
    campsOfferSectionLoading ||
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
    CAMPS_OFFER_SECTION_DATA,
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
      {
        id: 'camps',
        header: CAMPS_OFFER_SECTION_DATA.title,
        data: camps,
        limit: 0,
      },
    ];

    content = (
      <>
        <IntroSection
          modifier={'dummy'}
          className={`intro`}
          data={CAMPS_INTRO_SECTION_DATA}
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

        <Section
          classy={`section--reviews`}
          header={REVIEWS_SECTION_DATA.sectionTitle}
        >
          <GlideContainer
            glideConfig={{
              type: 'carousel',
              // startAt: 0,
              perView: 2,
              focusAt: 'center',
              gap: 20,
              autoplay: 2200,
              animationDuration: 800,
            }}
            glideBreakpoints={{
              // <=
              360: { perView: 1 },
              480: { perView: 1 },
              1024: { perView: 1 },
            }}
            type='review'
            slides={REVIEWS_SECTION_DATA.list}
          />
        </Section>

        <SimpleGallery
          givenGallery={CAMPS_PAST_GALLERY_SECTION_DATA.gallery}
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
          title={CAMPS_PAST_GALLERY_SECTION_DATA.sectionTitle}
        />
      </>
    );
  }

  return (
    <>
      <Seo
        title={CAMPS_SEO_DATA.seoTitle}
        description={CAMPS_SEO_DATA.seoDescription}
        keywords={CAMPS_SEO_DATA.seoKeywords}
        canonical='https://yoganka.pl/wyjazdy'
      />
      {content}
    </>
  );
}

export default CampsPage;
