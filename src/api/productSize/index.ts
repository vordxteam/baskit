import apiClient from "../core/apiClient";
import { CreateProductSizeRequest, UpdateProductSizeRequest, ProductSizeResponse, ProductSizeDetailResponse } from "./types";


export class ProductSizeAPI {
    private baseurl = "/api/admin";
    
    async getSizes(): Promise<ProductSizeResponse> {
        return apiClient.get<ProductSizeResponse>(`${this.baseurl}/size-templates`);
    }

    async getSizeById(id: string): Promise<ProductSizeDetailResponse> {
        return apiClient.get<ProductSizeDetailResponse>(`${this.baseurl}/size-templates/${id}`);
    }

    async createSize(data: CreateProductSizeRequest): Promise<ProductSizeDetailResponse> {
        return apiClient.post<ProductSizeDetailResponse>(`${this.baseurl}/size-templates`, data);
    }

    async updateSize(id: string, data: UpdateProductSizeRequest): Promise<ProductSizeDetailResponse> {
        return apiClient.put<ProductSizeDetailResponse>(`${this.baseurl}/size-templates/${id}`, data);
    }

    async deleteSize(id: string): Promise<{ success: boolean }> {
        return apiClient.delete<{ success: boolean }>(`${this.baseurl}/size-templates/${id}`);
    }
}

// For backward compatibility
export class ProductSize extends ProductSizeAPI {}