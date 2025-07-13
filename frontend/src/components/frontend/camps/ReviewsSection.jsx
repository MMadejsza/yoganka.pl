import { useQuery } from '@tanstack/react-query';
import { client } from '../../../utils/sanityClient.js';
import Loader from '../../common/Loader.jsx';
import Section from '../../frontend/Section.jsx';
import GlideContainer from '../glide/GlideContainer.jsx';

function ReviewsSection({ placement }) {
  const leadingClass = 'reviews';

  const { data: REVIEWS_SECTION_DATA, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviewData'],
    queryFn: () => client.fetch(`*[_type == "review"]`),
  });

  if (reviewsLoading) {
    return <Loader label={'Ładowanie'} />;
  }
  return (
    <>
      <Section
        classy={leadingClass}
        header={REVIEWS_SECTION_DATA[0].sectionTitle}
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
          slides={REVIEWS_SECTION_DATA[0].list}
          leadingClass={leadingClass}
        />
      </Section>
    </>
  );
}

export default ReviewsSection;
