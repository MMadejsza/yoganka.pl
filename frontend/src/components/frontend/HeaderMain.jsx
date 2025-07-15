import Motto from './HeaderMotto.jsx';
import Logo from './Logo.jsx';
import Section from './Section.jsx';

function HeaderMain({ data, logo }) {
  const prefix = 'top-image-header';
  return (
    <>
      <Section
        classy={prefix}
        header={
          <Logo type='writtenLogo' data={logo} placement={`logo-writing`} />
        }
        iSpecific
      >
        <Motto content={data[0].motto} />
      </Section>
    </>
  );
}

export default HeaderMain;
