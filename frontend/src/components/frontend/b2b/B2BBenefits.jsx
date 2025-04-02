import { BENEFITS } from '../../../DATA/B2B_DATA.js';
import Section from '../../frontend/Section.jsx';

function B2BBenefits() {
  const iconClass =
    'fa-solid fa-check modal-checklist__icon modal__icon modal-checklist__icon';
  const content = BENEFITS.list.map((item, index) => {
    // if simple list -> item == string otherwise list of objects from freeTime
    return (
      <li key={index} className='modal-checklist__li'>
        <i className={iconClass} aria-hidden='true'></i>
        {item}
      </li>
    );
  });

  const dynamicClass = `modal-checklist modal-checklist--inclded`;

  return (
    <Section classy={'b2b-benefits'} header='BENEFITY DLA&nbsp;FIRMY'>
      <section className={dynamicClass}>
        <ul className='modal-checklist__list'>{content}</ul>
      </section>
    </Section>
  );
}

export default B2BBenefits;
