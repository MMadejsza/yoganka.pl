import SymbolOrIcon from '../../common/SymbolOrIcon';
import Section from '../../frontend/Section.jsx';

function B2BBenefits({ content, modifier }) {
  const rawContent = content.list;
  let symbol = null;
  let type = null;

  switch (content.listType) {
    case 'included':
      symbol = 'fa-solid fa-check';
      type = 'ICON';
      break;
    case 'excluded':
      symbol = 'fa-regular fa-hand-point-right';
      type = 'ICON';
      break;

    default:
      break;
  }

  const formattedContent = rawContent.map((item, index) => {
    // if simple list -> item == string otherwise list of objects from freeTime
    return (
      <li key={index} className='modal-checklist__li'>
        <SymbolOrIcon
          type={type}
          specifier={symbol}
          extraClass={'modal-checklist__icon modal__icon modal-checklist__icon'}
          aria-hidden='true'
        />
        {item}
      </li>
    );
  });

  const dynamicClass = `modal-checklist__list ${
    modifier ? `modal-checklist__list--${modifier}` : ''
  }`;

  return (
    <Section
      classy={'checklist-section'}
      header={content.sectionTitle}
      modifier={modifier}
    >
      {/* <section className={dynamicClass}> */}
      <ul className={dynamicClass}>{formattedContent}</ul>
      {/* </section> */}
    </Section>
  );
}

export default B2BBenefits;
