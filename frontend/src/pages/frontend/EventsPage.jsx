import { useQuery } from '@tanstack/react-query';
import Loader from '../../components/common/Loader.jsx';
import SimpleGallery from '../../components/frontend/glide/SimpleGallery.jsx';
import IntroSection from '../../components/frontend/IntroSection.jsx';
import OfferType from '../../components/frontend/OfferType.jsx';
import Section from '../../components/frontend/Section.jsx';
import Seo from '../../components/frontend/Seo.jsx';
import {
  eventGroQ,
  eventsIntroGroQ,
  eventsOfferGroQ,
  eventsPastPhotosGroQ,
  eventsSeoGroQ,
} from '../../utils/httpGroq.js';
import { client } from '../../utils/sanityClient.js';

function EventsPage() {
  let events;

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };

  const { data: EVENTS_SEO_DATA, isLoading: eventsSeoDataLoading } = useQuery({
    queryKey: ['eventsSeoData'],
    queryFn: () => client.fetch(eventsSeoGroQ),
    ...cacheConfig,
  });
  const { data: EVENTS_INTRO_SECTION_DATA, isLoading: eventsIntroLoading } =
    useQuery({
      queryKey: ['eventsIntroData'],
      queryFn: () => client.fetch(eventsIntroGroQ),
      ...cacheConfig,
    });
  const {
    data: EVENTS_OFFER_SECTION_DATA,
    isLoading: eventsOfferSectionLoading,
  } = useQuery({
    queryKey: ['eventsOfferData'],
    queryFn: () => client.fetch(eventsOfferGroQ),
    ...cacheConfig,
  });
  const { data: EVENTS_DATA, isLoading: eventsLoading } = useQuery({
    queryKey: ['eventsData'],
    queryFn: () => client.fetch(eventGroQ),
    ...cacheConfig,
  });
  const {
    data: EVENTS_PAST_GALLERY_SECTION_DATA,
    isLoading: eventsPhotosLoading,
  } = useQuery({
    queryKey: ['eventsPhotosData'],
    queryFn: () => client.fetch(eventsPastPhotosGroQ),
    ...cacheConfig,
  });

  if (
    eventsSeoDataLoading ||
    eventsLoading ||
    eventsOfferSectionLoading ||
    eventsIntroLoading ||
    eventsPhotosLoading
  ) {
    return <Loader label={'Ładowanie'} />;
  }

  let products = null;
  const contentLoaded = EVENTS_DATA;
  if (contentLoaded) {
    // console.log(EVENTS_DATA);
    events = EVENTS_DATA.map(e => ({
      ...e,
      link: e.slug.current,
      type: e._type,
    }));

    products = [
      {
        id: 'wydarzenia',
        header: EVENTS_OFFER_SECTION_DATA.title,
        data: events,
        limit: 0,
      },
    ];
  }
  return (
    <>
      <Seo
        title={EVENTS_SEO_DATA.seoTitle}
        description={EVENTS_SEO_DATA.seoDescription}
        keywords={EVENTS_SEO_DATA.seoKeywords}
        canonical='https://yoganka.pl/wydarzenia'
      />

      <IntroSection
        modifier={`no-bcg-pic`}
        className={`intro`}
        data={EVENTS_INTRO_SECTION_DATA}
      />

      {contentLoaded && (
        <Section classy={`section--offer`} modifier={`events`}>
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
      )}

      <SimpleGallery
        givenGallery={EVENTS_PAST_GALLERY_SECTION_DATA.gallery}
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
        title={EVENTS_PAST_GALLERY_SECTION_DATA.sectionTitle}
      />
    </>
  );
}

export default EventsPage;
