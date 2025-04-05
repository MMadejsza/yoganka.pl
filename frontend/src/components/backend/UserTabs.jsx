import { NavLink } from 'react-router-dom';

const menuSet = [
  // {
  // 	name: 'Statystyki',
  // 	symbol: 'bar_chart',
  // 	link: 'statystyki',
  // },
  {
    name: 'Konto',
    symbol: 'home',
    link: '/konto',
  },
  {
    name: 'Historia zajęć',
    symbol: 'history',
    link: 'zajecia',
    limitedTo: 'customer',
  },
  {
    name: 'Płatności',
    symbol: 'payments',
    link: 'rezerwacje',
    limitedTo: 'customer',
  },
  // {
  // 	name: 'Faktury',
  // 	symbol: 'receipt_long',
  // 	link: 'faktury',
  // },
  {
    name: 'Ustawienia',
    symbol: 'settings',
    link: 'ustawienia',
  },
];

function UserTabs({ onClick, person }) {
  // console.log(`UserTabs person: `, person);
  return (
    <ul className='tabs-list'>
      {menuSet.map((tab, index) => {
        if (!person.customer && tab.limitedTo == 'customer') {
          return;
        }
        return (
          <li key={index} className='tabs-list__item nav__item'>
            <NavLink
              onClick={() => onClick(tab.link.toLowerCase())}
              to={tab.link}
              end={tab.link === '/konto'}
              className='tabs-list__link nav__link'
            >
              {tab.symbol ? (
                <span className='material-symbols-rounded tabs-list__icon nav__icon  '>
                  {tab.symbol}
                </span>
              ) : tab.icon ? (
                <i
                  className={`${tab.icon} tabs-list__icon nav__icon `}
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

export default UserTabs;
