import { Link } from 'react-router-dom';
import Section from '../../../components/frontend/Section.jsx';
import SymbolOrIcon from '../../common/SymbolOrIcon';

function PriceList({
  btns = {},
  title,
  desc = [],
  modifier,
  children = [],
  id,
}) {
  const mediaQuery = window.matchMedia('(max-width: 1024px)');
  const isNotMobile = !mediaQuery.matches;
  const areBtns = Object.entries(btns).length > 0;
  const renderBtns = areBtns ? (
    <footer
      className={`modal__user-action ${
        modifier ? `modal__user-action--${modifier}` : ''
      }`}
    >
      {btns.btnsContent.map((btn, index) => {
        const isIconOrSymbol = btn.icon || btn.symbol;
        if (btn.action === 'subPage') {
          return (
            <Link
              key={index + btn.title}
              to={btn.link}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              title={btn.title}
              className={`tile__btn tile__btn--${modifier}`}
            >
              {isIconOrSymbol ? (
                <SymbolOrIcon
                  type={btn.icon ? 'ICON' : 'SYMBOL'}
                  specifier={btn.icon ?? btn.symbol}
                />
              ) : null}
              {btn.text}
            </Link>
          );
        } else if (isNotMobile && btn.symbol == 'phone') {
          return null;
        } else {
          return (
            <a
              onClick={
                btn.action === 'scroll' ? e => smoothScrollInto(e) : null
              }
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
      })}
    </footer>
  ) : null;

  return (
    <Section classy='b2b-price' header={title} id={id}>
      <article className='b2b-price__content'>
        {desc.map((pContent, index) => (
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
