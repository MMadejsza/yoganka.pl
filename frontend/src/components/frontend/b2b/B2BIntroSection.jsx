import { useLocation } from 'react-router-dom';
import Section from '../Section.jsx';
function B2BIntroSection({ content }) {
  const location = useLocation();
  return (
    <Section
      classy='camps-intro'
      modifier='b2b'
      header={content.sectionTitle}
      key={location.pathname}
    >
      <article className='about__bio--content camps-intro__welcome-desc b2b-intro'>
        {content.list.map((pContent, index) => (
          <p
            key={`${content.list._id}-${index}`}
            className='about__bio--description'
          >
            {pContent}
          </p>
        ))}
      </article>
    </Section>
  );
}

export default B2BIntroSection;
