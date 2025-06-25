import { useLocation } from 'react-router-dom';
import Section from '../Section.jsx';

function EventsIntroSection() {
  const location = useLocation();

  return (
    <Section
      classy='camps-intro'
      modifier='no-bcg-pic'
      header={`Wydarzenia`}
      iSpecific={true}
      key={location.pathname}
    >
      <article className='about__bio--content camps-intro__welcome-desc'>
        <p className='about__bio--description'>
          Specjalne wydarzenia z&nbsp;jogą organizowane z&nbsp;dbałością
          o&nbsp;każdy szczegół. To doskonała alternatywa dla wyjazdów
          weekendowych, kiedy nie&nbsp;możesz sobie na nie&nbsp;pozwolić.
          Zanurzyć się w&nbsp;głębszej praktyce, zrelaksujesz i&nbsp;naładujesz
          pozytywną energią -&nbsp;wszystko w&nbsp;ciągu jednego dnia.
        </p>
        <p className='about__bio--description'>
          Rezerwujesz wejście w&nbsp;zakładce "grafik".
        </p>
      </article>
    </Section>
  );
}

export default EventsIntroSection;
