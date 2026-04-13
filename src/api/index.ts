/**
 * API Module Exports
 * Central entry point for all API functionality
 */

// Core exports
export { apiClient, ApiClient } from './core/apiClient';
export * from './core/types';
export * from './core/errors';

// Auth exports
export { authApi, AuthAPI } from './auth/index';
export * from './auth/types';

// Product exports
export { productApi, ProductApi } from './products/index';
export * from './products/types';
