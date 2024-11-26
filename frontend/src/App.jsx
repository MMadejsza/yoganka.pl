import React from 'react';
import Burger from './components/nav/Burger.jsx';
import Nav from './components/nav/Nav.jsx';
import HeaderMain from './components/HeaderMain.jsx';

function App() {
	return (
		<div className='wrapper'>
			<Burger />
			<Nav />
			<HeaderMain />
		</div>
	);
}

export default App;
