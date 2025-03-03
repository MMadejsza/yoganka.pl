const menuSet = [
	// {
	// 	name: 'Statystyki',
	// 	symbol: 'bar_chart',
	// 	link: 'statystyki',
	// },
	{
		name: 'Historia zajęć',
		symbol: 'history',
		link: 'zajecia',
		limitedTo: 'customer',
	},
	{
		name: 'Rezerwacje',
		symbol: 'library_books',
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

function UserTabs({onOpen, person}) {
	// console.log(`UserTabs person: `, person);
	return (
		<ul className='userTabs'>
			{menuSet.map((tab, index) => {
				if (!person.customer && tab.limitedTo == 'customer') {
					return;
				}
				return (
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
				);
			})}
		</ul>
	);
}

export default UserTabs;
