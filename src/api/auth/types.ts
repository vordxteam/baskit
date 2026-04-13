/**
 * Authentication API Types
 * Defines all types related to authentication and user management
 */

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  MODERATOR = 'moderator',
}

/**
 * User permission enum
 */
export enum UserPermission {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  ADMIN = 'admin',
}

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: UserPermission[];
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  lastLogin?: string;
}

/**
 * Sign up request payload
 */
export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

/**
 * Sign up response payload
 */
export interface SignUpRes {
  message: string;
  success: boolean;
  data?: string;
}

/**
 * Sign in request payload
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * User response in login
 */
export interface LoginUser {
  role: string;
  mfaEnabled: boolean;
  firstname: string;
  lastname: string;
  email: string;
}

/**
 * Sign in response payload
 */
export interface LoginSuccessResponse {
  accessToken: string;
  user: LoginUser;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      verified: boolean;
    }
    access_token: string;
    refreshToken: string;
    expiresIn: number;
  };
  message: string;
  success: boolean;
}

/**
 * Backward compatibility alias
 */
export type SignUpResponse = SignUpRes;
export type SignInResponse = LoginSuccessResponse;

/**
 * Authentication tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  tokens: AuthTokens;
  message: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Forgot password response
 */
export interface ForgotPasswordResponse {
  message: string;
  resetTokenSent: boolean;
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Reset password response
 */
export interface ResetPasswordResponse {
  message: string;
  redirectUrl?: string;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change password response
 */
export interface ChangePasswordResponse {
  message: string;
}

/**
 * Verify email request
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Verify email response
 */
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  verified: boolean;
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  email?: string;
}

/**
 * Update profile response
 */
export interface UpdateProfileResponse {
  user: UserProfile;
  message: string;
}

/**
 * Sign out response
 */
export interface SignOutResponse {
  message: string;
  success: boolean;
}

/**
 * Two-factor authentication setup
 */
export interface TwoFactorAuthSetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

/**
 * Two-factor authentication verification
 */
export interface TwoFactorAuthVerification {
  code: string;
  backupCode?: string;
}

/**
 * Enable two-factor auth request
 */
export interface EnableTwoFactorAuthRequest {
  code: string;
  backupCodes: string[];
}

/**
 * Enable two-factor auth response
 */
export interface EnableTwoFactorAuthResponse {
  message: string;
  twoFactorEnabled: boolean;
}

/**
 * Authentication error details
 */
export interface AuthErrorDetails {
  field?: string;
  code: string;
  message: string;
}

/**
 * Session information
 */
export interface SessionInfo {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: UserPermission[];
  issuedAt: string;
  expiresAt: string;
  isValid: boolean;
}

/**
 * OAuth provider type
 */
export type OAuthProvider = 'google' | 'github' | 'microsoft' | 'facebook';

/**
 * OAuth login request
 */
export interface OAuthLoginRequest {
  provider: OAuthProvider;
  code: string;
  redirectUri: string;
}

/**
 * OAuth login response
 */
export interface OAuthLoginResponse {
  user: UserProfile;
  tokens: AuthTokens;
  isNewUser: boolean;
  message: string;
}

/**
 * Auth context state
 */
export interface AuthState {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthErrorDetails | null;
  lastLogin?: string;
}
