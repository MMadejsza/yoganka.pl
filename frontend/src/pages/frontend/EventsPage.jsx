import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Loader from '../../components/common/Loader.jsx';
// import CampsGalerySection from '../../components/frontend/camps/CampsGalerySection.jsx';
import EventsIntroSection from '../../components/frontend/events/EventsIntroSection.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import { client } from '../../utils/sanityClient.js';

function EventsPage() {
  let events;
  const { data: EVENTS_DATA, isLoading: eventsLoading } = useQuery({
    queryKey: ['eventsData'],
    queryFn: () => client.fetch(`*[_type == "event"]`),
  });

  if (eventsLoading) {
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
      <EventsIntroSection />
      {contentLoaded && (
        <OfferSection products={products} extraClass={'events'} />
      )}
      {/* {contentLoaded && (
        <CampsGalerySection
          givenGalleryData={[
            // like 1 camp
            {
              pastGalleryPath: `/imgs/offer/events/main_gallery`,
              fileName: 'kobiece_wydarzenia_z_yoganka',
              pastGallerySize: 11,
              size: 11,
            },
          ]}
          // camps={CAMPS_DATA}
          isMobile={true}
          title={'Wspomnienia poprzednich edycji:'}
        />
      )} */}
    </>
  );
}

export default EventsPage;
