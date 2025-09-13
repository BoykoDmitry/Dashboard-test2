import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  PublicClientApplication,
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  SilentRequest,
} from '@azure/msal-browser';
import { msalConfig, loginRequest, apiScopes } from './authConfig';

interface AuthContextType {
  instance: PublicClientApplication;
  account: AccountInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize MSAL first
        await msalInstance.initialize();
        
        // Handle redirect promise
        const response = await msalInstance.handleRedirectPromise();
        if (response) {
          setAccount(response.account);
        } else {
          // Check if there are any accounts
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Authentication initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Use popup login in development, redirect in production
      const isDev = import.meta.env.DEV;
      
      if (isDev) {
        const response = await msalInstance.loginPopup(loginRequest);
        setAccount(response.account);
      } else {
        await msalInstance.loginRedirect(loginRequest);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const logoutRequest = {
        account: account,
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
      };
      
      await msalInstance.logoutPopup(logoutRequest);
      setAccount(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!account) {
      return null;
    }

    try {
      const silentRequest: SilentRequest = {
        scopes: apiScopes.read,
        account: account,
      };

      const response = await msalInstance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        try {
          const response = await msalInstance.acquireTokenPopup({
            scopes: apiScopes.read,
            account: account,
          });
          return response.accessToken;
        } catch (popupErr) {
          console.error('Token acquisition error:', popupErr);
          return null;
        }
      }
      console.error('Token acquisition error:', err);
      return null;
    }
  };

  const value: AuthContextType = {
    instance: msalInstance,
    account,
    isAuthenticated: !!account,
    isLoading,
    login,
    logout,
    getAccessToken,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};