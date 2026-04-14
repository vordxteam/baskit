import apiClient from "../core/apiClient";


export class UserProduct {
    private baseEndpoint = '/api';

    async getUserProducts(): Promise<any> {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/products`);
            return response.data;
        } catch (error) {
            throw error;            
        }
    }
}