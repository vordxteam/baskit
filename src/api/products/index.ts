

import { apiClient } from '../core/apiClient';
import {
	ApiMessageResponse,
	CreateCatalogItemPayload,
	CreateCategoryPayload,
	CreateProductComponentPayload,
	CreateProductFullPayload,
	CreateProductMediaPayload,
	CreateProductPayload,
	CreateProductSizePayload,
	CreateProductTypePayload,
	GetProductsQuery,
	UpdateCatalogItemPayload,
	UpdateProductComponentPayload,
	UpdateProductFullPayload,
	UpdateProductPayload,
	UpdateProductSizePayload,
	UpdateProductStatusPayload,
	UpdateProductTypePayload,
} from './types';

export class ProductApi {
	private adminBaseEndpoint = '/api/admin';
	private userBaseEndpoint = '/api';

    // Admin: Products
	async getAdminProducts<TResponse = unknown>(): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/products`);
	}

	async getAdminProductById<TResponse = unknown>(id: string): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/products/${id}`);
	}

	async createProduct<TResponse = unknown>(payload: CreateProductPayload): Promise<TResponse> {
		return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/products/simple`, payload);
	}

	async updateProduct<TResponse = unknown>(
		id: string,
		payload: UpdateProductPayload
	): Promise<TResponse> {
		return apiClient.put<TResponse>(`${this.adminBaseEndpoint}/products/${id}`, payload);
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

	async createProductFull<TResponse = unknown>(payload: CreateProductFullPayload): Promise<TResponse> {
		return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/products/full`, payload);
	}

	async updateProductFull<TResponse = unknown>(
		id: string,
		payload: UpdateProductFullPayload
	): Promise<TResponse> {
		return apiClient.put<TResponse>(`${this.adminBaseEndpoint}/products/full/${id}`, payload);
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
	async getProductTypes<TResponse = unknown>(): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/product-types`);
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

	// Admin: Product Sizes
	async createProductSize<TResponse = unknown>(
		payload: CreateProductSizePayload
	): Promise<TResponse> {
		return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/product-sizes`, payload);
	}

	async updateProductSize<TResponse = unknown>(
		id: string,
		payload: UpdateProductSizePayload
	): Promise<TResponse> {
		return apiClient.put<TResponse>(`${this.adminBaseEndpoint}/product-sizes/${id}`, payload);
	}

	async deleteProductSize<TResponse = ApiMessageResponse>(id: string): Promise<TResponse> {
		return apiClient.delete<TResponse>(`${this.adminBaseEndpoint}/product-sizes/${id}`);
	}

	// Admin: Catalog Items
	async createCatalogItem<TResponse = unknown>(
		payload: CreateCatalogItemPayload
	): Promise<TResponse> {
		return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/catalog-items`, payload);
	}

	async getCatalogItems<TResponse = unknown>(): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/catalog-items`);
	}

	async getCatalogItemById<TResponse = unknown>(id: string): Promise<TResponse> {
		return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/catalog-items/${id}`);
	}

	async updateCatalogItem<TResponse = unknown>(
		id: string,
		payload: UpdateCatalogItemPayload
	): Promise<TResponse> {
		return apiClient.put<TResponse>(`${this.adminBaseEndpoint}/catalog-items/${id}`, payload);
	}

	async deleteCatalogItem<TResponse = ApiMessageResponse>(id: string): Promise<TResponse> {
		return apiClient.delete<TResponse>(`${this.adminBaseEndpoint}/catalog-items/${id}`);
	}

	// Admin: Product Components
	async createProductComponent<TResponse = unknown>(
		productId: string,
		payload: CreateProductComponentPayload
	): Promise<TResponse> {
		return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/products/${productId}/components`, payload);
	}

	async updateProductComponent<TResponse = unknown>(
		productId: string,
		componentId: string,
		payload: UpdateProductComponentPayload
	): Promise<TResponse> {
		return apiClient.put<TResponse>(
			`${this.adminBaseEndpoint}/products/${productId}/components/${componentId}`,
			payload
		);
	}

	async deleteProductComponent<TResponse = ApiMessageResponse>(
		productId: string,
		componentId: string
	): Promise<TResponse> {
		return apiClient.delete<TResponse>(
			`${this.adminBaseEndpoint}/products/${productId}/components/${componentId}`
		);
	}

	// Admin: Product Media
	async createProductMedia<TResponse = unknown>(
		productId: string,
		payload: CreateProductMediaPayload
	): Promise<TResponse> {
		const formData = new FormData();
		formData.append('file', payload.file);

		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
		const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

		const response = await fetch(`${baseUrl}${this.adminBaseEndpoint}/products/${productId}/media`, {
			method: 'POST',
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			credentials: 'include',
			body: formData,
		});

		const text = await response.text();
		const data = text ? JSON.parse(text) : null;

		if (!response.ok) {
			throw new Error(data?.message || 'Failed to create product media');
		}

		return data as TResponse;
	}

	
}

export const productApi = new ProductApi();