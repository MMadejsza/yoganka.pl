import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import RootPage from './pages/RootPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CampsPage from './pages/CampsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import ClassesPage from './pages/ClassesPage.jsx';
import B2BPage from './pages/B2BPage.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootPage />,
		children: [
			{path: '/', element: <HomePage />},
			{path: '/wyjazdy', element: <CampsPage />},
			{path: '/wydarzenia', element: <EventsPage />},
			{path: '/zajecia', element: <ClassesPage />},
			{path: '/b2b', element: <B2BPage />},
		],
	},
	{},
	{},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
