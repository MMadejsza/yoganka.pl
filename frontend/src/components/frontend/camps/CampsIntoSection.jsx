import { useLocation } from 'react-router-dom';
import Section from '../../frontend/Section.jsx';

function CampsIntoSection() {
  const location = useLocation();

  return (
    <Section
      classy='camps-intro'
      modifier='camps'
      header={`Kobiece Wyjazdy z\u00a0Jogą`}
      iSpecific={true}
      key={location.pathname}
    >
      <article className='about__bio--content camps-intro__welcome-desc'>
        <p className='about__bio--description'>
          Zapraszam Cię na moje autorskie, rozwojowe weekendy z jogą w roli
          głównej. Campy są odpowiedzią na twoje potrzeby holistycznego
          projektu, który całościowo zadba o Twoje samopoczucie. To nie tylko
          ćwiczenia fizyczne ale również przestrzeń na refleksję, przywracanie
          równowagi, budowanie uważności oraz rozwijanie samoświadomości.
          Wrócisz z nową perspektywą i energią do działania. Miejsca, w których
          mieszkamy są starannie wyselekcjonowane aby wspierały proces
          regeneracji.
        </p>
        <p className='about__bio--description'>
          Poza jogą, medytacją czeka na Ciebie warsztat kreatywny/rozwojowy, a
          to wszystko w otoczeniu kojącej natury.
        </p>
        <p className='about__bio--description'>
          Na każdy wyjazd obowiązuje rezerwacja poprzez formularz oraz
          przedpłata wskazana w ofercie konkretnego campu. Liczba miejsc jest
          ograniczona, aby zadbać o Twój komfort przebywania oraz praktykowania.
        </p>
        <p className='about__bio--description'>Do błogiego zobaczenia!</p>
      </article>
    </Section>
  );
}

export default CampsIntoSection;
