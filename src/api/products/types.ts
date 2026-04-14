/**
 * Products API Types
 * Covers admin and customer product endpoints from the Postman collection.
 */

export type UUID = string;
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| { [key: string]: JsonValue }
	| JsonValue[];

export type Metadata = Record<string, JsonValue>;

export type ProductMode = 'PREMADE' | 'CUSTOM';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export interface ApiMessageResponse {
	success?: boolean;
	message?: string;
}

// --------------------
// Admin: Product Types
// --------------------

export interface CreateProductTypePayload {
	code: string;
	name: string;
	description: string;
	is_active: boolean;
	sort_order: number;
}

export interface UpdateProductTypePayload {
	code: string;
	name: string;
	description: string;
	is_active: boolean;
	sort_order: number;
}

export const CREATE_PRODUCT_TYPE_PAYLOAD_EXAMPLE: CreateProductTypePayload = {
	code: 'BASKET',
	name: 'Basket',
	description: 'Custom gift baskets',
	is_active: true,
	sort_order: 2,
};

export const UPDATE_PRODUCT_TYPE_PAYLOAD_EXAMPLE: UpdateProductTypePayload = {
	code: 'BOUQUET',
	name: 'Premium Bouquet',
	description: 'Luxury flower bouquets',
	is_active: true,
	sort_order: 1,
};

// -------------------
// Admin: Product Size
// -------------------

export interface CreateProductSizePayload {
	product_id: UUID;
	size_code: string;
	label: string;
	price: number;
	compare_at_price: number;
	stock_quantity: number;
	is_active: boolean;
	approval_required_if_customized: boolean;
	direct_order_allowed_without_customization: boolean;
	metadata: Metadata;
}

export interface UpdateProductSizePayload {
	label: string;
	price: number;
	stock_quantity: number;
	is_active: boolean;
	metadata: Metadata;
}

export const CREATE_PRODUCT_SIZE_PAYLOAD_EXAMPLE: CreateProductSizePayload = {
	product_id: '019d6d03-7d71-711c-8962-9bb3a3e9233b',
	size_code: 'M',
	label: 'Medium',
	price: 100,
	compare_at_price: 110,
	stock_quantity: 50,
	is_active: true,
	approval_required_if_customized: true,
	direct_order_allowed_without_customization: true,
	metadata: {
		key: 'value',
	},
};

export const UPDATE_PRODUCT_SIZE_PAYLOAD_EXAMPLE: UpdateProductSizePayload = {
	label: 'Medium',
	price: 54.99,
	stock_quantity: 30,
	is_active: true,
	metadata: {
		serves: '8-12',
		popular: true,
	},
};

// ----------------------
// Admin: Catalog Items
// ----------------------

export interface CreateCatalogItemPayload {
	type: string;
	sku: string;
	name: string;
	slug: string;
	description: string;
	image_url: string;
	price: number;
	stock_quantity: number;
	is_active: boolean;
}

export interface UpdateCatalogItemPayload {
	name: string;
	price: number;
	stock_quantity: number;
	is_active: boolean;
	metadata: Metadata;
}

export const CREATE_CATALOG_ITEM_PAYLOAD_EXAMPLE: CreateCatalogItemPayload = {
	type: 'GREETING_CARD',
	sku: 'CARD-001',
	name: 'Greeting Card',
	slug: 'greeting-card',
	description: 'Custom message card',
	image_url: 'https://example.com/card.jpg',
	price: 2,
	stock_quantity: 200,
	is_active: true,
};

export const UPDATE_CATALOG_ITEM_PAYLOAD_EXAMPLE: UpdateCatalogItemPayload = {
	name: 'Luxury Chocolate Box',
	price: 18.99,
	stock_quantity: 60,
	is_active: true,
	metadata: {
		brand: 'Baskit Signature',
		premium: true,
	},
};

// ------------------------
// Admin: Product Components
// ------------------------

export interface CreateProductComponentPayload {
	product_size_id: UUID;
	catalog_item_id: UUID;
	quantity: number;
	is_default: boolean;
	is_removable: boolean;
	sort_order: number;
}

export interface UpdateProductComponentPayload {
	quantity: number;
	is_default: boolean;
	is_removable: boolean;
	sort_order: number;
}

export const CREATE_PRODUCT_COMPONENT_PAYLOAD_EXAMPLE: CreateProductComponentPayload = {
	product_size_id: '019d6d08-695e-7088-8e31-327b8d295d42',
	catalog_item_id: '019d6d22-d8e9-71df-adfc-077b0c06c637',
	quantity: 8,
	is_default: true,
	is_removable: false,
	sort_order: 0,
};

export const UPDATE_PRODUCT_COMPONENT_PAYLOAD_EXAMPLE: UpdateProductComponentPayload = {
	quantity: 15,
	is_default: true,
	is_removable: true,
	sort_order: 1,
};

