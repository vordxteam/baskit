/**
 * Example: Creating Custom API Modules
 * 
 * This file demonstrates the pattern for creating additional API modules
 * beyond authentication. Follow this pattern for Users, Products, etc.
 */

import { apiClient } from '@/api/core/apiClient';
import { ApiResponse, PaginatedApiResponse } from '@/api/core/types';

// ============================================================================
// STEP 1: Define Types for Your Resource
// ============================================================================

/**
 * Example: User Resource Types
 * File: src/api/user/types.ts
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface ListUsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// STEP 2: Create API Class
// ============================================================================

/**
 * Example: User API Class
 * File: src/api/user/index.ts
 */
export class UserAPI {
  private baseEndpoint = '/users';

  /**
   * Get all users with pagination and filtering
   */
  async getUsers(params?: ListUsersParams): Promise<ListUsersResponse> {
    return apiClient.get<ListUsersResponse>(
      `${this.baseEndpoint}`,
      params,
      {
        cache: {
          enabled: true,
          duration: 60000, // 1 minute cache
        },
      }
    );
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`${this.baseEndpoint}/${id}`, undefined, {
      cache: {
        enabled: true,
        duration: 60000,
        key: `user:${id}`,
      },
    });
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<{ user: User }>(
      `${this.baseEndpoint}`,
      data
    );
    // Invalidate cache after creation
    apiClient.clearCache();
    return response.user;
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<{ user: User }>(
      `${this.baseEndpoint}/${id}`,
      data
    );
    // Invalidate specific user cache
    apiClient.clearCache();
    return response.user;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${this.baseEndpoint}/${id}`
    );
    // Clear cache after deletion
    apiClient.clearCache();
    return response;
  }

  /**
   * Search users
   */
  async searchUsers(query: string): Promise<User[]> {
    return apiClient.get<User[]>(
      `${this.baseEndpoint}/search`,
      { q: query },
      {
        cache: {
          enabled: true,
          duration: 30000, // 30 seconds
          key: `users:search:${query}`,
        },
      }
    );
  }

  /**
   * Export users as CSV
   */
  async exportUsers(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    return apiClient.get<Blob>(
      `${this.baseEndpoint}/export`,
      { format }
    );
  }

  /**
   * Batch delete users
   */
  async batchDeleteUsers(ids: string[]): Promise<{ deleted: number; message: string }> {
    const response = await apiClient.post<{ deleted: number; message: string }>(
      `${this.baseEndpoint}/batch-delete`,
      { ids }
    );
    apiClient.clearCache();
    return response;
  }
}

export const userApi = new UserAPI();

// ============================================================================
// STEP 3: Create Hook for Component Usage
// ============================================================================

/**
 * Example: User Hook
 * File: src/hooks/useUsers.ts
 */
import { useEffect, useState } from 'react';
import { User, ListUsersParams } from '@/api/user/types';

export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (params?: ListUsersParams) => Promise<void>;
  createUser: (data: any) => Promise<void>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (params?: ListUsersParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getUsers(params);
      setUsers(response.users);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await userApi.createUser(data);
      setUsers([...users, newUser]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await userApi.updateUser(id, data);
      setUsers(users.map(u => u.id === id ? updated : u));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}

// ============================================================================
// STEP 4: Use in Components
// ============================================================================

/**
 * Example: UserList Component
 * File: src/components/UserList.tsx
 */

/*
'use client';

import { useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';

export function UserList() {
  const { users, loading, error, fetchUsers, deleteUser } = useUsers();

  useEffect(() => {
    fetchUsers({ page: 1, limit: 10 });
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;
  if (users.length === 0) return <div>No users found</div>;

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
*/

// ============================================================================
// STEP 5: Update API Index Export
// ============================================================================

/**
 * Update: src/api/index.ts
 * Add these exports to the main API index
 */

/*
// User API exports
export { userApi, UserAPI } from './user/index';
export * from './user/types';
*/

// ============================================================================
// TEMPLATE: Copy and Customize for Your Resources
// ============================================================================

/**
 * TEMPLATE: Product API
 * 
 * Create these files:
 * - src/api/product/types.ts
 * - src/api/product/index.ts
 * - src/hooks/useProducts.ts
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
}

export class ProductAPI {
  private baseEndpoint = '/products';

  async getProducts(params?: any) {
    return apiClient.get(`${this.baseEndpoint}`, params, {
      cache: { enabled: true, duration: 60000 },
    });
  }

  async getProductById(id: string): Promise<Product> {
    return apiClient.get(`${this.baseEndpoint}/${id}`, undefined, {
      cache: { enabled: true, duration: 60000, key: `product:${id}` },
    });
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<{ product: Product }>(
      `${this.baseEndpoint}`,
      data
    );
    apiClient.clearCache();
    return response.product;
  }

  async updateProduct(id: string, data: Partial<CreateProductRequest>): Promise<Product> {
    const response = await apiClient.patch<{ product: Product }>(
      `${this.baseEndpoint}/${id}`,
      data
    );
    apiClient.clearCache();
    return response.product;
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${this.baseEndpoint}/${id}`);
    apiClient.clearCache();
  }
}

export const productApi = new ProductAPI();

// ============================================================================
// COMMON PATTERNS & BEST PRACTICES
// ============================================================================

/*
1. Naming Convention:
   - API Classes: {Resource}API (UserAPI, ProductAPI)
   - Hook names: use{Resource} (useUsers, useProducts)
   - Endpoint property: baseEndpoint = '/{resource}'

2. Caching:
   - Cache GET requests with reasonable TTLs
   - Clear cache after CREATE/UPDATE/DELETE
   - Use specific cache keys for single item queries

3. Error Handling:
   - Use try-catch in all API methods
   - Let errors propagate or handle them
   - Provide user-friendly error messages in hooks

4. Type Safety:
   - Define Request and Response types for each endpoint
   - Use generics in apiClient methods
   - Always specify return types

5. HTTP Methods:
   - GET: Retrieve data (cache when possible)
   - POST: Create new resource
   - PUT: Replace entire resource
   - PATCH: Partial update
   - DELETE: Remove resource

6. Pagination:
   - Pass page and limit parameters
   - Return pagination metadata
   - Handle edge cases (empty, last page)

7. Performance:
   - Use caching strategically
   - Batch operations when possible
   - Invalidate cache intelligently
   - Debounce search/filter requests
*/
