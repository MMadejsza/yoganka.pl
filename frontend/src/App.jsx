import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import RootPage from './pages/RootPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CampsPage from './pages/CampsPage.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootPage />,
		children: [
			{path: '/', element: <HomePage />},
			{path: '/camps', element: <CampsPage />},
		],
	},
	{},
	{},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
