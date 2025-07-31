import { useLocation } from 'react-router-dom';
import { protectWordBreaks } from '../../utils/validation.js';
import SanityImage from './imgsRelated/SanityImage.jsx';
import Section from './Section.jsx';

function IntroSection({ modifier, className, extraClass, data }) {
  const location = useLocation();
  const bcgImg = data?.backgroundImage;
  const prefix = 'home-intro';
  console.log(bcgImg);

  return (
    <Section
      classy={className}
      modifier={modifier ?? 'no-bcg-pic'}
      header={data.sectionTitle}
      iSpecific={true}
      key={location.pathname}
    >
      {bcgImg && (
        <SanityImage
          image={bcgImg}
          variant='headerBackground'
          className={`${prefix}__img`}
        />
      )}
      {data.list?.length > 0 && (
        <article
          className={`${className}__welcome-desc${
            extraClass ? ` ${extraClass}` : ''
          }`}
        >
          {data.list.map((p, index) => (
            <p key={index} className={`${className}__paragraph`}>
              {protectWordBreaks(p)}
            </p>
          ))}
        </article>
      )}
    </Section>
  );
}

export default IntroSection;
