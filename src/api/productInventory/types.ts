export interface InventoryFormPayload {
    catalog_item_type_id: string;
    type?: string;
    name: string;
    description: string;
    image: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
}

export type CreateInventoryRequest = InventoryFormPayload;
export type UpdateInventoryRequest = InventoryFormPayload;

export interface InventoryPagination {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
}

export interface InventoryItem {
    id: string;
    type: string;
    catalog_item_type_id?: string;
    name: string;
    description: string;
    image_url?: string | null;
    price: string | number;
    stock_quantity: number;
    is_active: boolean;
    sku?: string;
    slug?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    metadata?: unknown;
}

export interface InventoryListResponse {
    success?: boolean;
    message?: string;
    data: InventoryItem[];
    pagination?: InventoryPagination;
}

export interface InventoryDetailResponse {
    success?: boolean;
    message?: string;
    data?: InventoryItem | null;
}


export interface CreateData {
    name: string;
    description: string;
    is_active: boolean;
}