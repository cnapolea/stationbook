import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Login } from './screens/Login.jsx';
import { Health } from './screens/Health.jsx';
import { Register } from './screens/Register.jsx';
import Workstations from './screens/Workstations.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';
import MyBookings from './screens/MyBookings.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Health />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/workstations',
        element: <Workstations />,
      },
      {
        path: '/my-bookings',
        element: <MyBookings />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
