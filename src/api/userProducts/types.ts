export type ProductCategory =
	| 'basket'
	| 'bouquet'
	| 'bouquet'
	| 'BASKET'
	| 'BOUQUET'
	| 'BOUQUET'

export type ProductSortKey = 'newest' | 'price_high_to_low' | 'price_low_to_high'

export type UserProductsQueryParams = {
	category?: ProductCategory | string
	product_type?: 'basket' | 'bouquet' | string
	topselling?: boolean
	search?: string
	min_price?: number
	max_price?: number
	newest?: boolean
	price_high_to_low?: boolean
	price_low_to_high?: boolean
	style?: string
	rating?: number
}

export type ApiProductMedia = {
	id: string
	media_url: string
	is_primary?: boolean
	media_type?: string
	alt_text?: string | null
}

export type ApiProduct = {
	id: string
	base_image_url?: string | null
	image_url?: string | null
	name: string
	price: string
    description?: string
	short_description?: string
	media?: ApiProductMedia[]
	is_favorite?: boolean
}

export type UserProductsResponse = {
	data: ApiProduct[]
}

export type ApiProductFilterStyle = {
	id: string
	name: string
}

export type ApiProductFilterCategory = {
	id: string
	name: string
	styles: ApiProductFilterStyle[]
}

export type ApiFilterCategoryOption = {
	id: string
	name: string
}

export type ApiFilterSizeOption = {
	code: string
	label: string
}

export type ProductFiltersMetaData = {
	product_types?: ApiProductFilterCategory[]
	categories?: ApiFilterCategoryOption[]
	sizes?: ApiFilterSizeOption[]
}

export type ProductFiltersData = {
	product_types: ApiProductFilterCategory[]
	categories: ApiFilterCategoryOption[]
	sizes: ApiFilterSizeOption[]
}

export type ProductFiltersResponse = {
	success?: boolean
	data?: ApiProductFilterCategory[] | ProductFiltersMetaData
}
