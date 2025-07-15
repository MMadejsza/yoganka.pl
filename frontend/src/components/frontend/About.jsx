import Bio from './Bio.jsx';
import Logo from './Logo.jsx';
import Section from './Section.jsx';
import StampedImg from './imgsRelated/StampedImg.jsx';

function About({ isMobile, data, logo }) {
  console.log(data.about[0].image.portraitImage);
  return (
    <Section classy='about' header={data.about[0].sectionTitle}>
      {isMobile ? null : (
        <Logo type='writtenLogo' data={logo} placement={`logo-writing`} />
      )}
      <StampedImg
        placement='about'
        img={data.about[0].image.portraitImage}
        stamps={[data.about[0].image.stamp1, data.about[0].image.stamp2]}
      />
      <Bio
        placement='about'
        data={data.about[0].bio}
        motto={data.motto}
        isMobile={isMobile}
      />
    </Section>
  );
}

export default About;
