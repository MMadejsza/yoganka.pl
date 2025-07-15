import GlideContainer from './glide/GlideContainer.jsx';
import Section from './Section.jsx';

function Certificates({ data }) {
  const leadingClass = 'certificates';

  return (
    <>
      <Section classy={leadingClass} header={data[0].sectionTitle}>
        <GlideContainer
          glideConfig={{
            type: 'carousel',
            // startAt: 0,
            perView: 5,
            focusAt: 'center',
            gap: 20,
            autoplay: 2200,
            animationDuration: 800,
          }}
          type='tile'
          slides={data[0].list}
          leadingClass={leadingClass}
        />
      </Section>
    </>
  );
}

export default Certificates;
