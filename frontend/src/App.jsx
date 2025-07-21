import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Loader from './components/common/Loader.jsx';
import RequireAuth from './components/common/RequireAuth.jsx';
import RootPage from './pages/RootPage.jsx';
import { queryClient } from './utils/http.js';

const AccountPage = lazy(() => import('./pages/backend/AccountPage.jsx'));
const AdminPage = lazy(() => import('./pages/backend/AdminDashPage.jsx'));
const AdminSettingsPage = lazy(() =>
  import('./pages/backend/AdminSettingsPage.jsx')
);
const EmailVerifyPage = lazy(() =>
  import('./pages/backend/EmailVerifyPage.jsx')
);
const LoginPage = lazy(() => import('./pages/backend/LoginPage.jsx'));
const SchedulePage = lazy(() => import('./pages/backend/SchedulesPage.jsx'));
const TOSPage = lazy(() => import('./pages/backend/TOSPage.jsx'));
const B2BPage = lazy(() => import('./pages/frontend/B2BPage.jsx'));
const CampsPage = lazy(() => import('./pages/frontend/CampsPage.jsx'));
const ClassesPage = lazy(() => import('./pages/frontend/ClassesPage.jsx'));
const ErrorPage = lazy(() => import('./pages/frontend/ErrorPage.jsx'));
const EventsPage = lazy(() => import('./pages/frontend/EventsPage.jsx'));
const HomePage = lazy(() => import('./pages/frontend/HomePage.jsx'));
const ViewClassesOffline = lazy(() =>
  import('./components/frontend/classes/ViewClassesOffline.jsx')
);
const ViewClassesOnline = lazy(() =>
  import('./components/frontend/classes/ViewClassesOnline.jsx')
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'login',
        element: <LoginPage />,
        children: [{ path: ':token', element: <LoginPage /> }],
      },
      { path: 'verify/:token', element: <EmailVerifyPage /> },
      {
        path: 'wyjazdy',
        element: <CampsPage />,
        children: [{ path: ':link', element: <CampsPage /> }],
      },
      {
        path: 'wydarzenia',
        element: <EventsPage />,
        children: [{ path: ':link', element: <EventsPage /> }],
      },
      {
        path: 'zajecia',
        element: <ClassesPage />,
        children: [
          { index: true, element: <Navigate to='online' replace /> },
          { path: 'online', element: <ViewClassesOnline /> },
          { path: 'stacjonarne', element: <ViewClassesOffline /> },
        ],
      },
      { path: 'yoga-dla-firm', element: <B2BPage /> },
      {
        path: 'konto',
        element: (
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        ),
        children: [
          { path: 'grafik/:id', element: <AccountPage /> },
          { path: 'statystyki', element: <AccountPage /> },
          { path: 'zajecia', element: <AccountPage /> },
          {
            path: 'karnety',
            element: <AccountPage />,
            children: [{ path: ':id', element: <AccountPage /> }],
          },
          {
            path: 'rezerwacje',
            element: <AccountPage />,
            children: [{ path: ':id', element: <AccountPage /> }],
          },
          {
            path: 'platnosci',
            element: <AccountPage />,
            children: [{ path: ':id', element: <AccountPage /> }],
          },
          { path: 'faktury', element: <AccountPage /> },
          { path: 'ustawienia', element: <AccountPage /> },
        ],
      },
      {
        path: 'grafik',
        element: <SchedulePage />,
        children: [
          {
            path: 'karnety',
            element: <SchedulePage />,
            children: [{ path: ':id', element: <SchedulePage /> }],
          },
          {
            path: ':id',
            element: <SchedulePage />,
            children: [{ path: ':status', element: <SchedulePage /> }],
          },
        ],
      },
      {
        path: 'admin-console',
        element: (
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        ),
        children: [
          { path: ':link', element: <AdminPage /> },
          {
            path: 'show-all-users',
            element: <AdminPage />,
            children: [
              { path: 'add-user', element: <AdminPage modifier='user' /> },
              {
                path: ':id',
                element: <AdminPage modifier='user' />,
              },
            ],
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
            path: 'show-all-bookings/:id',
            element: <AdminPage modifier='booking' />,
          },
          {
            path: 'show-all-passes/:id',
            element: <AdminPage modifier='pass' />,
          },
          {
            path: 'show-all-customer-passes/:id',
            element: <AdminPage modifier='customerPass' />,
          },
          {
            path: 'show-all-participants-feedback/:id',
            element: <AdminPage modifier='feedback' />,
          },
          {
            path: 'show-all-tos-versions',
            element: <AdminPage />,
            children: [
              {
                path: 'add-tos-version',
                element: <AdminPage modifier='user' />,
              },
              {
                path: ':id',
                element: <AdminPage modifier='user' />,
              },
            ],
          },
          {
            path: 'show-all-gdpr-versions',
            element: <AdminPage />,
            children: [
              {
                path: 'add-gdpr-version',
                element: <AdminPage modifier='gdpr' />,
              },
              {
                path: ':id',
                element: <AdminPage modifier='gdpr' />,
              },
            ],
          },
        ],
      },
      {
        path: 'admin-settings',
        element: (
          <RequireAuth>
            <AdminSettingsPage />
          </RequireAuth>
        ),
        children: [],
      },
      {
        path: 'polityka-firmy',
        element: <TOSPage />,
        children: [
          { path: 'regulamin', element: <TOSPage /> },
          { path: 'rodo', element: <TOSPage /> },
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
      {/*y suspense ensures lazy-loaded components show a fallback while loading */}
      <Suspense fallback={<Loader label={'Ładowanie'} />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
