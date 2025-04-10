import { NavLink } from 'react-router-dom';

function TabsList({
  menuSet,
  onClick,
  classModifier,
  shouldSwitchState,
  disableAutoActive,
}) {
  // console.log(`TabsList person: `, person);
  const elementMainClass = el => {
    return `tabs-list__${el}  ${classModifier ? `tabs-list__${el}--${classModifier}` : ''} nav__${el}`;
  };

  const conditionalNavLinkActiveClass = (isActive, disableAutoActive) => {
    const base = elementMainClass('link');
    if (disableAutoActive) return base;
    return isActive ? `${base} active` : base;
  };

  const tabSymbolOrIcon = tab =>
    tab.symbol ? (
      <span className={`material-symbols-rounded ${elementMainClass('icon')}`}>
        {tab.symbol}
      </span>
    ) : tab.icon ? (
      <i
        className={`${tab.icon} ${elementMainClass('icon')}`}
        aria-hidden='true'
      ></i>
    ) : null;

  return (
    <ul
      className={`tabs-list ${classModifier ? `tabs-list--${classModifier}` : ''}`}
    >
      {menuSet.map((tab, index) => {
        return (
          <li key={index} className={elementMainClass('item')}>
            <NavLink
              onClick={() => onClick(tab.link.toLowerCase(), shouldSwitchState)}
              to={tab.link}
              end={tab.link === '/konto'}
              className={({ isActive }) =>
                conditionalNavLinkActiveClass(isActive, disableAutoActive)
              }
            >
              {tabSymbolOrIcon(tab)}
              {tab.name ?? null}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

export default TabsList;
