import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';

const router = createBrowserRouter([{path: '/', element: <HomePage />}, {}, {}, {}]);

function App() {
	return (
		<div className='wrapper'>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
