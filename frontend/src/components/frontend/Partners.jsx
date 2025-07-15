import GlideContainer from './glide/GlideContainer.jsx';
import Section from './Section.jsx';

function Partners({ data }) {
  const leadingClass = 'partners';

  return (
    <Section classy={leadingClass} header={data[0].sectionTitle}>
      <GlideContainer
        glideConfig={{
          type: 'carousel',
          // startAt: 0,
          perView: 5,
          focusAt: 'center',
          gap: 30,
          // autoplay: 2200,
          animationDuration: 800,
        }}
        type='partner'
        slides={data[0].list}
        leadingClass={leadingClass}
      />
    </Section>
  );
}

export default Partners;
