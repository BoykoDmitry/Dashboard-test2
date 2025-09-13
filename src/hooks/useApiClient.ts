import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiClient } from '../api/client';

export const useApiClient = () => {
  const { getAccessToken } = useAuth();
  
  // Check if we're in development mode with mock data
  const isDev = import.meta.env.DEV;
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  useEffect(() => {
    // In development mode with mock data, don't set auth token provider
    if (isDev && useMockData) {
      return;
    }
    
    // Set the auth token provider for the API client
    apiClient.setAuthTokenProvider(getAccessToken);
  }, [getAccessToken, isDev, useMockData]);

  return apiClient;
};