import React from 'react';
import {NavLink} from 'react-router-dom';

function SideNav({menuSet, side, onTabClick}) {
	return (
		<aside className='side-nav'>
			<nav className={`nav ${side}`}>
				<ul className='nav__list'>
					{menuSet.map((li) => (
						<li
							key={li.name}
							className='nav__item'>
							<NavLink
								to={li.link}
								className={({isActive}) =>
									isActive ? 'nav__link active' : 'nav__link'
								}>
								{({isActive}) => (
									<>
										<span
											className={`${li.icon} nav__icon ${
												isActive ? 'active' : ''
											} material-symbols-rounded nav__icon`}>
											{li.icon}
										</span>
										{li.name}
									</>
								)}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}

export default SideNav;
