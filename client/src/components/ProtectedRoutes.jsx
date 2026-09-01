import { Navigate, Outlet } from 'react-router-dom';
import { CLIENT_ROUTES } from '../lib/constants';

const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');

  return token ? <Outlet /> : <Navigate to={CLIENT_ROUTES.LOGIN} replace />;
};
export default ProtectedRoutes;
