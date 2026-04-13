/**
 * API Configuration Guide
 * 
 * This file provides environment configuration and backend setup instructions
 */

// ============================================================================
// 1. ENVIRONMENT VARIABLES
// ============================================================================
// Create a .env.local file in the project root with these variables:

/*
# API Server Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Optional: API Timeout (milliseconds)
NEXT_PUBLIC_API_TIMEOUT=30000

# Optional: Enable API request logging
NEXT_PUBLIC_DEBUG_API=true

# Authentication
NEXT_PUBLIC_AUTH_REFRESH_INTERVAL=300000  # 5 minutes

# OAuth Configuration (if using)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your-microsoft-client-id
*/

// ============================================================================
// 2. EXPECTED BACKEND API STRUCTURE
// ============================================================================
/*
Your backend API should follow this structure:

├── /api/auth
│   ├── POST   /signup              - Register new user
│   ├── POST   /signin              - Login user
│   ├── POST   /signout             - Logout user
│   ├── POST   /refresh-token       - Refresh access token
│   ├── GET    /profile             - Get current user profile
│   ├── PATCH  /profile             - Update user profile
│   ├── POST   /forgot-password     - Request password reset
│   ├── POST   /reset-password      - Reset password with token
│   ├── POST   /change-password     - Change password (authenticated)
│   ├── POST   /verify-email        - Verify email
│   ├── POST   /resend-verification-email - Resend verification
│   ├── POST   /2fa/setup           - Setup 2FA
│   ├── POST   /2fa/enable          - Enable 2FA
│   ├── POST   /2fa/disable         - Disable 2FA
│   └── POST   /oauth/login         - OAuth login
│
├── /api/users
│   ├── GET    /                    - List all users (paginated)
│   ├── GET    /:id                 - Get user by ID
│   ├── PUT    /:id                 - Update user
│   └── DELETE /:id                 - Delete user
│
└── /api/[other-resources]
    └── ...
*/

// ============================================================================
// 3. EXPECTED API RESPONSES
// ============================================================================
/*
Standard Success Response (SignIn):
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "role": "user",
      "permissions": ["read", "create", "update"],
      "isEmailVerified": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z",
      "lastLogin": "2024-01-15T00:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  },
  "message": "Login successful",
  "statusCode": 200,
  "timestamp": "2024-01-15T00:00:00Z"
}

Standard Error Response:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid email format"],
      "password": ["Password must be at least 8 characters"]
    },
    "field": null
  },
  "statusCode": 400,
  "timestamp": "2024-01-15T00:00:00Z"
}

Validation Error Response:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email already exists", "Invalid format"],
      "password": ["Too weak"]
    },
    "field": "email"
  },
  "statusCode": 400,
  "timestamp": "2024-01-15T00:00:00Z"
}

Authentication Error Response:
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid credentials",
    "details": null,
    "field": null
  },
  "statusCode": 401,
  "timestamp": "2024-01-15T00:00:00Z"
}

Token Expired Response:
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Session expired",
    "details": null,
    "field": null
  },
  "statusCode": 401,
  "timestamp": "2024-01-15T00:00:00Z"
}
*/

// ============================================================================
// 4. REQUEST/RESPONSE FLOW
// ============================================================================
/*
User Login Flow:
1. User enters credentials
2. Frontend calls: authApi.signIn({ email, password })
3. API Client adds headers and makes POST request to /auth/signin
4. Backend validates credentials
5. Backend generates JWT tokens (access + refresh)
6. Backend returns user profile and tokens
7. Frontend stores tokens in localStorage
8. Frontend sets Authorization header: "Bearer {accessToken}"
9. Frontend updates user state

Token Refresh Flow:
1. API intercepts 401 error (token expired)
2. Frontend calls: authApi.refreshToken()
3. API Client sends refreshToken to /auth/refresh-token
4. Backend validates refreshToken
5. Backend generates new accessToken
6. Frontend updates stored tokens
7. Frontend retries original request with new token
8. If refresh fails, user is logged out

API Request with Auth:
1. Component calls: apiClient.get('/api/users')
2. API Client adds Authorization header
3. Backend validates token in middleware
4. Backend processes request
5. Backend returns response
6. Frontend handles response/error
*/

// ============================================================================
// 5. EXAMPLE BACKEND IMPLEMENTATION (Node.js/Express)
// ============================================================================
/*
// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No token provided',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
      },
    });
  }
}

// routes/auth.routes.ts
import { Router, Request, Response } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/signout', authMiddleware, authController.signOut);
router.post('/refresh-token', authController.refreshToken);
router.get('/profile', authMiddleware, authController.getProfile);
router.patch('/profile', authMiddleware, authController.updateProfile);

export default router;

// controllers/auth.controller.ts
export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password required',
          details: {
            email: email ? [] : ['Required'],
            password: password ? [] : ['Required'],
          },
        },
      });
    }

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !await user.verifyPassword(password)) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        },
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // Return response
    return res.json({
      success: true,
      data: {
        user: user.toJSON(),
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600,
        },
      },
      message: 'Login successful',
      statusCode: 200,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
}
*/

// ============================================================================
// 6. ERROR HANDLING CODES
// ============================================================================
/*
Frontend Error Codes:
- VALIDATION_ERROR (400): Form validation failed
- UNAUTHORIZED (401): Not authenticated or invalid credentials
- TOKEN_EXPIRED (401): Access token expired
- FORBIDDEN (403): Insufficient permissions
- NOT_FOUND (404): Resource not found
- CONFLICT (409): Data conflict (e.g., email already exists)
- RATE_LIMITED (429): Too many requests
- INTERNAL_SERVER_ERROR (500): Server error
- SERVICE_UNAVAILABLE (503): Service temporarily down
- GATEWAY_TIMEOUT (504): Request timeout
- NETWORK_ERROR: Network connection issue
- TIMEOUT_ERROR: Request timeout
- PARSE_ERROR: JSON parsing failed
*/

// ============================================================================
// 7. USAGE EXAMPLES
// ============================================================================
/*
// Using in a component
import { useAuth } from '@/hooks/useAuth';
import { isTokenExpiredError } from '@/api/core/errors';

export function LoginForm() {
  const { signIn, isLoading, error } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await signIn({ email, password });
      // Redirect to dashboard
    } catch (error) {
      if (isTokenExpiredError(error)) {
        // Handle token expiration
      }
    }
  };

  return (
    // Form JSX
  );
}

// Making API calls
import { apiClient } from '@/api';

async function fetchData() {
  try {
    const data = await apiClient.get('/users');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Error handling patterns
import { isApiError, isNetworkError, isTimeoutError } from '@/api/core/errors';

try {
  await apiClient.post('/data', payload);
} catch (error) {
  if (isApiError(error)) {
    console.log(error.code); // Error code
    console.log(error.getUserMessage()); // User-friendly message
  } else if (isNetworkError(error)) {
    console.log('Network error');
  } else if (isTimeoutError(error)) {
    console.log('Request timeout');
  }
}
*/

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  retries: 3,
  retryDelay: 1000,
};

export const AUTH_CONFIG = {
  refreshInterval: parseInt(
    process.env.NEXT_PUBLIC_AUTH_REFRESH_INTERVAL || '300000'
  ), // 5 minutes
  tokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
};
