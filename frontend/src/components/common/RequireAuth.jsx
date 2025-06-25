// frontend/components/auth/RequireAuth.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';

function RequireAuth({ children }) {
  const { data, isLoading } = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !data?.isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isLoading, data, navigate]);

  if (isLoading) return null;
  return children;
}

export default RequireAuth;