// --------------------
// Admin: Product Media
// --------------------

export interface CreateProductMediaPayload {
	file: File | Blob;
}

// ----------------
// Admin: Products
// ----------------

export interface CreateProductPayload {
  product: Product;
  category_ids: string[];
  media: Media[];
  items: Item[];
}

export interface Product {
  product_type_id: string; // UUID
  name: string;
  short_description: string;
  description: string;
  tier: "BASIC" | "STANDARD" | "PREMIUM"; // adjust if needed
  price: number;
  compare_at_price: number;
  status: "ACTIVE" | "INACTIVE"; // extend if needed
}

export interface Media {
	image: File | Blob;
}

export interface Item {
  name: string;
  quantity: number;
}

export interface UpdateProductPayload {
	name: string;
	is_featured: boolean;
	status: ProductStatus;
	requires_approval_on_customization: boolean;
	metadata: Metadata;
	category_ids: UUID[];
}

export interface UpdateProductStatusPayload {
	status: ProductStatus;
}

export const UPDATE_PRODUCT_PAYLOAD_EXAMPLE: UpdateProductPayload = {
	name: 'Premium Red Rose Bouquet updated',
	is_featured: true,
	status: 'ACTIVE',
	requires_approval_on_customization: false,
	metadata: {
		theme: 'romantic',
		premium: true,
	},
	category_ids: ['019d6cfb-8b6e-712f-b0e8-ef86f51d32ab'],
};

export const UPDATE_PRODUCT_STATUS_PAYLOAD_EXAMPLE: UpdateProductStatusPayload = {
	status: 'ACTIVE',
};

// ---------------------
// Admin: Full Product
// ---------------------

export interface FullProductCorePayload {
	product_type_id: UUID;
	mode: ProductMode;
	sku: string;
	name: string;
	slug: string;
	short_description: string;
	description: string;
	base_image_url: string;
	is_featured: boolean;
	status: ProductStatus;
	requires_approval_on_customization: boolean;
	supports_customization: boolean;
	metadata: Metadata;
}

export interface FullProductMediaPayload {
	media_url: string;
	alt_text: string;
	sort_order: number;
	is_primary: boolean;
}

export interface FullProductSizePayload {
	id?: UUID;
	client_key: string;
	size_code: string;
	label: string;
	price: number;
	compare_at_price: number;
	stock_quantity: number;
	is_active: boolean;
	approval_required_if_customized: boolean;
	direct_order_allowed_without_customization: boolean;
	metadata: Metadata;
}

export interface FullProductComponentPayload {
	id?: UUID;
	size_client_key?: string;
	catalog_item_id?: UUID;
	quantity: number;
	is_default: boolean;
	is_removable: boolean;
	sort_order: number;
}

export interface FullProductCustomizationRulePayload {
	id?: UUID;
	size_client_key?: string;
	customization_group_id?: UUID;
	is_allowed: boolean;
	is_required: boolean;
	min_select: number;
	max_select: number;
	allow_custom_text: boolean;
	custom_text_max_length: number | null;
}

export interface FullProductAllowedItemPayload {
	size_client_key: string;
	catalog_item_id: UUID;
	is_allowed: boolean;
	min_quantity: number;
	max_quantity: number;
	is_required: boolean;
	price_override: number;
}

export interface CreateProductFullPayload {
	product: FullProductCorePayload;
	category_ids: UUID[];
	media: FullProductMediaPayload[];
	sizes: FullProductSizePayload[];
	components: FullProductComponentPayload[];
	customization_rules: FullProductCustomizationRulePayload[];
	allowed_items: FullProductAllowedItemPayload[];
}

export interface UpdateProductFullPayload {
	product: FullProductCorePayload;
	category_ids: UUID[];
	sizes: FullProductSizePayload[];
	components: FullProductComponentPayload[];
	customization_rules: FullProductCustomizationRulePayload[];
	allowed_items: FullProductAllowedItemPayload[];
}

