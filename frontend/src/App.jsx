import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import RootPage from './pages/RootPage.jsx';
import HomePage from './pages/HomePage.jsx';
import CampsPage from './pages/CampsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
// import ClassesPage from './pages/ClassesPage.jsx';
// import B2BPage from './pages/B2BPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

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
			// {path: 'b2b', element: <B2BPage />},
			{
				path: 'admin-console',
				element: <AdminPage />,
				children: [
					{path: ':link', element: <AdminPage />},
					{path: 'show-all-users/add-user', element: <AdminPage />},
				],
			},
		],
		errorElement: <ErrorPage />,
	},
]);

// instantiating for tanstack query used in Admin Panel for HTTP requests
const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
