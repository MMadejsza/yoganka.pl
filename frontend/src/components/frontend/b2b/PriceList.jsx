import { BTNS } from '../../../DATA/B2B_DATA.js';
import Section from '../../../components/frontend/Section.jsx';
import SymbolOrIcon from '../../common/SymbolOrIcon';

function PriceList() {
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  const isNotMobile = !mediaQuery.matches;
  const renderBtns = BTNS.btnsContent.map((btn, index) => {
    if (btn.action === 'subPage') {
      return (
        <Link
          key={index}
          to={btn.link}
          title={btn.title}
          className={`tile__btn tile__btn--${data.fileName}`}
        >
          {btn.icon ? (
            <SymbolOrIcon type={'ICON'} specifier={btn.icon} />
          ) : null}
          {btn.text}
        </Link>
      );
    } else if (isNotMobile && btn.symbol == 'phone') {
      return null;
    } else {
      return (
        <a
          onClick={btn.action === 'scroll' ? e => smoothScrollInto(e) : null}
          key={index + btn.title}
          target='_blank'
          href={btn.link}
          title={btn.title}
          className={`tile__btn modal__btn`}
        >
          <SymbolOrIcon
            type={btn.icon ? 'ICON' : 'SYMBOL'}
            specifier={btn.icon || btn.symbol}
          />
          {btn.text}
        </a>
      );
    }
  });

  return (
    <Section classy='b2b-price' header='Cennik i&nbsp;współpraca'>
      <article className='b2b-price__content'>
        <p className='b2b-price__p'>
          Oferta jest elastyczna i&nbsp;dopasowana do&nbsp;potrzeb Twojej firmy.
        </p>
        <p className='b2b-price__p'>
          Skontaktuj się&nbsp;po szczegóły i&nbsp;indywidualną wycenę,
          a&nbsp;wspólnie stworzymy plan, który&nbsp;przyniesie najlepsze efekty
          dla&nbsp;Twojego zespołu.
        </p>
        {renderBtns}
      </article>
    </Section>
  );
}

export default PriceList;
