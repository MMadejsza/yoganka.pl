import { useLocation } from 'react-router-dom';
import Section from './Section.jsx';

function IntroSection({ modifier, className, extraClass, data }) {
  const location = useLocation();

  return (
    <Section
      classy={className}
      modifier={modifier ?? 'no-bcg-pic'}
      header={data.sectionTitle}
      iSpecific={true}
      key={location.pathname}
    >
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
