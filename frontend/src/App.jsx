import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CampsPage from './pages/CampsPage.jsx';

const router = createBrowserRouter([
	{path: '/', element: <HomePage />},
	{path: '/camps', element: <CampsPage />},
	{},
	{},
]);

function App() {
	return (
		<div className='wrapper'>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
