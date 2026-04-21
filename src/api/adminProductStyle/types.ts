

export interface CreateProductStyleRequest {
    product_type_id: string;
    name: string;
    description?: string;
    image?: string;
    is_active: boolean;
}

export interface UpdateProductStyleRequest {
    product_type_id?: string;
    name?: string;
    description?: string;
    image?: string;
    is_active?: boolean;
}

export interface ProductStyleItem {
    id: string;
    product_type_id?: string;
    product_type_name?: string;
    slug: string;
    name: string;
    description?: string;
    image_url?: string | null;
    is_active: boolean;
    sort_order?: number;
}

export interface ProductStyleListResponse {
    success?: boolean;
    message?: string;
    data?: ProductStyleItem[] | { data?: ProductStyleItem[] };
}

export interface ProductStyleDetailResponse {
    success?: boolean;
    message?: string;
    data?: ProductStyleItem | null;
}

export interface ProductTypeOption {
    id: string;
    name: string;
    is_active?: boolean;
}

export interface ProductTypeOptionsResponse {
    success?: boolean;
    message?: string;
    data?: ProductTypeOption[] | { data?: ProductTypeOption[] };
}