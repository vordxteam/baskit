import apiClient from "../core/apiClient";
import type {
  ApiProduct,
  ApiProductFilterCategory,
  ProductFiltersData,
  ProductFiltersResponse,
  UserProductsQueryParams,
  UserProductsResponse,
} from "./types";

const normalizeQueryParams = (
  queryParams?: UserProductsQueryParams
): UserProductsQueryParams => {
  const normalized: UserProductsQueryParams = {};

  if (!queryParams) {
    return normalized;
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    (normalized as Record<string, unknown>)[key] = value;
  });

  return normalized;
};

export class UserProduct {
  private baseEndpoint = "/api";

  async getUserProducts(
    queryParams?: UserProductsQueryParams
  ): Promise<ApiProduct[]> {
    try {
      const normalizedParams = normalizeQueryParams(queryParams);
      const response = await apiClient.get<UserProductsResponse>(
        `${this.baseEndpoint}/products`,
        normalizedParams
      );

      const normalized = Array.isArray(response?.data) ? response.data : [];
      return normalized;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId: string): Promise<ApiProduct> {
    try {
      const response = await apiClient.get<ApiProduct | { data: ApiProduct }>(
        `${this.baseEndpoint}/products/${productId}`
      );

      if (response && typeof response === "object" && "data" in response) {
        return response.data;
      }

      return response as ApiProduct;
    } catch (error) {
      throw error;
    }
  }

  async getProductFilters(
    productType?: 'bouquet' | 'basket'
  ): Promise<ProductFiltersData> {
    try {
      const filterQuery = productType ? { product_type: productType } : undefined;
      const response = await apiClient.get<
        ProductFiltersResponse | ApiProductFilterCategory[]
      >(`${this.baseEndpoint}/products/meta`, filterQuery)

      if (Array.isArray(response)) {
        return {
          product_types: response.map((item) => ({
            id: item.id,
            name: item.name,
            styles: Array.isArray(item.styles) ? item.styles : [],
          })),
          categories: [],
          sizes: [],
        };
      }

      const responseData = response?.data;

      if (Array.isArray(responseData)) {
        return {
          product_types: responseData.map((item) => ({
            id: item.id,
            name: item.name,
            styles: Array.isArray(item.styles) ? item.styles : [],
          })),
          categories: [],
          sizes: [],
        };
      }

      const productTypes =
        responseData &&
        typeof responseData === "object" &&
        Array.isArray(responseData.product_types)
          ? responseData.product_types.map((item) => ({
              id: item.id,
              name: item.name,
              styles: Array.isArray(item.styles) ? item.styles : [],
            }))
          : [];

      const categories =
        responseData &&
        typeof responseData === "object" &&
        Array.isArray(responseData.categories)
          ? responseData.categories.map((item) => ({
              id: item.id,
              name: item.name,
            }))
          : [];

      const sizes =
        responseData &&
        typeof responseData === "object" &&
        Array.isArray(responseData.sizes)
          ? responseData.sizes.map((item) => ({
              code: item.code,
              label: item.label,
            }))
          : [];

      return {
        product_types: productTypes,
        categories,
        sizes,
      };
    } catch (error) {
      throw error;
    }
  }
}