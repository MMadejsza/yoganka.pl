import React, {useState, useEffect} from 'react';
import {NavLink, useNavigate, useLocation} from 'react-router-dom';
import Logo from '../Logo.jsx';
import {smoothScrollInto} from '../../utils/utils.js';

const menuSet = [
	{
		name: 'Wyjazdy',
		icon: 'fa-solid fa-mountain-sun', // Represents travel in nature; peaceful and connected to retreats
		link: '/wyjazdy',
		// link: '#wyjazdy',
		// action: smoothScrollInto, //to delete
	},
	{
		name: 'Wydarzenia',
		icon: 'fas fa-bell', // Bell symbolizes mindfulness and yoga-related events
		link: '/wydarzenia',
		// link: '#wydarzenia',
		// action: smoothScrollInto, //to delete
	},
	{
		name: 'Certyfikaty',
		icon: 'fas fa-award', // Badge reflects achievements and certificates in a subtle way
		link: '/',
		scroll: '.certificates',
		action: smoothScrollInto,
	},
	{
		name: 'Kontakt',
		icon: 'fas fa-comment-dots', // Light and informal symbol for easy communication
		link: '.footer__socials',
		action: smoothScrollInto,
	},
	{
		name: 'Zajęcia',
		icon: 'fas fa-spa', // Lotus flower symbolizes yoga, harmony, and relaxation
		link: '/zajecia',
		// link: '#zajecia',
		// action: smoothScrollInto, //to delete
	},
];

function Nav() {
	const navigate = useNavigate();
	const location = useLocation();

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 1024px)');

		// Function updating based on media querry
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
								onClick={(e) => li.action(e, navigate, location)}
								href={li.link}
								className='nav__link'
								data-scroll={li.scroll}>
								{li.icon != '' ? <i className={`${li.icon} nav__icon`}></i> : null}
								{li.name}
							</a>
						) : (
							<NavLink
								to={li.link}
								className={({isActive}) =>
									isActive ? 'nav__link active' : 'nav__link'
								}>
								{({isActive}) => (
									<>
										<i
											className={`${li.icon} nav__icon ${
												isActive ? 'active' : ''
											}`}
										/>
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
