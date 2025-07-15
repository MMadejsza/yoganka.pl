import Section from '../../frontend/Section.jsx';
import GlideContainer from '../glide/GlideContainer.jsx';

function ReviewsSection({ placement, data }) {
  const leadingClass = 'reviews';

  return (
    <>
      <Section
        classy={leadingClass}
        header={data[0].sectionTitle}
        modifier={placement}
      >
        <GlideContainer
          glideConfig={{
            type: 'carousel',
            // startAt: 0,
            perView: 2,
            focusAt: 'center',
            gap: 20,
            autoplay: 2200,
            animationDuration: 800,
          }}
          glideBreakpoints={{
            // <=
            360: { perView: 1 },
            480: { perView: 1 },
            1024: { perView: 1 },
          }}
          type='review'
          slides={data[0].list}
          leadingClass={leadingClass}
        />
      </Section>
    </>
  );
}

export default ReviewsSection;
