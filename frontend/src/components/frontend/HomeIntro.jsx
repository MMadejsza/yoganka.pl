import Logo from './Logo.jsx';
import Motto from './Motto.jsx';
import Section from './Section.jsx';
import SanityImage from './imgsRelated/SanityImage.jsx';

function HomeIntro({ data, logo }) {
  const prefix = 'home-intro';
  const bgImg = data[0]?.bcgImage;

  return (
    <>
      <Section
        classy={prefix}
        header={
          <Logo type='writtenLogo' data={logo} placement={`logo-writing`} />
        }
        iSpecific
      >
        <SanityImage
          image={bgImg}
          variant='headerBackground'
          className={`${prefix}__img`}
        />
        <Motto content={data[0].motto} />
      </Section>
    </>
  );
}

export default HomeIntro;
