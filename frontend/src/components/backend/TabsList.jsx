import { NavLink } from 'react-router-dom';
import SymbolOrIcon from '../../components/common/SymbolOrIcon.jsx';

function TabsList({
  menuSet,
  onClick,
  classModifier,
  shouldSwitchState,
  disableAutoActive,
}) {
  // console.log(`TabsList person: `, person);
  const elementMainClass = el => {
    return `tabs-list__${el}  ${
      classModifier ? `tabs-list__${el}--${classModifier}` : ''
    } nav__${el}`;
  };

  const conditionalNavLinkActiveClass = (isActive, disableAutoActive) => {
    const base = elementMainClass('link');
    if (disableAutoActive) return base;
    return isActive ? `${base} active` : base;
  };

  return (
    <ul
      className={`tabs-list ${
        classModifier ? `tabs-list--${classModifier}` : ''
      }`}
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
              <SymbolOrIcon
                type={tab.icon ? 'ICON' : 'SYMBOL'}
                specifier={tab.icon || tab.symbol}
                classModifier={classModifier}
                extraClass={elementMainClass('icon')}
              />
              {tab.name ?? null}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

export default TabsList;
