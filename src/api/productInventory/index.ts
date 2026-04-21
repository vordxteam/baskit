import { apiClient } from "../core/apiClient";
import { CreateData, CreateInventoryRequest, UpdateInventoryRequest } from "./types";

export * from "./types";


export class ProductInventory {
  private baseUrl = "/api/admin";

  async createCatalog<TResponse>(data: CreateData): Promise<TResponse> {
    return apiClient.post<TResponse>(`${this.baseUrl}/catalog-item-types`, data);
  }

  async updateCatalog<TResponse>(id: string, data: CreateData): Promise<TResponse> {
    return apiClient.put<TResponse>(`${this.baseUrl}/catalog-item-types/${id}`, data);
  }

  async getCatalog<TResponse>(): Promise<TResponse> {
    return apiClient.get<TResponse>(`${this.baseUrl}/catalog-item-types`);
  }

  async getCatalogById<TResponse>(id: string): Promise<TResponse> {
    return apiClient.get<TResponse>(`${this.baseUrl}/catalog-item-types/${id}`);
  }

  async deleteCatalog<TResponse>(id: string): Promise<TResponse> {
    return apiClient.delete<TResponse>(`${this.baseUrl}/catalog-item-types/${id}`);
  }

  async getInventory<TResponse>(params?: Record<string, any>): Promise<TResponse> {
    return apiClient.get<TResponse>(`${this.baseUrl}/catalog-items`, params);
  }

  async getInventoryById<TResponse>(id: string): Promise<TResponse> {
    return apiClient.get<TResponse>(`${this.baseUrl}/catalog-items/${id}`);
  }

  private buildInventoryFormData(data: CreateInventoryRequest | UpdateInventoryRequest): FormData {
    const formData = new FormData();
    formData.append("catalog_item_type_id", data.catalog_item_type_id || data.type || "");
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock_quantity", String(data.stock_quantity));
    formData.append("is_active", String(data.is_active));

    if (data.image) {
      formData.append("image", data.image);
    }

    return formData;
  }

  async createInventory<TResponse>(data: CreateInventoryRequest): Promise<TResponse> {
    return apiClient.post<TResponse>(`${this.baseUrl}/catalog-items`, data);
  }

  async CreateInventory<TResponse>(data: CreateInventoryRequest): Promise<TResponse> {
    return this.createInventory<TResponse>(data);
  }

  async updateInventory<TResponse>(id: string, data: UpdateInventoryRequest): Promise<TResponse> {
    return apiClient.put<TResponse>(`${this.baseUrl}/catalog-items/${id}`, this.buildInventoryFormData(data));
  }

  async deleteInventory<TResponse>(id: string): Promise<TResponse> {
    return apiClient.delete<TResponse>(`${this.baseUrl}/catalog-items/${id}`);
  }
}