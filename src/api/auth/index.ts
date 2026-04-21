/**
 * Authentication API Endpoints
 * Handles all authentication-related API calls
 */

import { apiClient } from '../core/apiClient';
import {
  SignUpRequest,
  SignUpRes,
  SignInRequest,
  LoginSuccessResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  SignOutResponse,
  TwoFactorAuthSetup,
  EnableTwoFactorAuthRequest,
  EnableTwoFactorAuthResponse,
  OAuthLoginRequest,
  OAuthLoginResponse,
  UserProfile,
} from './types';

/**
 * Authentication API class
 */
export class AuthAPI {
  private baseEndpoint = '/api/auth';

  /**
   * Sign up with email and password
   */
  async signUp(payload: SignUpRequest): Promise<SignUpRes> {
    try {
      // Only send required fields
      const signUpPayload = {
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        first_name: payload.firstName,
        last_name: payload.lastName,
      };

      const response = await apiClient.post<SignUpRes>(
        `${this.baseEndpoint}/register`,
        signUpPayload
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(
    payload: SignInRequest & { rememberMe?: boolean }
  ): Promise<LoginSuccessResponse> {
    try {
      // Only send required fields to API
      const signInPayload = {
        email: payload.email,
        password: payload.password,
      };

      const response = await apiClient.post<LoginSuccessResponse>(
        `${this.baseEndpoint}/login`,
        signInPayload,
      );

      // Store tokens locally
      if (response.data.access_token) {
        await this.storeTokens({
          accessToken: response.data.access_token,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        });
        apiClient.setAuthorizationHeader(response.data.access_token);

        // Store remember me preference (client-side only)
        if (payload.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<SignOutResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await apiClient.post<SignOutResponse>(
        `${this.baseEndpoint}/logout`,
        undefined,
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined,
        }
      );

      // Clear tokens and auth header
      await this.clearTokens();
      apiClient.clearAuthorizationHeader();
      apiClient.clearCache();

      return response;
    } catch (error) {
      // Even if the request fails, clear local tokens
      await this.clearTokens();
      apiClient.clearAuthorizationHeader();
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const payload: RefreshTokenRequest = { refreshToken };
      const response = await apiClient.post<RefreshTokenResponse>(
        `${this.baseEndpoint}/refresh-token`,
        payload
      );

      // Update stored tokens
      if (response.tokens) {
        await this.storeTokens(response.tokens);
        apiClient.setAuthorizationHeader(response.tokens.accessToken);
      }

      return response;
    } catch (error) {
      // Clear tokens if refresh fails
      // await this.clearTokens();
      apiClient.clearAuthorizationHeader();
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>(
      `${this.baseEndpoint}/forgot-password`,
      payload
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return apiClient.post<ResetPasswordResponse>(
      `${this.baseEndpoint}/reset-password`,
      payload
    );
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(payload: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return apiClient.post<ChangePasswordResponse>(
      `${this.baseEndpoint}/change-password`,
      payload
    );
  }

  /**
   * Verify email address
   */
  async verifyEmail(payload: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return apiClient.get<VerifyEmailResponse>(
      `${this.baseEndpoint}/verify-email`,
      payload
    );
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `${this.baseEndpoint}/resend-verification-email`,
      { email }
    );
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/api/user`);
  }

  /**
   * Update user profile
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return apiClient.patch<UpdateProfileResponse>(
      `${this.baseEndpoint}/profile`,
      payload
    );
  }

  /**
   * Enable two-factor authentication
   * Returns QR code and secret for setup
   */
  async setupTwoFactorAuth(): Promise<TwoFactorAuthSetup> {
    return apiClient.post<TwoFactorAuthSetup>(
      `${this.baseEndpoint}/2fa/setup`
    );
  }

  /**
   * Enable two-factor authentication with verification
   */
  async enableTwoFactorAuth(
    payload: EnableTwoFactorAuthRequest
  ): Promise<EnableTwoFactorAuthResponse> {
    return apiClient.post<EnableTwoFactorAuthResponse>(
      `${this.baseEndpoint}/2fa/enable`,
      payload
    );
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactorAuth(code: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `${this.baseEndpoint}/2fa/disable`,
      { code }
    );
  }

  /**
   * OAuth login
   */
  async oauthLogin(payload: OAuthLoginRequest): Promise<OAuthLoginResponse> {
    try {
      const response = await apiClient.post<OAuthLoginResponse>(
        `${this.baseEndpoint}/oauth/login`,
        payload
      );

      // Store tokens
      if (response.tokens) {
        await this.storeTokens(response.tokens);
        apiClient.setAuthorizationHeader(response.tokens.accessToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Store tokens in localStorage
   */
  private async storeTokens(tokens: { accessToken: string; refreshToken: string; expiresIn?: number }): Promise<void> {
    try {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('tokenTimestamp', String(Date.now()));
      localStorage.setItem('session', tokens.expiresIn ? tokens.expiresIn.toString() : '3600'); // Default to 1 hour if expiresIn not provided
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  /**
   * Get access token from storage
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token from storage
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Clear all tokens from storage
   */
  async clearTokens(): Promise<void> {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenTimestamp');
      localStorage.removeItem('session');
      localStorage.removeItem('rememberMe');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Check if user has valid session
   */
  async hasValidSession(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    try {
      // Try to get profile to validate token
      await this.getProfile();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Initialize auth (restore session if valid)
   */
  async initializeAuth(): Promise<UserProfile | null> {
    try {
      const accessToken = await this.getAccessToken();

      if (!accessToken) {
        return null;
      }

      // Set authorization header
      apiClient.setAuthorizationHeader(accessToken);

      // Verify token and get profile
      try {
        const profile = await this.getProfile();
        return profile;
      } catch (error) {
        // Try to refresh token
        try {
          await this.refreshToken();
          return await this.getProfile();
        } catch (refreshError) {
          // If refresh fails, clear tokens
          // await this.clearTokens();
          apiClient.clearAuthorizationHeader();
          throw refreshError;
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      return null;
    }
  }
}

/**
 * Export singleton instance
 */
export const authApi = new AuthAPI();

export default authApi;
