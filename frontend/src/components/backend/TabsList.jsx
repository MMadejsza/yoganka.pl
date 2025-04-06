import { NavLink } from 'react-router-dom';

function TabsList({ menuSet, onClick, classModifier }) {
  // console.log(`TabsList person: `, person);
  const elementMainClass = el => {
    return `tabs-list__${el}  ${classModifier ? `tabs-list__${el}--${classModifier}` : ''} nav__${el}`;
  };

  return (
    <ul
      className={`tabs-list ${classModifier ? `tabs-list--${classModifier}` : ''}`}
    >
      {menuSet.map((tab, index) => {
        return (
          <li key={index} className={elementMainClass('item')}>
            <NavLink
              onClick={() => onClick(tab.link.toLowerCase())}
              to={tab.link}
              end={tab.link === '/konto'}
              className={elementMainClass('link')}
            >
              {tab.symbol ? (
                <span
                  className={`material-symbols-rounded ${elementMainClass('icon')}`}
                >
                  {tab.symbol}
                </span>
              ) : tab.icon ? (
                <i
                  className={`${tab.icon} ${elementMainClass('icon')}`}
                  aria-hidden='true'
                ></i>
              ) : null}
              {tab.name ?? null}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

export default TabsList;
