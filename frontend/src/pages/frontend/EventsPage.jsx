import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Loader from '../../components/common/Loader.jsx';
import SimpleGallery from '../../components/frontend/glide/SimpleGallery.jsx';
import IntroSection from '../../components/frontend/IntroSection.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import { client } from '../../utils/sanityClient.js';

function EventsPage() {
  let events;

  const cacheConfig = { staleTime: 1000 * 60 * 10, cacheTime: 1000 * 60 * 15 };
  const { data: EVENTS_INTRO_SECTION_DATA, isLoading: eventsIntroLoading } =
    useQuery({
      queryKey: ['eventsIntroData'],
      queryFn: () => client.fetch(`*[_type == "eventsIntro"]`),
      ...cacheConfig,
    });
  const { data: EVENTS_DATA, isLoading: eventsLoading } = useQuery({
    queryKey: ['eventsData'],
    queryFn: () => client.fetch(`*[_type == "event"]`),
    ...cacheConfig,
  });
  const {
    data: EVENTS_PAST_GALLERY_SECTION_DATA,
    isLoading: eventsPhotosLoading,
  } = useQuery({
    queryKey: ['eventsPhotosData'],
    queryFn: () => client.fetch(`*[_type == "eventsPhotos"]`),
    ...cacheConfig,
  });

  if (eventsLoading || eventsIntroLoading || eventsPhotosLoading) {
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
        header: `Nadchodzące wydarzenia:`,
        data: events,
        limit: 0,
      },
    ];
  }
  return (
    <>
      <Helmet>
        <title>Yoganka - Wydarzenia</title>
        <link rel='canonical' href='https://yoganka.pl/wydarzenia' />
      </Helmet>
      <IntroSection
        modifier={`no-bcg-pic`}
        className={`camps-intro`}
        data={EVENTS_INTRO_SECTION_DATA[0]}
      />
      {contentLoaded && (
        <OfferSection products={products} extraClass={'events'} />
      )}
      <SimpleGallery
        givenGallery={EVENTS_PAST_GALLERY_SECTION_DATA[0].gallery}
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
        title={EVENTS_PAST_GALLERY_SECTION_DATA[0].sectionTitle}
      />
    </>
  );
}

export default EventsPage;
