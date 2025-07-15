import Section from '../Section.jsx';
import GlideContainer from './GlideContainer.jsx';

function SimpleGallery({
  givenGallery = [],
  glideConfig,
  glideBreakpoints,
  title,
}) {
  const leadingClass = 'galery';

  return (
    <>
      <Section classy={leadingClass} header={title}>
        <GlideContainer
          glideConfig={glideConfig}
          glideBreakpoints={glideBreakpoints}
          type='allPhotos'
          slides={givenGallery}
          leadingClass={leadingClass}
        />
      </Section>
    </>
  );
}

export default SimpleGallery;
