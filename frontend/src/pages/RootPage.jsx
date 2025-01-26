import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

function RootPage() {
	const [isNavOpen, setIsNavOpen] = useState(false);

	return (
		<>
			<div className='wrapper'>
				<Burger
					isNavOpen={isNavOpen}
					setIsNavOpen={setIsNavOpen}
				/>
				<Nav setIsNavOpen={setIsNavOpen} />
				<Outlet />
				<Footer />
				<FloatingPopUps />
			</div>
		</>
	);
}

export default RootPage;
