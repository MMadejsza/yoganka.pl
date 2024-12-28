import React from 'react';
import {NavLink} from 'react-router-dom';
import LogoFull from '../LogoFull.jsx';
import {smoothScrollInto} from '../../utils/utils.js';

const menuSet = [
	{
		name: 'Zajęcia',
		icon: 'far fa-clock',
		// link: '/zajecia',
		link: '#zajecia',
		action: smoothScrollInto, //to delete
	},
	{
		name: 'Wyjazdy',
		icon: 'fas fa-cloud-moon',
		// link: '/wyjazdy',
		link: '#wyjazdy',
		action: smoothScrollInto, //to delete
	},
	{
		name: 'Wydarzenia',
		icon: 'fas fa-calendar-check',
		// link: '/wydarzenia',
		link: '#wydarzenia',
		action: smoothScrollInto, //to delete
	},
	{
		name: 'Certyfikaty',
		icon: 'fa-solid fa-certificate',
		link: '.certificates',
		action: smoothScrollInto,
	},
	{
		name: 'Kontakt',
		icon: 'fa-solid fa-circle-info',
		link: '.footer__socials',
		action: smoothScrollInto,
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
			<LogoFull placement='nav' />
		</nav>
	);
}

export default Nav;
