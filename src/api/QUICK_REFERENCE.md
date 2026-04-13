/**
 * API Quick Reference Guide
 * Quick lookup for API usage patterns and common tasks
 */

// ============================================================================
// FILE STRUCTURE
// ============================================================================
/*
src/api/
├── core/
│   ├── apiClient.ts      - Main HTTP client
│   ├── types.ts          - Core types & interfaces
│   ├── errors.ts         - Error classes & handling
│   └── API_SETUP_GUIDE.md - Detailed setup guide
├── auth/
│   ├── index.ts          - Auth endpoints
│   └── types.ts          - Auth types
├── index.ts              - Exports all APIs
├── API_SETUP_GUIDE.md    - Environment setup
└── CUSTOM_API_EXAMPLE.md - Custom API patterns

src/hooks/
└── useAuth.ts            - Auth state management

Environment:
└── .env.local            - Configuration variables
*/

// ============================================================================
// QUICK START
// ============================================================================

// 1. Install dependencies
// npm install
// OR
// yarn install

// 2. Create .env.local file
// NEXT_PUBLIC_API_URL=http://localhost:3001/api
// NEXT_PUBLIC_API_TIMEOUT=30000

// 3. Start dev server
// npm run dev

// ============================================================================
// AUTHENTICATION
// ============================================================================

/*
SIGN UP:
import { authApi } from '@/api';

try {
  const response = await authApi.signUp({
    email: 'user@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    name: 'John Doe',
    agreeToTerms: true,
  });
  console.log('User created:', response.user);
} catch (error) {
  console.error('Signup failed:', error);
}

SIGN IN:
const response = await authApi.signIn({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true,
});

GET PROFILE:
const user = await authApi.getProfile();

UPDATE PROFILE:
await authApi.updateProfile({
  name: 'Jane Doe',
  avatar: 'url-to-image',
});

CHANGE PASSWORD:
await authApi.changePassword({
  oldPassword: 'old123',
  newPassword: 'new123',
  confirmPassword: 'new123',
});

SIGN OUT:
await authApi.signOut();

REFRESH TOKEN:
await authApi.refreshToken();
*/

// ============================================================================
// USING THE AUTH HOOK
// ============================================================================

/*
'use client';

import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshAuth,
  } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn({
        email: 'user@example.com',
        password: 'password',
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <button onClick={handleLogin}>Login</button>;

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
*/

// ============================================================================
// API CLIENT METHODS
// ============================================================================

/*
GET REQUEST:
import { apiClient } from '@/api';

// Simple GET
const data = await apiClient.get('/users');

// With query parameters
const data = await apiClient.get('/users', {
  page: 1,
  limit: 10,
  search: 'john',
});

// With caching
const data = await apiClient.get('/users', undefined, {
  cache: {
    enabled: true,
    duration: 5 * 60 * 1000, // 5 minutes
  },
});

POST REQUEST:
await apiClient.post('/users', {
  name: 'John',
  email: 'john@example.com',
});

PUT REQUEST:
await apiClient.put('/users/1', {
  name: 'Jane',
  email: 'jane@example.com',
});

PATCH REQUEST:
await apiClient.patch('/users/1', {
  name: 'Jane Updated',
});

DELETE REQUEST:
await apiClient.delete('/users/1');

CLEAR CACHE:
apiClient.clearCache();

SET AUTH HEADER:
apiClient.setAuthorizationHeader(token);

CLEAR AUTH HEADER:
apiClient.clearAuthorizationHeader();
*/

// ============================================================================
// ERROR HANDLING
// ============================================================================

/*
BASIC ERROR HANDLING:
try {
  await apiClient.get('/data');
} catch (error) {
  console.error(error);
}

CHECK ERROR TYPE:
import {
  isApiError,
  isNetworkError,
  isTimeoutError,
  isAuthenticationError,
  isTokenExpiredError,
  isAuthorizationError,
  ApiError,
} from '@/api';

try {
  await apiClient.post('/data');
} catch (error) {
  if (isTokenExpiredError(error)) {
    // Token expired - refresh and retry
    await authApi.refreshToken();
  } else if (isAuthenticationError(error)) {
    // Not authenticated - redirect to login
    window.location.href = '/login';
  } else if (isNetworkError(error)) {
    // Network issue - show offline message
  } else if (isTimeoutError(error)) {
    // Timeout - show retry option
  } else if (isApiError(error)) {
    // Generic API error
    console.log(error.code);        // Error code
    console.log(error.statusCode);  // HTTP status
    console.log(error.message);     // Error message
    console.log(error.details);     // Additional details
  }
}

ERROR PROPERTIES:
interface ApiError {
  name: string;              // Error type
  message: string;           // Error message
  code: ErrorCode;           // Machine-readable code
  statusCode: number;        // HTTP status code
  details?: any;             // Additional details
  field?: string;            // Field name (for validation)
  timestamp: string;         // When error occurred
  getUserMessage(): string;  // User-friendly message
  toJSON(): object;          // Serialize error
}

COMMON ERROR CODES:
- VALIDATION_ERROR (400)
- UNAUTHORIZED (401)
- TOKEN_EXPIRED (401)
- FORBIDDEN (403)
- NOT_FOUND (404)
- CONFLICT (409)
- RATE_LIMITED (429)
- INTERNAL_SERVER_ERROR (500)
- SERVICE_UNAVAILABLE (503)
- GATEWAY_TIMEOUT (504)
- NETWORK_ERROR
- TIMEOUT_ERROR
- PARSE_ERROR
*/

