import { apiClient } from "../core/apiClient";
import { CreateProductStyleRequest, UpdateProductStyleRequest } from "./types";

export class AdminProductStyle {
    private adminBaseEndpoint = "/api/admin";

    async createProductStyle<TResponse = unknown>(payload: CreateProductStyleRequest): Promise<TResponse> {
      return apiClient.post<TResponse>(`${this.adminBaseEndpoint}/product-styles`, payload);
    }


  async updateProductStyle<TResponse = unknown>(
    styleId: string,
    payload: UpdateProductStyleRequest
  ): Promise<TResponse> {
    return apiClient.put<TResponse>(
      `${this.adminBaseEndpoint}/product-styles/${styleId}`,
      payload
    );
  }

  async deleteProductStyle<TResponse = unknown>(styleId: string): Promise<TResponse> {
    return apiClient.delete<TResponse>(
      `${this.adminBaseEndpoint}/product-styles/${styleId}`
    );
  }

  async getProductStyles<TResponse = unknown>(): Promise<TResponse> {
    return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/product-styles`);
  }

  async getProductStyle<TResponse = unknown>(styleId: string): Promise<TResponse> {
    return apiClient.get<TResponse>(`${this.adminBaseEndpoint}/product-styles/${styleId}`);
  }
}