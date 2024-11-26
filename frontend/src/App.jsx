import React from 'react';
import Burger from './components/nav/Burger.jsx';
import Nav from './components/nav/Nav.jsx';
import HeaderMain from './components/HeaderMain.jsx';
import About from './components/About.jsx';

function App() {
	return (
		<div className='wrapper'>
			<Burger />
			<Nav />
			<HeaderMain />
			<About />
		</div>
	);
}

export default App;
