import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAdminProps {
  redirectTo?: string;
}

/**
 * Component to protect routes that require admin privileges
 */
export default function RequireAdmin({ redirectTo = '/auth/login' }: RequireAdminProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Redirect to unauthorized page if not an admin
  if (!isAdmin) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Render child routes if user is an admin
  return <Outlet />;
}
