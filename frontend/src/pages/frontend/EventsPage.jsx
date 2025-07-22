import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import IntroSection from '../../components/common/IntroSection.jsx';
import Loader from '../../components/common/Loader.jsx';
import SimpleGallery from '../../components/frontend/glide/SimpleGallery.jsx';
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
        <html lang='pl' />
        <title>Yoganka – Wydarzenia jogowe, warsztaty i webinary</title>
        <meta
          name='description'
          content='Sprawdź najbliższe wydarzenia Yoganka: warsztaty jogi, webinary, spotkania online i stacjonarne. Zarezerwuj swoje miejsce już dziś!'
        />
        <meta
          name='keywords'
          content='joga wydarzenia, warsztaty jogi, webinary joga, spotkania jogowe, Yoganka wydarzenia'
        />
        <meta name='author' content='MMadejsza' />
        <link rel='canonical' href='https://yoganka.pl/wydarzenia' />
        <meta name='robots' content='index, follow' />
        {/* Open Graph / Facebook */}
        <meta property='og:locale' content='pl_PL' />
        <meta property='og:type' content='website' />
        <meta
          property='og:title'
          content='Yoganka – Wydarzenia jogowe, warsztaty i webinary'
        />
        <meta
          property='og:description'
          content='Dołącz do najbliższych wydarzeń Yoganka: od intensywnych warsztatów jogi po relaksacyjne webinary. Zainspiruj się i rozwijaj praktykę!'
        />
        <meta property='og:url' content='https://yoganka.pl/wydarzenia' />
        <meta property='og:image' content='/favicon_io/apple-touch-icon.png' />
        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@yoganka_pl' /> // your Twitter
        handle
        <meta
          name='twitter:title'
          content='Yoganka – Wydarzenia jogowe, warsztaty i webinary'
        />
        <meta
          name='twitter:description'
          content='Sprawdź najbliższe wydarzenia Yoganka: warsztaty, webinary i spotkania jogowe. Zapisz się już dziś!'
        />
        <meta name='twitter:image' content='/favicon_io/apple-touch-icon.png' />
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
