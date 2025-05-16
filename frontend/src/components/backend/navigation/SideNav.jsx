import { NavLink } from 'react-router-dom';
import SymbolOrIcon from '../../../components/common/SymbolOrIcon.jsx';

function SideNav({ menuSet, side }) {
  return (
    <aside className='side-nav'>
      <nav className={`nav${side ? ` ${side}` : ''}`}>
        <ul className='nav__list'>
          <ul className='nav__list nav__list--bottom'>
            {menuSet.map(li => (
              <li key={li.name} className='nav__item nav__item--bottom'>
                <NavLink
                  to={li.link}
                  className={({ isActive }) =>
                    isActive
                      ? 'nav__link nav__link--bottom active'
                      : 'nav__link nav__link--bottom'
                  }
                >
                  {({ isActive }) => (
                    <span className='nav__content nav__content--bottom'>
                      {li.name}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          {menuSet.map(li => (
            <li key={li.name} className='nav__item'>
              <NavLink
                to={li.link}
                className={({ isActive }) =>
                  isActive ? 'nav__link active' : 'nav__link'
                }
              >
                {({ isActive }) => (
                  <SymbolOrIcon
                    specifier={li.symbol}
                    classModifier={isActive ? 'active' : ''}
                  />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default SideNav;
