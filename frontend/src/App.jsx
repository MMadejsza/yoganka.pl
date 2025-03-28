import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AccountPage from './pages/AccountPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import B2BPage from './pages/B2BPage.jsx';
import CampsPage from './pages/CampsPage.jsx';
import EmailVerifyPage from './pages/EmailVerifyPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RootPage from './pages/RootPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import { queryClient } from './utils/http.js';
// import ClassesPage from './pages/ClassesPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'login/:token', element: <LoginPage /> },
      { path: 'verify/:token', element: <EmailVerifyPage /> },
      { path: 'wyjazdy', element: <CampsPage /> },
      { path: 'wyjazdy/:link', element: <CampsPage /> },
      { path: 'wydarzenia', element: <EventsPage /> },
      { path: 'wydarzenia/:link', element: <HomePage /> },
      // {path: 'zajecia', element: <ClassesPage />},
      { path: 'yoga-dla-firm', element: <B2BPage /> },

      {
        path: 'konto',
        element: <AccountPage />,
        children: [
          { path: 'grafik/:id', element: <AccountPage /> },
          { path: 'statystyki', element: <AccountPage /> },
          { path: 'zajecia', element: <AccountPage /> },
          { path: 'rezerwacje', element: <AccountPage /> },
          { path: 'rezerwacje/:id', element: <AccountPage /> },
          { path: 'faktury', element: <AccountPage /> },
          { path: 'ustawienia', element: <AccountPage /> },
        ],
      },
      { path: 'grafik', element: <SchedulePage /> },
      { path: 'grafik/:id', element: <SchedulePage /> },
      {
        path: 'admin-console',
        element: <AdminPage />,
        children: [
          { path: ':link', element: <AdminPage /> },
          { path: 'show-all-users/add-user', element: <AdminPage /> },
          {
            path: 'show-all-users/:id',
            element: <AdminPage modifier='user' />,
          },
          {
            path: 'show-all-customers/:id',
            element: <AdminPage modifier='customer' />,
          },
          {
            path: 'show-all-products/:id',
            element: <AdminPage modifier='product' />,
          },
          {
            path: 'show-all-schedules/:id',
            element: <AdminPage modifier='product' />,
          },
          {
            path: 'show-all-payments/:id',
            element: <AdminPage modifier='payment' />,
          },
          {
            path: 'show-all-participants-feedback/:id',
            element: <AdminPage modifier='feedback' />,
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
