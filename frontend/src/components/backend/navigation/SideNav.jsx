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
                {!li.externalLink ? (
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
                ) : (
                  <a
                    href={li.externalLink}
                    className={'nav__link nav__link--bottom'}
                    target='_blank'
                  >
                    <span className='nav__content nav__content--bottom'>
                      {li.name}
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
          {menuSet.map(li => (
            <li key={li.name} className='nav__item'>
              {!li.externalLink ? (
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
              ) : (
                <a
                  href={li.externalLink}
                  target='_blank'
                  className={'nav__link'}
                >
                  <SymbolOrIcon specifier={li.symbol} />
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default SideNav;
