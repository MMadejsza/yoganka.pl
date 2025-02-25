import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './utils/http.js';
import RootPage from './pages/RootPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CampsPage from './pages/CampsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
// import ClassesPage from './pages/ClassesPage.jsx';
import B2BPage from './pages/B2BPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ViewFrame from './components/adminConsole/ViewFrame.jsx';
const router = createBrowserRouter([
	{
		path: '/',
		element: <RootPage />,
		children: [
			{index: true, element: <HomePage />},
			{path: 'login', element: <LoginPage />},
			{path: 'wyjazdy', element: <CampsPage />},
			{path: 'wyjazdy/:link', element: <CampsPage />},
			{path: 'wydarzenia', element: <EventsPage />},
			{path: 'wydarzenia/:link', element: <HomePage />},
			// {path: 'zajecia', element: <ClassesPage />},
			{path: 'yoga-dla-firm', element: <B2BPage />},
			{path: 'grafik', element: <SchedulePage />},
			{path: 'grafik/:id', element: <SchedulePage />},
			{
				path: 'admin-console',
				element: <AdminPage />,
				children: [
					{path: ':link', element: <AdminPage />},
					{path: 'show-all-users/add-user', element: <ViewFrame />},
					{path: 'show-all-users/:id', element: <ViewFrame modifier='user' />},
					{path: 'show-all-customers/:id', element: <ViewFrame modifier='customer' />},
					{path: 'show-all-products/:id', element: <ViewFrame modifier='product' />},
					{path: 'show-all-schedules/:id', element: <ViewFrame modifier='product' />},
					{path: 'show-all-bookings/:id', element: <ViewFrame modifier='booking' />},
					{
						path: 'show-all-participants-feedback/:id',
						element: <ViewFrame modifier='feedback' />,
					},
				],
			},
		],
		errorElement: <ErrorPage />,
	},
]);

// instantiating for tanstack query used in Admin Panel for HTTP requests
const queryClient2 = queryClient;

function App() {
	return (
		<QueryClientProvider client={queryClient2}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
