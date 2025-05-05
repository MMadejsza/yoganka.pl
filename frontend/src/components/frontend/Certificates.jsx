import { CERTIFICATES_DATA } from '../../DATA/CERTIFICATES_DATA.js';
import Section from './Section.jsx';
import GlideContainer from './glide/GlideContainer.jsx';

function Certificates() {
  const leadingClass = 'certificates';
  return (
    <>
      <Section classy={leadingClass} header='Certyfikaty'>
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
          slides={CERTIFICATES_DATA}
          leadingClass={leadingClass}
        />
      </Section>
    </>
  );
}

export default Certificates;
