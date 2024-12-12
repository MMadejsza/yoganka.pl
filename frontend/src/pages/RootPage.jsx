import {Outlet} from 'react-router-dom';
import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

function RootPage() {
	return (
		<>
			<div className='wrapper'>
				<Burger />
				<Nav />
				<Outlet />
				<Footer />
				<FloatingPopUps />
			</div>
		</>
	);
}

export default RootPage;
