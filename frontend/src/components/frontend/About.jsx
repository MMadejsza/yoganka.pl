import Bio from './Bio.jsx';
import Logo from './Logo.jsx';
import Section from './Section.jsx';
import StampedImg from './imgsRelated/StampedImg.jsx';

function About({ isMobile, data, logo }) {
  console.log(data.about.image.mainImage);
  return (
    <Section classy='about' header={data.about.sectionTitle}>
      {isMobile ? null : (
        <Logo type='writtenLogo' data={logo} placement={`logo-writing`} />
      )}
      <StampedImg
        placement='about'
        img={data.about.image.mainImage}
        stamps={[data.about.image.stamp1, data.about.image.stamp2]}
      />
      <Bio
        placement='about'
        data={data.about.bio}
        motto={data.motto}
        isMobile={isMobile}
      />
    </Section>
  );
}

export default About;