// ============================================================================
// INTERCEPTORS
// ============================================================================

/*
REQUEST INTERCEPTOR:
apiClient.addRequestInterceptor((config) => {
  console.log('Request:', config.method, config.headers);
  // Can modify config here
  return config;
});

RESPONSE INTERCEPTOR:
apiClient.addResponseInterceptor(async (response) => {
  console.log('Response:', response.status);
  if (response.status === 401) {
    // Handle 401
  }
  return response;
});

ERROR INTERCEPTOR:
apiClient.addErrorInterceptor((error) => {
  console.log('Error:', error.message);
  // Can transform error here
  return error;
});
*/

// ============================================================================
// CREATING CUSTOM API MODULES
// ============================================================================

/*
1. Create types file: src/api/{resource}/types.ts
   - Define interfaces for your resource
   - Define request/response types

2. Create API class: src/api/{resource}/index.ts
   - Extend or create class
   - Implement methods using apiClient
   - Export singleton instance

3. Create hook: src/hooks/use{Resource}.ts
   - Manage component state
   - Use API methods
   - Handle errors

4. Update exports: src/api/index.ts
   - Add new API and types to exports

See CUSTOM_API_EXAMPLE.md for detailed examples
*/

// ============================================================================
// COMMON TASKS
// ============================================================================

/*
PROTECTED API CALLS:
// Automatically includes Authorization header
const data = await apiClient.get('/protected-endpoint');

ROLE-BASED ACCESS:
if (user?.role === 'admin') {
  // Show admin features
}

PERMISSION CHECKS:
if (user?.permissions.includes('delete')) {
  // Show delete button
}

PAGINATION:
const response = await apiClient.get('/users', {
  page: 1,
  limit: 20,
});
// response has pagination metadata

SEARCH:
const results = await apiClient.get('/search', {
  q: 'search term',
  type: 'users',
});

FILTER:
const filtered = await apiClient.get('/posts', {
  status: 'published',
  category: 'tech',
  sortBy: 'date',
});

CACHING:
const data = await apiClient.get('/expensive-endpoint', undefined, {
  cache: {
    enabled: true,
    duration: 10 * 60 * 1000, // 10 minutes
    key: 'my-custom-key',
  },
});

CLEAR SPECIFIC CACHE:
apiClient.clearCache();

RETRIES:
// Automatically retries up to 3 times with exponential backoff
// Configurable via API_CLIENT_CONFIG
*/

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/*
.env.local (create in project root):

# Required
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_DEBUG_API=true
NEXT_PUBLIC_AUTH_REFRESH_INTERVAL=300000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-client-id
*/

// ============================================================================
// TROUBLESHOOTING
// ============================================================================

/*
TOKEN NOT WORKING?
1. Check .env.local for NEXT_PUBLIC_API_URL
2. Verify token is stored in localStorage
3. Check Authorization header format: "Bearer {token}"
4. Ensure token is not expired

API CALLS FAILING?
1. Check backend is running on configured URL
2. Verify CORS is configured on backend
3. Check network tab in DevTools
4. Look for error code and message

CACHING ISSUES?
1. Call apiClient.clearCache() after mutations
2. Adjust cache duration if needed
3. Use cache.key for unique cache entries

TIMEOUT ERRORS?
1. Increase NEXT_PUBLIC_API_TIMEOUT
2. Check backend performance
3. Consider breaking large requests into smaller ones

RETRY ISSUES?
1. Check backend error response format
2. Verify retry logic applies to your error
3. Check retry count in API_CLIENT_CONFIG
*/

// ============================================================================
// API RESPONSE FORMAT
// ============================================================================

/*
SUCCESS RESPONSE:
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful",
  "statusCode": 200,
  "timestamp": "2024-01-15T10:00:00Z"
}

ERROR RESPONSE:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "email": ["Already exists"],
      "password": ["Too weak"]
    },
    "field": "email"
  },
  "statusCode": 400,
  "timestamp": "2024-01-15T10:00:00Z"
}

PAGINATED RESPONSE:
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "statusCode": 200,
  "timestamp": "2024-01-15T10:00:00Z"
}
*/

export const QUICK_REFERENCE = {
  docs: 'See API_SETUP_GUIDE.md for detailed documentation',
  examples: 'See CUSTOM_API_EXAMPLE.md for implementation examples',
  support: 'Check error handling section for debugging help',
};
