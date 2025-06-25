import { Helmet } from 'react-helmet';
import CampsGalerySection from '../../components/frontend/camps/CampsGalerySection.jsx';
import EventsIntroSection from '../../components/frontend/events/EventsIntroSection.jsx';
import OfferSection from '../../components/frontend/OfferSection.jsx';
import { EVENTS_DATA } from '../../DATA/EVENTS_DATA.js';

const products = [
  {
    id: 'wydarzenia',
    header: `Nadchodzące wydarzenia:`,
    data: EVENTS_DATA,
    limit: 0,
  },
];
function EventsPage() {
  // const mediaQuery = window.matchMedia('(max-width: 1025px)');
  // const isMobile = mediaQuery.matches;
  return (
    <>
      <Helmet>
        <title>Yoganka - Wydarzenia</title>
        <link rel='canonical' href='https://yoganka.pl/wydarzenia' />
      </Helmet>
      <EventsIntroSection />
      <OfferSection products={products} extraClass={'events'} />
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
    </>
  );
}

export default EventsPage;
