import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

import {NavLink} from 'react-router-dom';
import NewUser from './NewUser.jsx';

function SideNav({menuSet, side}) {
	const navigate = useNavigate();
	const location = useLocation();

	const isModalPath = location.pathname.includes('add-user');
	const [isModalOpen, setIsModalOpen] = useState(isModalPath);

	const handleOpenModal = (link) => {
		setIsModalOpen(true);
		navigate(`/admin-console/show-all-users/${link}`, {state: {background: location}});
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate(location.state?.background?.pathname, {replace: true});
	};
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
								onClick={(e) => {
									if (li.link === 'add-user') {
										e.preventDefault();
										handleOpenModal(li.link);
									}
								}}
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
			{isModalOpen && (
				<NewUser
					visited={isModalOpen}
					onClose={handleCloseModal}
				/>
			)}
		</aside>
	);
}

export default SideNav;
