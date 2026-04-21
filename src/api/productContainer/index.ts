import apiClient from "../core/apiClient"

export interface ProductContainerData {
    id?: string
    product_type_id: string
    name: string
    description?: string
    image: string,
    is_active?: boolean
}

export class ProductContainer {
    private baseEndpoint = '/api/admin'

    async createContainer(containerData: ProductContainerData): Promise<void> {
        try {
            await apiClient.post(`${this.baseEndpoint}/product-containers`, containerData)
        } catch (error) {
            throw error
        }
    }

    async updateContainer(containerId: string, containerData: ProductContainerData): Promise<void> {
        try {
            await apiClient.put(`${this.baseEndpoint}/product-containers/${containerId}`, containerData)
        } catch (error) {
            throw error
        }
    }

    async getContainers(): Promise<ProductContainerData[]> {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/product-containers`)
            return Array.isArray(response) ? response : response.data || []
        } catch (error) {
            throw error
        }
    }

    async getContainer(containerId: string): Promise<ProductContainerData> {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/product-containers/${containerId}`)
            return response.data || response
        } catch (error) {
            throw error
        }
    }

    async deleteContainers(containerId: string): Promise<void> {
        try {
            await apiClient.delete(`${this.baseEndpoint}/product-containers/${containerId}`)
        } catch (error) {
            throw error
        }
    }

}