import Buttons from '../../../components/frontend/Buttons.jsx';
import Section from '../../../components/frontend/Section.jsx';

function PriceList({ content, modifier, children = [], id }) {
  const areBtns = Object.entries(content.btnsContent).length > 0;
  const renderBtns = areBtns ? (
    <footer
      className={`modal__user-action ${
        modifier ? `modal__user-action--${modifier}` : ''
      }`}
    >
      <Buttons list={content.btnsContent} />
    </footer>
  ) : null;

  return (
    <Section classy='b2b-price' header={content.sectionTitle} id={id}>
      <article className='b2b-price__content'>
        {content.desc.map((pContent, index) => (
          <p key={index} className='b2b-price__p'>
            {pContent}
          </p>
        ))}
        {children}
        {renderBtns}
      </article>
    </Section>
  );
}

export default PriceList;
