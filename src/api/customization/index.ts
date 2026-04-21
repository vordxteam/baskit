import apiClient from "../core/apiClient";

export class Customization {
      private userBaseEndpoint = "/api";


        async getProductTypes<TResponse = unknown>(params?: Record<string, any>): Promise<TResponse> {
            return apiClient.get<TResponse>(`${this.userBaseEndpoint}/product-types`, params);
        }
    
        async getProductStyles<TResponse = unknown>(id: string): Promise<TResponse> {
            return apiClient.get<TResponse>(`${this.userBaseEndpoint}/product-types/${id}/styles`);
        }
    
        async getProductSize<TResponse = unknown>(id: string): Promise<TResponse> {
            return apiClient.get<TResponse>(`${this.userBaseEndpoint}/product-types/${id}/sizes`);
        }
    
        async getProductItems<TResponse = unknown>(): Promise<TResponse> {
            return apiClient.get<TResponse>(`${this.userBaseEndpoint}/catalog-items`);
        }
    
        async getProductSubTypes<TResponse = unknown>(id: string): Promise<TResponse> {
            return apiClient.get<TResponse>(`${this.userBaseEndpoint}/product-types/${id}/sub-types`);
        }
    
        async getProductStyle<TResponse = unknown>(id: string): Promise<TResponse> {
            return apiClient.get<TResponse>(`${this.userBaseEndpoint}/product-types/${id}/styles`);
        }
    
        async getCatalogItems<TResponse = unknown>(id: string): Promise<TResponse> {
            return apiClient.get<TResponse>(`${this.userBaseEndpoint}/product-sub-types/${id}/catalog-items`);
        }
    
        async getContainer<TResponse = unknown>(id: string): Promise<TResponse> {
            return apiClient.get<TResponse>(`${this.userBaseEndpoint}/containers/${id}`);
        }
}