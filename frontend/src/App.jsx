import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import RootPage from './pages/RootPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CampsPage from './pages/CampsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
// import ClassesPage from './pages/ClassesPage.jsx';
import B2BPage from './pages/B2BPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootPage />,
		children: [
			{index: true, element: <HomePage />},
			{path: 'wyjazdy', element: <CampsPage />},
			{path: 'wyjazdy/:link', element: <CampsPage />},
			{path: 'wydarzenia', element: <EventsPage />},
			{path: 'wydarzenia/:link', element: <HomePage />},
			// {path: 'zajecia', element: <ClassesPage />},
			{path: 'yoga-dla-firm', element: <B2BPage />},
		],
		errorElement: <ErrorPage />,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