export const CREATE_PRODUCT_FULL_PAYLOAD_EXAMPLE: CreateProductFullPayload = {
	product: {
		product_type_id: '019d6d02-9d1f-7155-bfb1-9ad724025121',
		mode: 'PREMADE',
		sku: 'BOUQ-BDAY-001',
		name: 'Birthday Bouquet Premium',
		slug: 'birthday-bouquet-premium',
		short_description: 'Beautiful birthday flowers',
		description: 'Detailed description of the premium birthday bouquet with fresh red roses.',
		base_image_url: 'https://example.com/images/bouquet-main.jpg',
		is_featured: true,
		status: 'DRAFT',
		requires_approval_on_customization: true,
		supports_customization: true,
		metadata: {
			occasion: 'birthday',
			target_age: 'all',
		},
	},
	category_ids: ['019d6cfb-8b6e-712f-b0e8-ef86f51d32ab'],
	media: [
		{
			media_url: 'https://example.com/images/bouquet-main.jpg',
			alt_text: 'Main bouquet image',
			sort_order: 0,
			is_primary: true,
		},
		{
			media_url: 'https://example.com/images/bouquet-side.jpg',
			alt_text: 'Side bouquet image',
			sort_order: 1,
			is_primary: false,
		},
	],
	sizes: [
		{
			client_key: 'size_small',
			size_code: 'S',
			label: 'Small',
			price: 50,
			compare_at_price: 65,
			stock_quantity: 100,
			is_active: true,
			approval_required_if_customized: true,
			direct_order_allowed_without_customization: true,
			metadata: {
				dimensions: '20cm x 25cm',
			},
		},
		{
			client_key: 'size_medium',
			size_code: 'M',
			label: 'Medium',
			price: 80,
			compare_at_price: 100,
			stock_quantity: 75,
			is_active: true,
			approval_required_if_customized: true,
			direct_order_allowed_without_customization: true,
			metadata: {
				dimensions: '30cm x 35cm',
			},
		},
		{
			client_key: 'size_large',
			size_code: 'L',
			label: 'Large',
			price: 120,
			compare_at_price: 150,
			stock_quantity: 50,
			is_active: true,
			approval_required_if_customized: true,
			direct_order_allowed_without_customization: true,
			metadata: {
				dimensions: '40cm x 45cm',
			},
		},
	],
	components: [
		{
			size_client_key: 'size_small',
			catalog_item_id: '019d6d22-d8e9-71df-adfc-077b0c06c637',
			quantity: 8,
			is_default: true,
			is_removable: false,
			sort_order: 0,
		},
		{
			size_client_key: 'size_medium',
			catalog_item_id: '019d6d22-d8e9-71df-adfc-077b0c06c637',
			quantity: 12,
			is_default: true,
			is_removable: false,
			sort_order: 0,
		},
		{
			size_client_key: 'size_large',
			catalog_item_id: '019d6d22-d8e9-71df-adfc-077b0c06c637',
			quantity: 16,
			is_default: true,
			is_removable: false,
			sort_order: 0,
		},
	],
	customization_rules: [
		{
			size_client_key: 'size_small',
			customization_group_id: '019d6d2a-749c-7007-9181-86ec9117dd89',
			is_allowed: true,
			is_required: false,
			min_select: 0,
			max_select: 1,
			allow_custom_text: false,
			custom_text_max_length: null,
		},
		{
			size_client_key: 'size_medium',
			customization_group_id: '019d6d2a-749c-7007-9181-86ec9117dd89',
			is_allowed: true,
			is_required: true,
			min_select: 1,
			max_select: 1,
			allow_custom_text: false,
			custom_text_max_length: null,
		},
		{
			size_client_key: 'size_large',
			customization_group_id: '019d6d2a-749c-7007-9181-86ec9117dd89',
			is_allowed: true,
			is_required: true,
			min_select: 1,
			max_select: 1,
			allow_custom_text: false,
			custom_text_max_length: null,
		},
	],
	allowed_items: [],
};

