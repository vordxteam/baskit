/**
 * Core API Types and Interfaces
 * Defines base types for API requests, responses, and error handling
 */

/**
 * HTTP Methods supported by the API
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Request configuration options
 */
export interface RequestConfig {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  timeout?: number;
}

/**
 * API Response wrapper for successful responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    field?: string;
  };
  statusCode: number;
  timestamp: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated API Response
 */
export interface PaginatedApiResponse<T = any> extends ApiResponse<T> {
  pagination: PaginationMeta;
}

/**
 * Request interceptor type
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/**
 * Response interceptor type
 */
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

/**
 * Error interceptor type
 */
export type ErrorInterceptor = (error: Error) => Error | Promise<Error>;

/**
 * API Client configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
    error?: ErrorInterceptor[];
  };
}

/**
 * Token store interface for managing authentication tokens
 */
export interface TokenStore {
  getToken: () => Promise<string | null>;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
  getRefreshToken: () => Promise<string | null>;
  setRefreshToken: (token: string) => Promise<void>;
  clearRefreshToken: () => Promise<void>;
}

/**
 * Cache options for requests
 */
export interface CacheOptions {
  enabled: boolean;
  duration?: number; // ms
  key?: string;
}

/**
 * Extended request config with additional options
 */
export interface ApiRequestConfig extends RequestConfig {
  cache?: CacheOptions;
  showLoader?: boolean;
  showNotification?: boolean;
}
