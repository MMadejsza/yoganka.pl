import { useLocation } from 'react-router-dom';
import Section from '../Section.jsx';
function B2BIntroSection() {
  const location = useLocation();
  return (
    <Section
      classy='camps-intro'
      modifier='b2b'
      header={`Joga dla firm`}
      key={location.pathname}
    >
      <article className='about__bio--content camps-intro__welcome-desc b2b-intro'>
        <p className='about__bio--description'>
          Twój biznes musi się&nbsp;ruszać!
        </p>
        <p className='about__bio--description'>
          W&nbsp;dynamicznym środowisku pracy joga staje się&nbsp;nieocenionym
          wsparciem dla&nbsp;organizacji, które&nbsp;chcą budować zdrową,
          zmotywowaną i&nbsp;odporną na stres kulturę pracy. Proponuję zajęcia
          dostosowane do&nbsp;potrzeb Twojego zespołu, które&nbsp;pomogą
          zwiększyć efektywność, poprawić samopoczucie pracowników
          i&nbsp;zminimalizować skutki przeciążenia pracą.
        </p>
      </article>
    </Section>
  );
}

export default B2BIntroSection;
