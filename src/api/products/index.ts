import { apiClient } from "../core/apiClient";
import {
  ApiMessageResponse,
  CreateCategoryPayload,
  CreateConfiguredProductPayload,
  CreateProductFullPayload,
  CreateProductPayload,
  CreateProductTypePayload,
  GetProductsQuery,
  UpdateProductFullPayload,
  UpdateProductStatusPayload,
  UpdateProductTypePayload,
} from "./types";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

export class ProductApi {
  private adminBaseEndpoint = "/api/admin";
  private userBaseEndpoint = "/api";

  // cache paginated admin products by query key
  private adminProductsCache = new Map<string, CacheEntry<unknown>>();

  // optional cache expiry: 5 minutes
  private readonly ADMIN_PRODUCTS_CACHE_TTL = 5 * 60 * 1000;

  private buildProductsCacheKey(params?: GetProductsQuery): string {
    if (!params) return "admin-products::default";

    const normalizedEntries = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([a], [b]) => a.localeCompare(b));

    return `admin-products::${JSON.stringify(normalizedEntries)}`;
  }

  private isCacheValid(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp < this.ADMIN_PRODUCTS_CACHE_TTL;
  }

  clearAdminProductsCache(): void {
    this.adminProductsCache.clear();
  }

  clearAdminProductsCacheByPage(params?: GetProductsQuery): void {
    const key = this.buildProductsCacheKey(params);
    this.adminProductsCache.delete(key);
  }

  async getAdminProducts<TResponse = unknown>(
    params?: GetProductsQuery,
    options?: { forceRefresh?: boolean }
  ): Promise<TResponse> {
    const cacheKey = this.buildProductsCacheKey(params);
    const cached = this.adminProductsCache.get(cacheKey);

    if (!options?.forceRefresh && cached && this.isCacheValid(cached)) {
      return cached.data as TResponse;
    }

    const response = await apiClient.get<TResponse>(
      `${this.adminBaseEndpoint}/products`,
      params as Record<string, any>
    );

    this.adminProductsCache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    });

    return response;
  }

	async getAdminProductById<TResponse = unknown>(id: string): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/products/${id}`);
	}

	async createProduct<TResponse = unknown>(payload: CreateProductPayload): Promise<TResponse> {
		const mediaWithBase64 = await Promise.all(
			payload.media.map(async (mediaItem, index) => {
				const base64 = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(mediaItem.image as File);
				});
				return {
					image: base64,
					is_primary: index === 0,
					sort_order: index,
				};
			})
		);

		const jsonPayload = {
			product: payload.product,
			category_ids: payload.category_ids,
			items: payload.items,
			...(mediaWithBase64.length > 0 ? { media: mediaWithBase64 } : {}),
		};

		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
		const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

		const response = await fetch(`${baseUrl}${this.adminBaseEndpoint}/products/simple`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			credentials: 'include',
			body: JSON.stringify(jsonPayload),
		});

		const text = await response.text();
		const data = text ? JSON.parse(text) : null;

		if (!response.ok) {
			throw new Error(data?.message || 'Failed to create product');
		}

		return data as TResponse;
	}

	async updateProduct<TResponse = unknown>(
		id: string,
		payload: CreateProductPayload
	): Promise<TResponse> {
		const mediaWithBase64 = await Promise.all(
			payload.media.map(async (mediaItem, index) => {
				const base64 = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(mediaItem.image as File);
				});
				return {
					image: base64,
					is_primary: index === 0,
					sort_order: index,
				};
			})
		);

		const jsonPayload = {
			product: payload.product,
			category_ids: payload.category_ids,
			items: payload.items,
			...(mediaWithBase64.length > 0 ? { media: mediaWithBase64 } : {}),
		};

		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
		const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

		const response = await fetch(`${baseUrl}${this.adminBaseEndpoint}/products/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			credentials: 'include',
			body: JSON.stringify(jsonPayload),
		});

		const text = await response.text();
		const data = text ? JSON.parse(text) : null;

		if (!response.ok) {
			throw new Error(data?.message || 'Failed to update product');
		}

		return data as TResponse;
	}

	async deleteProduct<TResponse = ApiMessageResponse>(id: string): Promise<TResponse> {
		return apiClient.delete<TResponse>(`${this.adminBaseEndpoint}/products/${id}`);
	}

	async updateProductStatus<TResponse = unknown>(
		productId: string,
		payload: UpdateProductStatusPayload
	): Promise<TResponse> {
		return apiClient.put<TResponse>(`${this.adminBaseEndpoint}/products/${productId}`, payload);
	}

	async createProductFull<TResponse = unknown>(payload: CreateConfiguredProductPayload): Promise<TResponse> {
		return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/products/simple`, payload);
	}

	async updateProductFull<TResponse = unknown>(
		id: string,
		payload: CreateConfiguredProductPayload
	): Promise<TResponse> {
		return apiClient.put<TResponse>(`${this.adminBaseEndpoint}/products/simple/${id}`, payload);
	}

    // Category Api's

    async createCategory<TResponse = unknown>(payload: CreateCategoryPayload): Promise<TResponse> {
		return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/categories`, payload);
	}
  
	async editCategory<TResponse = unknown>(id: string, payload: CreateCategoryPayload): Promise<TResponse> {
		return apiClient.put<TResponse>(`${this.adminBaseEndpoint}/categories/${id}`, payload);
	}
	
	async deleteCategory<TResponse = unknown>(id: string): Promise<TResponse> {
		return apiClient.delete<TResponse>(`${this.adminBaseEndpoint}/categories/${id}`);
	}

    async getCategory<TResponse = unknown>(params?: GetProductsQuery): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/categories`, params as Record<string, any>);
	}

	async getCategoryById<TResponse = unknown>(id: string): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/categories/${id}`);
	}

	// Customer: Products
	async getProducts<TResponse = unknown>(params?: GetProductsQuery): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.userBaseEndpoint}/products`, params as Record<string, any>);
	}

	async getProductDetails<TResponse = unknown>(id: string): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.userBaseEndpoint}/products/${id}`);
	}

	// Admin: Product Types
	async getProductTypes<TResponse = unknown>(params?: GetProductsQuery): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/product-types`, params as Record<string, any>);
	}

	async getProductStyles<TResponse = unknown>(id: string): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/product-types/${id}/styles`);
	}

	async getProductTypeById<TResponse = unknown>(id: string): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/product-types/${id}`);
	}

	async createProductType<TResponse = unknown>(
		payload: CreateProductTypePayload
	): Promise<TResponse> {
		return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/product-types`, payload);
	}

	async updateProductType<TResponse = unknown>(
		id: string,
		payload: UpdateProductTypePayload
	): Promise<TResponse> {
		return apiClient.put<TResponse>(`${this.adminBaseEndpoint}/product-types/${id}`, payload);
	}

	async deleteProductType<TResponse = ApiMessageResponse>(id: string): Promise<TResponse> {
		return apiClient.delete<TResponse>(`${this.adminBaseEndpoint}/product-types/${id}`);
	}
	
}

export const productApi = new ProductApi();