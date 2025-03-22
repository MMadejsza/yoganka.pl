import { BTNS } from '../../DATA/B2B_DATA.js';
import Section from '../Section.jsx';

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
          {btn.icon ? <i className={btn.icon} /> : null}
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
          {btn.icon ? (
            <i className={`${btn.icon} nav__icon`}></i>
          ) : btn.symbol ? (
            <span className='material-symbols-rounded nav__icon'>
              {btn.symbol}
            </span>
          ) : null}
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
