import {Link} from 'react-router-dom';
import {smoothScrollInto} from '../../utils/utils.jsx';

const menuSet = [
	{
		name: 'Statystyki',
		symbol: 'bar_chart', // Represents travel in nature; peaceful and connected to retreats
		link: '/statystyki',
	},
	{
		name: 'Rezerwacje',
		symbol: 'event_available', // Lotus flower symbolizes yoga, harmony, and relaxation
		link: '/rezerwacje',
	},
	{
		name: 'Faktury',
		symbol: 'receipt_long', // Bell symbolizes mindfulness and yoga-related events
		// link: '/wydarzenia',
		link: '/faktury',
	},
	{
		name: 'Dane Uczestnika',
		symbol: 'assignment_ind', // Light and informal symbol for easy communication
		link: '/dane',
	},
	{
		name: 'Ustawienia',
		symbol: 'settings',
		link: '/ustawienia',
	},
];

function UserTabs() {
	return (
		<ul className='userTabs'>
			{menuSet.map((tab, index) => (
				<li
					key={index}
					className='userTabs__item nav__item'>
					<Link
						onClick={() => window.scrollTo(0, 0)}
						to={tab.link}
						className='userTabs__link nav__link'>
						{tab.symbol ? (
							<span className='material-symbols-rounded userTabs__icon nav__icon  '>
								{tab.symbol}
							</span>
						) : tab.icon ? (
							<i
								className={`${tab.icon} userTabs__icon nav__icon `}
								aria-hidden='true'></i>
						) : null}
						{tab.name ?? null}
					</Link>
				</li>
			))}
		</ul>
	);
}

export default UserTabs;
