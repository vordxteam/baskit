/**
 * Authentication Hook Example
 * Use this hook in your components to manage auth state
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { authApi } from '@/api/auth';
import { UserProfile, SignInRequest, SignUpRequest } from '@/api/auth/types';
import { isTokenExpiredError, isAuthenticationError } from '@/api/core/errors';

export interface UseAuthReturn {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (credentials: SignInRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

/**
 * Authentication hook
 * Manages user authentication state and provides auth methods
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize authentication on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const profile = await authApi.initializeAuth();
        setUser(profile);
        setError(null);
      } catch (err) {
        console.error('Auth initialization failed:', err);
        setUser(null);
        setError(null); // Don't show error for initial load
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Handle sign in
   */
  const handleSignIn = useCallback(async (credentials: SignInRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.signIn(credentials);
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle sign up
   */
  const handleSignUp = useCallback(async (data: SignUpRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.signUp(data);
      setUser(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign up';
      setError(message);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle sign out
   */
  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.signOut();
      setUser(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign out';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle profile update
   */
  const handleUpdateProfile = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.updateProfile(data);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh authentication
   */
  const handleRefreshAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      await authApi.refreshToken();
      const profile = await authApi.getProfile();
      setUser(profile);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to refresh auth';
      setError(message);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    refreshAuth: handleRefreshAuth,
  };
}
