import { BENEFITS } from '../../../DATA/B2B_DATA.js';
import SymbolOrIcon from '../../common/SymbolOrIcon';
import Section from '../../frontend/Section.jsx';

function B2BBenefits() {
  const content = BENEFITS.list.map((item, index) => {
    // if simple list -> item == string otherwise list of objects from freeTime
    return (
      <li key={index} className='modal-checklist__li'>
        <SymbolOrIcon
          type='ICON'
          specifier={'fa-solid fa-check'}
          extraClass={'modal-checklist__icon modal__icon modal-checklist__icon'}
          aria-hidden='true'
        />
        {item}
      </li>
    );
  });

  const dynamicClass = `modal-checklist modal-checklist--included`;

  return (
    <Section classy={'b2b-benefits'} header='BENEFITY DLA&nbsp;FIRMY'>
      <section className={dynamicClass}>
        <ul className='modal-checklist__list'>{content}</ul>
      </section>
    </Section>
  );
}

export default B2BBenefits;
