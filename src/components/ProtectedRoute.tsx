import React from 'react';
import { useAuth } from '../auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login, error } = useAuth();
  
  // In development mode with mock data, bypass authentication
  const isDev = import.meta.env.DEV;
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  
  if (isDev && useMockData) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Authentication Error</h4>
            <p>{error}</p>
            <hr />
            <button className="btn btn-primary" onClick={login}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card-body text-center p-5">
            <div className="mb-4">
              <i className="bi bi-shield-lock text-primary" style={{ fontSize: '3rem' }}></i>
            </div>
            <h2 className="card-title mb-3">Onboarding Admin Dashboard</h2>
            <p className="card-text text-muted mb-4">
              Please sign in with your Azure AD account to access the dashboard.
            </p>
            <button 
              className="btn btn-primary btn-lg w-100" 
              onClick={login}
            >
              <i className="bi bi-microsoft me-2"></i>
              Sign in with Microsoft
            </button>
            <div className="mt-3">
              <small className="text-muted">
                Secure authentication powered by Azure AD
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;