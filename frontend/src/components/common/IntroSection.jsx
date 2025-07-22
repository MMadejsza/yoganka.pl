import { useLocation } from 'react-router-dom';
import Section from '../frontend/Section.jsx';
import SanityImage from '../frontend/imgsRelated/SanityImage.jsx';

function IntroSection({ modifier, className, extraClass, data }) {
  const location = useLocation();
  const bgImg = data?.backgroundImage;
  const prefix = 'top-image-header';

  return (
    <Section
      classy={className}
      modifier={modifier ?? 'no-bcg-pic'}
      header={data.sectionTitle}
      iSpecific={true}
      key={location.pathname}
    >
      {bgImg && (
        <SanityImage
          image={bgImg}
          variant='headerBackground'
          className={`${prefix}__img`}
        />
      )}
      {data.list?.length > 0 && (
        <article
          className={`about__bio--content ${className}__welcome-desc${
            extraClass ? ` ${extraClass}` : ''
          }`}
        >
          {data.list.map((p, index) => (
            <p key={index} className='about__bio--description'>
              {p}
            </p>
          ))}
        </article>
      )}
    </Section>
  );
}

export default IntroSection;
