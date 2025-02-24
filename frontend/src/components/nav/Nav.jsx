import React, {useState, useEffect} from 'react';
import {NavLink, useNavigate, useLocation} from 'react-router-dom';
import Logo from '../Logo.jsx';
import {smoothScrollInto} from '../../utils/utils.jsx';
const menuSet = [
	{
		name: 'Wyjazdy',
		symbol: 'landscape_2', // Represents travel in nature; peaceful and connected to retreats
		link: '/wyjazdy',
	},
	{
		name: 'Wydarzenia',
		symbol: 'notifications', // Bell symbolizes mindfulness and yoga-related events
		// link: '/wydarzenia',
		link: '/',
		scroll: '#wydarzenia',
		action: smoothScrollInto, //to delete
	},
	{
		name: 'Certyfikaty',
		symbol: 'verified', // Badge reflects achievements and certificates in a subtle way
		link: '/',
		scroll: '.certificates',
		action: smoothScrollInto,
	},
	// {
	// 	name: 'Kontakt',
	// 	symbol: 'chat', // Light and informal symbol for easy communication
	// 	link: '/',
	// 	scroll: '.footer__socials',
	// 	action: smoothScrollInto,
	// },
	{
		name: 'Dla firm',
		symbol: 'work',
		link: '/yoga-dla-firm',
	},
	{
		name: 'Zajęcia',
		symbol: 'self_improvement', // Lotus flower symbolizes yoga, harmony, and relaxation
		link: '/',
		scroll: '#zajecia',
		action: smoothScrollInto,
	},
];
const menuSideSet = [
	{
		name: 'Instagram',
		icon: 'fa-brands fa-instagram',
		link: 'https://www.instagram.com/yoganka_bodyhealing/',
	},
	{
		name: 'Facebook',
		icon: 'fa-brands fa-facebook',
		link: 'https://www.facebook.com/profile.php?id=100094192084948',
		scroll: '#wydarzenia',
	},
	// {
	// 	name: 'Konto',
	// 	symbol: 'account_circle',
	// 	link: '/',
	// 	scroll: '.certificates',
	// },
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
			<div className='main-nav-container'>
				<NavLink
					to={'/'}
					onClick={(e) => {
						closeDrawer();
						window.scrollTo(0, 0);
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
									{li.symbol ? (
										<span className='material-symbols-rounded nav__icon'>
											{li.symbol}
										</span>
									) : li.icon ? (
										<i
											className={`${li.icon} nav__icon`}
											aria-hidden='true'></i>
									) : null}
									{li.name}
								</a>
							) : (
								<NavLink
									to={li.link}
									onClick={(e) => {
										closeDrawer();
										window.scrollTo(0, 0);
									}}
									className={({isActive}) =>
										isActive ? 'nav__link active' : 'nav__link'
									}>
									{({isActive}) => (
										<>
											<span
												className={`${li.symbol} nav__icon ${
													isActive ? 'active' : ''
												} material-symbols-rounded nav__icon`}>
												{li.symbol}
											</span>
											{li.name}
										</>
									)}
								</NavLink>
							)}
						</li>
					))}
				</ul>
			</div>
			<ul className='nav__list nav__list--side'>
				{menuSideSet.map((li) => (
					<li
						key={li.name}
						className='nav__item nav__item--side'>
						<a
							onClick={(e) => {
								li.action(e, navigate, location);
								closeDrawer();
							}}
							href={li.link}
							className='nav__link nav__link--side'
							data-scroll={li.scroll}>
							{li.symbol ? (
								<span className='material-symbols-rounded nav__icon nav__icon--side account'>
									{li.symbol}
								</span>
							) : li.icon ? (
								<i
									className={`${li.icon} nav__icon nav__icon--side`}
									aria-hidden='true'></i>
							) : null}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

export default Nav;
