import React from 'react';
import LogoFull from '../LogoFull.jsx';
const menuSet = [
	{
		name: 'Zajęcia',
		icon: 'far fa-clock',
		link: '#zajecia',
	},
	{
		name: 'Wyjazdy',
		icon: 'fas fa-cloud-moon',
		link: '#wyjazdy',
	},
	{
		name: 'Wydarzenia',
		icon: 'fas fa-calendar-check',
		link: '.offer-type--events',
	},
	{
		name: 'Certyfikaty',
		icon: 'fa-solid fa-certificate',
		link: '.certificates',
	},
	{
		name: 'Kontakt',
		icon: 'fa-solid fa-circle-info',
		link: '.footer__socials',
	},
];

function Nav() {
	return (
		<nav className='nav'>
			<ul className='nav__list'>
				{menuSet.map((li) => (
					<li
						key={li.name}
						className='nav__item'>
						<a
							href={li.link}
							className='nav__link'>
							<i className={`${li.icon} nav__icon`}></i>
							{li.name}
						</a>
					</li>
				))}
			</ul>
			<LogoFull placement='nav' />
		</nav>
	);
}

export default Nav;
