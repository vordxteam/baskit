
export interface ProductSizeType {
    product_type_id: string;
    size_code: string;
    label: string;
    min_items: number;
    max_items: number;
    is_active: boolean;
}

export interface ProductSize {
    id: string;
    product_type_id: string;
    product_type_name: string;
    size_code: string;
    label: string;
    stock_quantity: number | null;
    is_active: boolean;
    min_items: number;
    max_items: number;
}

export interface ProductSizeResponse {
    success: boolean;
    data: {
        sizes: ProductSize[];
        total: number;
    };
}

export interface ProductSizeDetailResponse {
    success: boolean;
    data: ProductSize;
}

export interface CreateProductSizeRequest {
    product_type_id: string;
    size_code: string;
    label: string;
    min_items: number;
    max_items: number;
    is_active: boolean;
}

export type UpdateProductSizeRequest = CreateProductSizeRequest;