import React from 'react';
import Burger from './components/nav/Burger.jsx';
import Nav from './components/nav/Nav.jsx';
import HeaderMain from './components/HeaderMain.jsx';
import About from './components/About.jsx';
import Certificates from './components/Certificates.jsx';
import Partners from './components/Partners.jsx';
import Footer from './components/Footer.jsx';

function App() {
	return (
		<div className='wrapper'>
			<Burger />
			<Nav />
			<HeaderMain />
			<About />
			{/* <Certificates /> */}
			<Partners />
			<Footer />
		</div>
	);
}

export default App;
