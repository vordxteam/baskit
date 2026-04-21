import apiClient from "../core/apiClient"

export interface ProductSubTypeData {
    id?: string
    product_type_id?: string
    catalog_item_type_ids?: string[]
    name: string
    description?: string
    image?: string
    image_url?: string
    is_active?: boolean
}

export class ProductSubType {
    private baseEndpoint = '/api/admin'

    async createSubtype(subtypeData: ProductSubTypeData): Promise<void> {
        try {
            await apiClient.post(`${this.baseEndpoint}/product-sub-types`, subtypeData)
        } catch (error) {
            throw error
        }
    }

    async updateSubtype(subtypeId: string, subtypeData: ProductSubTypeData): Promise<void> {
        try {
            await apiClient.put(`${this.baseEndpoint}/product-sub-types/${subtypeId}`, subtypeData)
        } catch (error) {
            throw error
        }
    }

    async getSubtypes(): Promise<ProductSubTypeData[]> {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/product-sub-types`)
            return Array.isArray(response) ? response : response.data || []
        } catch (error) {
            throw error
        }
    }

    async getSubtype(subtypeId: string): Promise<ProductSubTypeData> {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/product-sub-types/${subtypeId}`)
            return response.data || response
        } catch (error) {
            throw error
        }
    }

    async deleteSubtypes(subtypeId: string): Promise<void> {
        try {
            await apiClient.delete(`${this.baseEndpoint}/product-sub-types/${subtypeId}`)
        } catch (error) {
            throw error
        }
    }

}