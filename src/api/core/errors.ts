/**
 * API Error Classes and Error Handling
 * Comprehensive error handling for all API operations
 */

export enum ErrorCode {
  // Client Errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',

  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  DNS_RESOLUTION_ERROR = 'DNS_RESOLUTION_ERROR',

  // Client Errors
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
}

export const ErrorMessages: Record<ErrorCode, string> = {
  // Client Errors
  [ErrorCode.BAD_REQUEST]: 'Invalid request. Please check your input data.',
  [ErrorCode.UNAUTHORIZED]: 'Invalid email or password. Please try again.',
  [ErrorCode.FORBIDDEN]: 'You do not have permission to access this resource.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.CONFLICT]: 'The request conflicts with existing data.',
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed. Please check your input.',
  [ErrorCode.RATE_LIMITED]: 'Too many requests. Please try again later.',
  [ErrorCode.UNPROCESSABLE_ENTITY]: 'Unable to process the request.',

  // Server Errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error. Please try again later.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable. Please try again later.',
  [ErrorCode.GATEWAY_TIMEOUT]: 'Request timeout. The server took too long to respond.',

  // Network Errors
  [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ErrorCode.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ErrorCode.CONNECTION_REFUSED]: 'Connection refused. The server is not responding.',
  [ErrorCode.DNS_RESOLUTION_ERROR]: 'Failed to resolve the server address.',

  // Client Errors
  [ErrorCode.PARSE_ERROR]: 'Failed to parse response data.',
  [ErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred.',
  [ErrorCode.INVALID_TOKEN]: 'Invalid authentication token.',
  [ErrorCode.TOKEN_EXPIRED]: 'Session expired. Please login again.',
};

export const HttpStatusToErrorCode: Record<number, ErrorCode> = {
  400: ErrorCode.BAD_REQUEST,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  422: ErrorCode.UNPROCESSABLE_ENTITY,
  429: ErrorCode.RATE_LIMITED,
  500: ErrorCode.INTERNAL_SERVER_ERROR,
  503: ErrorCode.SERVICE_UNAVAILABLE,
  504: ErrorCode.GATEWAY_TIMEOUT,
};

/**
 * Base API Error class
 */
export class ApiError extends Error {
  public code: ErrorCode;
  public statusCode: number;
  public details?: any;
  public field?: string;
  public timestamp: string;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode: number = 500,
    details?: any,
    field?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.field = field;
    this.timestamp = new Date().toISOString();

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    return ErrorMessages[this.code] || this.message;
  }

  /**
   * Convert error to JSON
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      field: this.field,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Validation Error
 */
export class ValidationError extends ApiError {
  public errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}, statusCode: number = 400) {
    super(message, ErrorCode.VALIDATION_ERROR, statusCode);
    this.name = 'ValidationError';
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

/**
 * Network Error
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network error occurred', originalError?: Error) {
    super(message, ErrorCode.NETWORK_ERROR, 0);
    this.name = 'NetworkError';
    this.details = originalError?.message;
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timeout', timeout: number = 0) {
    super(message, ErrorCode.TIMEOUT_ERROR, 0);
    this.name = 'TimeoutError';
    this.details = { timeout };
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = ErrorMessages[ErrorCode.UNAUTHORIZED], statusCode: number = 401) {
    super(message, ErrorCode.UNAUTHORIZED, statusCode);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Token Expired Error
 */
export class TokenExpiredError extends AuthenticationError {
  constructor(message: string = ErrorMessages[ErrorCode.TOKEN_EXPIRED]) {
    super(message, 401);
    this.name = 'TokenExpiredError';
    this.code = ErrorCode.TOKEN_EXPIRED;
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = ErrorMessages[ErrorCode.FORBIDDEN], statusCode: number = 403) {
    super(message, ErrorCode.FORBIDDEN, statusCode);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends ApiError {
  constructor(message: string = ErrorMessages[ErrorCode.NOT_FOUND], statusCode: number = 404) {
    super(message, ErrorCode.NOT_FOUND, statusCode);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends ApiError {
  constructor(message: string = ErrorMessages[ErrorCode.CONFLICT], statusCode: number = 409) {
    super(message, ErrorCode.CONFLICT, statusCode);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Rate Limit Error
 */
export class RateLimitError extends ApiError {
  public retryAfter?: number;

  constructor(message: string = ErrorMessages[ErrorCode.RATE_LIMITED], retryAfter?: number) {
    super(message, ErrorCode.RATE_LIMITED, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Server Error
 */
export class ServerError extends ApiError {
  constructor(message: string = ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR], statusCode: number = 500) {
    super(message, ErrorCode.INTERNAL_SERVER_ERROR, statusCode);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Parse Error
 */
export class ParseError extends ApiError {
  constructor(message: string = ErrorMessages[ErrorCode.PARSE_ERROR], originalError?: Error) {
    super(message, ErrorCode.PARSE_ERROR, 0);
    this.name = 'ParseError';
    this.details = originalError?.message;
    Object.setPrototypeOf(this, ParseError.prototype);
  }
}

/**
 * Error factory function to create appropriate error instances
 */
export function createError(
  statusCode: number,
  errorData?: any,
  originalError?: Error
): ApiError {
  const errorCode = HttpStatusToErrorCode[statusCode] || ErrorCode.UNKNOWN_ERROR;
  const message =
    (typeof errorData === 'object' ? errorData?.message : errorData) ||
    ErrorMessages[errorCode] ||
    ErrorMessages[ErrorCode.UNKNOWN_ERROR];
  const details = typeof errorData === 'object' ? errorData?.details : undefined;
  const field = typeof errorData === 'object' ? errorData?.field : undefined;

  switch (statusCode) {
    case 400:
      if (errorData?.errors) {
        return new ValidationError(message, errorData.errors, statusCode);
      }
      return new ApiError(message, ErrorCode.BAD_REQUEST, statusCode, details, field);

    case 401:
      if (errorData?.code === ErrorCode.TOKEN_EXPIRED) {
        return new TokenExpiredError(message);
      }
      return new AuthenticationError(message, statusCode);

    case 403:
      return new AuthorizationError(message, statusCode);

    case 404:
      return new NotFoundError(message, statusCode);

    case 409:
      return new ConflictError(message, statusCode);

    case 429:
      return new RateLimitError(message, errorData?.retryAfter);

    case 500:
      return new ServerError(message, statusCode);

    case 503:
      return new ServerError(ErrorMessages[ErrorCode.SERVICE_UNAVAILABLE], statusCode);

    case 504:
      return new ServerError(ErrorMessages[ErrorCode.GATEWAY_TIMEOUT], statusCode);

    default:
      return new ApiError(message, errorCode, statusCode, details, field);
  }
}

/**
 * Check if error is an API error
 */
export function isApiError(error: any): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: any): error is TimeoutError {
  return error instanceof TimeoutError;
}

/**
 * Check if error is authentication error
 */
export function isAuthenticationError(error: any): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

/**
 * Check if error is token expired
 */
export function isTokenExpiredError(error: any): error is TokenExpiredError {
  return error instanceof TokenExpiredError;
}

/**
 * Check if error is authorization error
 */
export function isAuthorizationError(error: any): error is AuthorizationError {
  return error instanceof AuthorizationError;
}
