import { renderGivenGalery, renderJointGalery } from '../../../utils/utils.jsx';
import Section from '../Section.jsx';
import GlideContainer from '../glide/GlideContainer.jsx';

function CampsGalerySection({ givenGalleryData = {}, camps, isMobile, title }) {
  const leadingClass = 'galery';
  const todayRaw = new Date();
  const today = todayRaw.toISOString().split('T')[0];
  const retroCamps = camps?.filter(camp => camp.date < today);
  return (
    <>
      <Section classy={leadingClass} header={title || 'Jak to wyglądało?'}>
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
            slides={givenGalleryData.length > 0 ? givenGalleryData : retroCamps}
            leadingClass={leadingClass}
          />
        ) : (
          <main className={`${leadingClass}__container`}>
            {givenGalleryData.path
              ? renderGivenGalery(givenGalleryData)
              : renderJointGalery(camps)}
          </main>
        )}
      </Section>
    </>
  );
}

export default CampsGalerySection;
