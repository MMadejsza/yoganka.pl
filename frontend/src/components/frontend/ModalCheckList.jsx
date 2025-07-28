import SymbolOrIcon from '../common/SymbolOrIcon';

function ModalCheckList({ content, modifier }) {
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
      <li key={index} className='checklist__li'>
        <SymbolOrIcon
          type={type}
          specifier={symbol}
          extraClass={'checklist__icon modal__icon checklist__icon'}
          aria-hidden='true'
        />
        {item}
      </li>
    );
  });

  const dynamicClass = `checklist__list${
    modifier ? ` checklist__list--${modifier}` : ''
  }`;

  return <ul className={dynamicClass}>{formattedContent}</ul>;
}

export default ModalCheckList;
