import apiClient from "../core/apiClient";

export type FavouriteProduct = {
    id: string;
    image_url?: string | null;
    name: string;
    price: string;
    short_description?: string | null;
    is_featured?: boolean;
};

export class Favourite {
    async addToFavourites(productId: string): Promise<void> {
        try {
            await apiClient.post(`/api/products/${productId}/favorite`);
        } catch (error) {
            throw error;
        }
    }

    async getFavourites(): Promise<FavouriteProduct[]> {
        try {
            const response = await apiClient.get<{ data?: FavouriteProduct[] } | FavouriteProduct[]>(`/api/products/favorites`);

            if (Array.isArray(response)) {
                return response;
            }

            return Array.isArray(response?.data) ? response.data : [];
        } catch (error) {
            throw error;
        }
    }
}