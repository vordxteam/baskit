import { apiClient } from "../core/apiClient";

export class AddressApi {
    private baseEndpoint = "/api/addresses";

    /**
     * Create a new address for the authenticated user
     * POST /api/addresses
     */
    async createAddress<TResponse = unknown>(payload: any): Promise<TResponse> {
        return apiClient.post<TResponse>(
            `${this.baseEndpoint}`,
            payload
        );
    }

    /**
     * Get paginated list of user's addresses
     * GET /api/addresses/paginated
     */
    async getAddresses<TResponse = unknown>(params?: { page?: number; per_page?: number }): Promise<TResponse> {
        return apiClient.get<TResponse>(
            `${this.baseEndpoint}/paginated`,
            params
        );
    }

    /**
     * Update an existing address by ID
     * PUT /api/addresses/{id}
     */
    async updateAddress<TResponse = unknown>(id: number | string, payload: any): Promise<TResponse> {
        return apiClient.put<TResponse>(
            `${this.baseEndpoint}/${id}`,
            payload
        );
    }

    /**
     * Delete an address permanently by ID
     * DELETE /api/addresses/{id}
     */
    async deleteAddress<TResponse = unknown>(id: number | string): Promise<TResponse> {
        return apiClient.delete<TResponse>(
            `${this.baseEndpoint}/${id}`
        );
    }
}

export const addressApi = new AddressApi();