export const UPDATE_PRODUCT_FULL_PAYLOAD_EXAMPLE: UpdateProductFullPayload = {
	product: {
		product_type_id: '019d6d02-9d1f-7155-bfb1-9ad724025121',
		mode: 'PREMADE',
		sku: 'BOUQ-BDAY-001',
		name: 'Luxury Red Rose Bouquet',
		slug: 'luxury-red-rose-bouquet',
		short_description: 'Luxury rose bouquet for premium gifting',
		description:
			'A premium handcrafted bouquet with fresh red roses, elegant wrapping, ribbon customization, and optional gift add-ons.',
		base_image_url: 'https://example.com/images/bouquet-main.jpg',
		is_featured: true,
		status: 'ACTIVE',
		requires_approval_on_customization: false,
		supports_customization: true,
		metadata: {
			theme: 'romantic',
			premium: true,
			occasion: 'birthday',
		},
	},
	category_ids: ['019d71d0-e570-70bf-a0c9-fe453a02d710', '019d71d3-63f6-7378-aaeb-21bc3e57596c'],
	sizes: [
		{
			id: '019d6d86-8284-726b-b916-c49726c48447',
			client_key: 'small',
			size_code: 'S',
			label: 'Small Bouquet',
			price: 49.99,
			compare_at_price: 59.99,
			stock_quantity: 80,
			is_active: true,
			approval_required_if_customized: true,
			direct_order_allowed_without_customization: true,
			metadata: {
				dimensions: '20cm x 25cm',
				stems_range: '8-10',
				display_order: 1,
			},
		},
		{
			id: '019d6d86-828b-72e9-b0d9-cbfd46e83320',
			client_key: 'medium',
			size_code: 'M',
			label: 'Medium Bouquet',
			price: 79.99,
			compare_at_price: 95,
			stock_quantity: 40,
			is_active: true,
			approval_required_if_customized: true,
			direct_order_allowed_without_customization: true,
			metadata: {
				stems_range: '12-15',
				popular: true,
				display_order: 2,
			},
		},
		{
			id: '019d6d86-828e-70b4-b8a5-d0a155cb1836',
			client_key: 'large',
			size_code: 'L',
			label: 'Large Bouquet',
			price: 109.99,
			compare_at_price: 129.99,
			stock_quantity: 25,
			is_active: true,
			approval_required_if_customized: true,
			direct_order_allowed_without_customization: true,
			metadata: {
				dimensions: '40cm x 45cm',
				stems_range: '18-22',
				display_order: 3,
			},
		},
		{
			client_key: 'xlarge',
			size_code: 'XL',
			label: 'Extra Large Bouquet',
			price: 149.99,
			compare_at_price: 179.99,
			stock_quantity: 15,
			is_active: true,
			approval_required_if_customized: true,
			direct_order_allowed_without_customization: false,
			metadata: {
				dimensions: '50cm x 60cm',
				stems_range: '24-30',
				display_order: 4,
			},
		},
	],
	components: [
		{
			id: '019d6d86-8293-70fb-8762-0980bd594f03',
			quantity: 10,
			is_default: true,
			is_removable: false,
			sort_order: 1,
		},
		{
			id: '019d6d86-8299-72f3-a647-d43e5517f3e6',
			quantity: 15,
			is_default: true,
			is_removable: false,
			sort_order: 1,
		},
		{
			id: '019d6d86-829b-7246-8a21-9d7bcdb49584',
			quantity: 20,
			is_default: true,
			is_removable: false,
			sort_order: 1,
		},
		{
			size_client_key: 'xlarge',
			catalog_item_id: '019d6d22-d8e9-71df-adfc-077b0c06c637',
			quantity: 28,
			is_default: true,
			is_removable: false,
			sort_order: 1,
		},
		{
			size_client_key: 'xlarge',
			catalog_item_id: '019d71da-2e3e-7364-911d-36909eca9877',
			quantity: 1,
			is_default: true,
			is_removable: false,
			sort_order: 2,
		},
		{
			size_client_key: 'xlarge',
			catalog_item_id: '019d71da-527d-71db-a5f4-243474286922',
			quantity: 1,
			is_default: true,
			is_removable: false,
			sort_order: 3,
		},
	],
	customization_rules: [
		{
			id: '019d6d86-82a0-727a-aef3-a2d39446c8d8',
			is_allowed: true,
			is_required: false,
			min_select: 0,
			max_select: 1,
			allow_custom_text: false,
			custom_text_max_length: 0,
		},
		{
			id: '019d6d86-82a4-71ef-9b3d-c78ada1f8e62',
			is_allowed: true,
			is_required: true,
			min_select: 1,
			max_select: 2,
			allow_custom_text: true,
			custom_text_max_length: 120,
		},
		{
			id: '019d6d86-82a7-738b-851c-ad684c8f3f4c',
			is_allowed: true,
			is_required: true,
			min_select: 1,
			max_select: 2,
			allow_custom_text: true,
			custom_text_max_length: 200,
		},
		{
			size_client_key: 'xlarge',
			customization_group_id: '019d6d2a-749c-7007-9181-86ec9117dd89',
			is_allowed: true,
			is_required: true,
			min_select: 1,
			max_select: 3,
			allow_custom_text: true,
			custom_text_max_length: 250,
		},
	],
	allowed_items: [
		{
			size_client_key: 'xlarge',
			catalog_item_id: '019d71da-78c1-71a9-a693-9f51215df848',
			is_allowed: true,
			min_quantity: 0,
			max_quantity: 1,
			is_required: false,
			price_override: 18.99,
		},
		{
			size_client_key: 'xlarge',
			catalog_item_id: '019d71da-9f6d-70fb-b63b-9d7e436cf7bb',
			is_allowed: true,
			min_quantity: 0,
			max_quantity: 1,
			is_required: false,
			price_override: 12,
		},
		{
			size_client_key: 'xlarge',
			catalog_item_id: '019d71da-cb5f-71a2-878e-1e7c4ba58af7',
			is_allowed: true,
			min_quantity: 0,
			max_quantity: 2,
			is_required: false,
			price_override: 2,
		},
	],
};

// ------------------
// Customer: Products
// ------------------

export interface GetProductsQuery {
	[key: string]: string | number | boolean | undefined;
}


// Category Types

export interface CreateCategoryPayload {
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
}