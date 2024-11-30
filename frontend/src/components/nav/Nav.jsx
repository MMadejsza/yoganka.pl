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
	function handleCLick(e) {
		e.preventDefault();
		// fetch prop href from clicked menu tile
		const targetSelector = e.target.getAttribute('href');
		// Find in Dom first element matching href
		const targetSection = document.querySelector(targetSelector);
		// If section exists - scroll to it
		if (targetSection) {
			// Prevent default way of scrolling
			// Apply desired way of scrolling
			targetSection.scrollIntoView({behavior: 'smooth'});
		}
	}

	return (
		<nav className='nav'>
			<ul className='nav__list'>
				{menuSet.map((li) => (
					<li
						key={li.name}
						className='nav__item'>
						<a
							onClick={(e) => handleCLick(e)}
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
