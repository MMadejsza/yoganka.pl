import React from 'react';
import {Link} from 'react-router-dom';
import LogoFull from '../LogoFull.jsx';

const handleClick = (e) => {
	e.preventDefault();
	// fetch prop href from clicked menu tile
	const targetSelector = e.target.getAttribute('href');
	// Find in Dom first element matching href
	const targetSection = document.querySelector(targetSelector);
	// If section exists - scroll to it
	if (targetSection) {
		// Apply desired way of scrolling
		targetSection.scrollIntoView({behavior: 'smooth'});
	}
};

const menuSet = [
	{
		name: 'Zajęcia',
		icon: 'far fa-clock',
		link: '#zajecia',
	},
	{
		name: 'Wyjazdy',
		icon: 'fas fa-cloud-moon',
		link: '/camps',
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
		action: handleClick,
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
						{li.action ? (
							<a
								onClick={(e) => li.action(e)}
								href={li.link}
								className='nav__link'>
								<i className={`${li.icon} nav__icon`}></i>
								{li.name}
							</a>
						) : (
							<Link
								to={li.link}
								className='nav__link'>
								<i className={`${li.icon} nav__icon`}></i>
								{li.name}
							</Link>
						)}
					</li>
				))}
			</ul>
			<LogoFull placement='nav' />
		</nav>
	);
}

export default Nav;
