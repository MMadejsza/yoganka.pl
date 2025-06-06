import { renderJointGalery } from '../../../utils/utils.jsx';
import Section from '../Section.jsx';
import GlideContainer from '../glide/GlideContainer.jsx';

function CampsGalerySection({ camps, isMobile }) {
  const leadingClass = 'galery';
  const todayRaw = new Date();
  const today = todayRaw.toISOString().split('T')[0];
  const retroCamps = camps.filter(camp => camp.date < today);
  return (
    <>
      <Section classy={leadingClass} header='Jak to wyglądało?'>
        {isMobile ? (
          <GlideContainer
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
            type='allPhotos'
            slides={retroCamps}
            leadingClass={leadingClass}
          />
        ) : (
          <main className={`${leadingClass}__container`}>
            {renderJointGalery(camps)}
          </main>
        )}
      </Section>
    </>
  );
}

export default CampsGalerySection;
