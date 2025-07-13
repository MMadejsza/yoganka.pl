import { useQuery } from '@tanstack/react-query';
import { client } from '../../utils/sanityClient.js';
import Loader from '../common/Loader.jsx';
import GlideContainer from './glide/GlideContainer.jsx';
import Section from './Section.jsx';

function Certificates() {
  const leadingClass = 'certificates';

  const { data: CERTIFICATES_SECTION_DATA, isLoading: certificatesLoading } =
    useQuery({
      queryKey: ['certificatesData'],
      queryFn: () => client.fetch(`*[_type == "certificates"]`),
    });

  if (certificatesLoading) {
    return <Loader label={'Ładowanie'} />;
  }
  return (
    <>
      <Section
        classy={leadingClass}
        header={CERTIFICATES_SECTION_DATA[0].sectionTitle}
      >
        <GlideContainer
          glideConfig={{
            type: 'carousel',
            // startAt: 0,
            perView: 5,
            focusAt: 'center',
            gap: 20,
            autoplay: 2200,
            animationDuration: 800,
          }}
          type='tile'
          slides={CERTIFICATES_SECTION_DATA[0].list}
          leadingClass={leadingClass}
        />
      </Section>
    </>
  );
}

export default Certificates;
