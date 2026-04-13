/**
 * API Client
 * Core HTTP client with interceptors, retry logic, and error handling
 */

import {
  ApiClientConfig,
  ApiRequestConfig,
  ApiResponse,
  HTTPMethod,
  RequestConfig,
} from './types';
import {
  ApiError,
  TimeoutError,
  NetworkError,
  createError,
  ParseError,
  ValidationError,
} from './errors';

/**
 * Main API Client class
 */
export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>>;
  private responseInterceptors: Array<(response: Response) => Response | Promise<Response>>;
  private errorInterceptors: Array<(error: Error) => Error | Promise<Error>>;
  private cache: Map<string, { data: any; timestamp: number }>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.requestInterceptors = config.interceptors?.request || [];
    this.responseInterceptors = config.interceptors?.response || [];
    this.errorInterceptors = config.interceptors?.error || [];
    this.cache = new Map();
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(
    interceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>
  ): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(
    interceptor: (error: Error) => Error | Promise<Error>
  ): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Set authorization header
   */
  setAuthorizationHeader(token: string): void {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * Clear authorization header
   */
  clearAuthorizationHeader(): void {
    delete this.headers['Authorization'];
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let updatedConfig = config;

    for (const interceptor of this.requestInterceptors) {
      updatedConfig = await interceptor(updatedConfig);
    }

    return updatedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let updatedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      updatedResponse = await interceptor(updatedResponse);
    }

    return updatedResponse;
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(error: Error): Promise<Error> {
    let updatedError = error;

    for (const interceptor of this.errorInterceptors) {
      updatedError = await interceptor(updatedError);
    }

    return updatedError;
  }

  /**
   * Check cache for valid data
   */
  private getCachedData(key: string, duration: number = 5 * 60 * 1000): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < duration) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Set cache data
   */
  private setCacheData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Read access token from browser storage when available.
   */
  private getStoredAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('accessToken');
  }

  /**
   * Private APIs should include bearer token, auth routes should not require it.
   */
  private shouldAttachAuth(endpoint: string): boolean {
    return !endpoint.startsWith('/api/auth');
  }

  /**
   * Make HTTP request
   */
  private async makeRequest(
    endpoint: string,
    config: RequestConfig
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const token = this.getStoredAccessToken();
      const shouldAttachAuth = this.shouldAttachAuth(endpoint);

      const mergedHeaders: Record<string, string> = {
        ...this.headers,
        ...(config.headers || {}),
      };

      if (token && shouldAttachAuth && !mergedHeaders.Authorization) {
        mergedHeaders.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(this.buildUrl(endpoint), {
        ...config,
        headers: mergedHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // Check if it's an AbortError (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(`Request timeout after ${this.timeout}ms`, this.timeout);
      }

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new NetworkError(error.message, error);
      }

      throw error;
    }
  }

  /**
   * Parse response body
   */
  private async parseResponseBody(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');

    if (!contentType || contentType.includes('application/json')) {
      try {
        return response.text().then((text) => (text ? JSON.parse(text) : null));
      } catch (error) {
        throw new ParseError('Failed to parse JSON response', error instanceof Error ? error : undefined);
      }
    }

    if (contentType.includes('text/plain')) {
      return response.text();
    }

    if (contentType.includes('application/octet-stream')) {
      return response.blob();
    }

    return response.text();
  }

  /**
   * Handle HTTP response
   */
  private async handleResponse<T = any>(response: Response): Promise<T> {
    // Apply response interceptors
    response = await this.applyResponseInterceptors(response);

    // Parse response body
    const data = await this.parseResponseBody(response);

    // Handle error responses
    if (!response.ok) {
      let error: ApiError;

      if (typeof data === 'object' && data !== null) {
        error = createError(response.status, data);
      } else {
        error = createError(response.status, data);
      }

      throw error;
    }

    return data;
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(
    endpoint: string,
    method: HTTPMethod = 'GET',
    options: ApiRequestConfig = {}
  ): Promise<T> {
    try {
      // Check cache if enabled
      if (options.cache?.enabled && method === 'GET') {
        const cacheKey = options.cache.key || `${method}:${endpoint}`;
        const cachedData = this.getCachedData(cacheKey, options.cache.duration);
        if (cachedData) {
          return cachedData;
        }
      }

      // Build request config
      let config: RequestConfig = {
        method,
        headers: options.headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: options.credentials || 'include',
      };

      // Apply request interceptors
      config = await this.applyRequestInterceptors(config);

      // Make request
      const response = await this.makeRequest(endpoint, config);

      // Handle response
      const result = await this.handleResponse<T>(response);

      // Cache if enabled
      if (options.cache?.enabled && response.ok && method === 'GET') {
        const cacheKey = options.cache.key || `${method}:${endpoint}`;
        this.setCacheData(cacheKey, result);
      }

      return result;
    } catch (error) {
      // Apply error interceptors
      const handledError = await this.applyErrorInterceptors(
        error instanceof Error ? error : new Error(String(error))
      );

      throw handledError;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: ApiRequestConfig
  ): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.request<T>(url, 'GET', options);
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, 'POST', { ...options, body });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, 'PUT', { ...options, body });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', { ...options, body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options?: ApiRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', options);
  }
}

/**
 * Create and export default API client instance
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const apiClient = new ApiClient({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
