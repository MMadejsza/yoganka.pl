import Section from '../Section.jsx';
import GlideContainer from './GlideContainer.jsx';

function SimpleGallery({
  givenGallery = [],
  glideConfig,
  glideBreakpoints,
  title,
}) {
  return (
    <>
      <Section classy={`section--gallery`} header={title}>
        <GlideContainer
          glideConfig={glideConfig}
          glideBreakpoints={glideBreakpoints}
          type='allPhotos'
          slides={givenGallery}
        />
      </Section>
    </>
  );
}

export default SimpleGallery;
