import React, {useState, useEffect} from 'react';
import {NavLink, useNavigate, useLocation} from 'react-router-dom';
import Logo from '../Logo.jsx';
import {smoothScrollInto} from '../../utils/utils.js';
const menuSet = [
	{
		name: 'Wyjazdy',
		icon: 'landscape_2', // Represents travel in nature; peaceful and connected to retreats
		link: '/wyjazdy',
		// link: '#wyjazdy',
		// action: smoothScrollInto, //to delete
	},
	{
		name: 'Wydarzenia',
		icon: 'notifications', // Bell symbolizes mindfulness and yoga-related events
		link: '/wydarzenia',
		// link: '#wydarzenia',
		// action: smoothScrollInto, //to delete
	},
	{
		name: 'Certyfikaty',
		icon: 'verified', // Badge reflects achievements and certificates in a subtle way
		link: '/',
		scroll: '.certificates',
		action: smoothScrollInto,
	},
	{
		name: 'Kontakt',
		icon: 'chat', // Light and informal symbol for easy communication
		link: '/',
		scroll: '.footer__socials',
		action: smoothScrollInto,
	},
	{
		name: 'Zajęcia',
		icon: 'self_improvement', // Lotus flower symbolizes yoga, harmony, and relaxation
		link: '/',
		scroll: '#zajecia',
		action: smoothScrollInto,
	},
];

function Nav({setIsNavOpen}) {
	const navigate = useNavigate();
	const location = useLocation();

	const [isMobile, setIsMobile] = useState(false);

	const closeDrawer = () => {
		if (isMobile) setIsNavOpen(false);
	};

	// Limiting touch effectiveness only for mobile devices
	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 1024px)');

		// Function updating based on media query
		const handleMediaChange = (e) => {
			setIsMobile(e.matches);
		};

		// Initial setup
		handleMediaChange(mediaQuery);

		// Add Listening
		mediaQuery.addEventListener('change', handleMediaChange);

		// Remove on umount
		return () => mediaQuery.removeEventListener('change', handleMediaChange);
	}, []);

	return (
		<nav className='nav'>
			<NavLink
				to={'/'}
				onClick={(e) => {
					closeDrawer();
				}}
				className={({isActive}) => (isActive ? 'nav__link active' : 'nav__link')}>
				{({isActive}) => (
					<Logo
						placement='nav'
						media={isMobile ? 'mobile' : null}
						isActive={isActive}
					/>
				)}
			</NavLink>
			<ul className='nav__list'>
				{menuSet.map((li) => (
					<li
						key={li.name}
						className='nav__item'>
						{li.action ? (
							<a
								onClick={(e) => {
									li.action(e, navigate, location);
									closeDrawer();
								}}
								href={li.link}
								className='nav__link'
								data-scroll={li.scroll}>
								{li.icon != '' ? (
									<span className='material-symbols-outlined nav__icon'>
										{li.icon}
									</span>
								) : null}
								{li.name}
							</a>
						) : (
							<NavLink
								to={li.link}
								onClick={(e) => {
									closeDrawer();
								}}
								className={({isActive}) =>
									isActive ? 'nav__link active' : 'nav__link'
								}>
								{({isActive}) => (
									<>
										<span
											className={`${li.icon} nav__icon ${
												isActive ? 'active' : ''
											} material-symbols-outlined nav__icon`}>
											{li.icon}
										</span>
										{li.name}
									</>
								)}
							</NavLink>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

export default Nav;
