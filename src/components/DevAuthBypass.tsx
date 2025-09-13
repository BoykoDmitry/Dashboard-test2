import React from 'react';

interface DevAuthBypassProps {
  children: React.ReactNode;
}

const DevAuthBypass: React.FC<DevAuthBypassProps> = ({ children }) => {
  // In development mode with mock data, bypass authentication
  const isDev = import.meta.env.DEV;
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
  
  if (isDev && useMockData) {
    return <>{children}</>;
  }

  // For production or when not using mock data, require authentication
  return <>{children}</>;
};

export default DevAuthBypass;