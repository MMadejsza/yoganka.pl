import {Link} from 'react-router-dom';

const menuSet = [
	{
		name: 'Statystyki',
		symbol: 'bar_chart', // Represents travel in nature; peaceful and connected to retreats
		link: 'statystyki',
	},
	{
		name: 'Historia zajęć',
		symbol: 'history', // Lotus flower symbolizes yoga, harmony, and relaxation
		link: 'rezerwacje',
	},
	{
		name: 'Rezerwacje',
		symbol: 'library_books', // Lotus flower symbolizes yoga, harmony, and relaxation
		link: 'rezerwacje',
	},
	{
		name: 'Faktury',
		symbol: 'receipt_long', // Bell symbolizes mindfulness and yoga-related events
		// link: '/wydarzenia',
		link: 'faktury',
	},
	{
		name: 'Ustawienia',
		symbol: 'settings',
		link: 'ustawienia',
	},
];

function UserTabs({onOpen}) {
	return (
		<ul className='userTabs'>
			{menuSet.map((tab, index) => (
				<li
					key={index}
					className='userTabs__item nav__item'>
					<div
						onClick={() => onOpen(tab.link)}
						// to={tab.link}
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
					</div>
				</li>
			))}
		</ul>
	);
}

export default UserTabs;
