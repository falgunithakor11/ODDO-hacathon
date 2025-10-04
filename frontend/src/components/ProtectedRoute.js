import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, currentRole }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    if (requiredRole && currentRole !== requiredRole) {
      switch (currentRole) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Manager':
          navigate('/manager');
          break;
        case 'Employee':
          navigate('/employee');
          break;
        default:
          navigate('/');
          break;
      }
    }
  }, [token, requiredRole, currentRole, navigate]);

  // If no token or wrong role, don't render children
  if (!token || (requiredRole && currentRole !== requiredRole)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;