'use client'

import React, { useState, useCallback, useMemo } from 'react'
import ProductGrid from '@/components/ui/ProductGrid'
import type {
  UserProductsQueryParams,
} from '@/api/userProducts/types'
import { useUserProducts } from '@/hooks/useUserProducts'
import { useProductFilters } from '@/hooks/useProductFilters'
import Filters from '@/app/(user-pages)/product/Filters'

interface ProductListingProps {
  category?: 'BOUQUET' | 'BASKET' | 'GIFT_HAMPER'
  title?: string
  initialFilters?: Partial<UserProductsQueryParams>
}

const areQueryParamsEqual = (
  a: UserProductsQueryParams,
  b: UserProductsQueryParams
) => {
  return (
    a.product_type === b.product_type &&
    a.category === b.category &&
    a.topselling === b.topselling &&
    a.search === b.search &&
    a.min_price === b.min_price &&
    a.max_price === b.max_price &&
    a.newest === b.newest &&
    a.price_high_to_low === b.price_high_to_low &&
    a.price_low_to_high === b.price_low_to_high &&
    a.style === b.style
  )
}

export default function ProductListing({
  category,
  title,
  initialFilters = {},
}: ProductListingProps) {
  const productType =
    category === 'BASKET'
      ? 'BASKET'
      : category === 'BOUQUET'
      ? 'BOUQUET'
      : undefined

  // Fetch filters
  const {
    data: filterData,
    isLoading: filtersLoading,
  } = useProductFilters(
    productType?.toLowerCase() as 'bouquet' | 'basket' | undefined,
    true
  )

  const baseQueryParams: UserProductsQueryParams = {
    ...(productType ? { product_type: productType } : {}),
    ...initialFilters,
  }

  const [queryParams, setQueryParams] = useState<UserProductsQueryParams>(
    baseQueryParams
  )

  // Fetch products
  const {
    data: products,
    isLoading: productsLoading,
    isFetching: productsFetching,
    isError: productsError,
    refetch: refetchProducts,
  } = useUserProducts(queryParams)

  // Determine if we should show the loading skeleton
  // Show it only on first load (isLoading), not on background refresh (isFetching)
  const shouldShowLoadingSkeleton = productsLoading

  const handleFiltersChange = useCallback((filters: UserProductsQueryParams) => {
    const nextQueryParams: UserProductsQueryParams = {
      ...baseQueryParams,
      ...filters,
    }

    setQueryParams((prev) =>
      areQueryParamsEqual(prev, nextQueryParams) ? prev : nextQueryParams
    )
  }, [baseQueryParams])

  // Determine the title - use passed title or generate from products count
  const displayTitle = useMemo(() => {
    if (title) return title
    if (!category) return `Top Selling (${products.length})`
    const categoryName = category === 'BASKET' ? 'Gift Hampers' : 'Bouquets'
    return `${categoryName} (${products.length})`
  }, [title, category, products.length])

  return (
    <div>
      <div className="flex sm:items-start sm:flex-row flex-col gap-8 px-12 py-20 max-w-[1440px] m-auto">
        <div>
          <Filters
            categories={filterData.categories}
            productTypes={filterData.product_types}
            sizes={filterData.sizes}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            {/* <h1 className="text-2xl font-semibold text-gray-800">{displayTitle}</h1> */}
            {productsFetching && !shouldShowLoadingSkeleton && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Updating...
              </div>
            )}
          </div>

          {productsError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <span className="text-red-800">Failed to load products. Please try again.</span>
              <button
                onClick={() => refetchProducts()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          <ProductGrid
            products={products}
            isLoading={shouldShowLoadingSkeleton}
            title={displayTitle}
            onRefresh={() => {
              void refetchProducts()
            }}
          />
        </div>
      </div>
    </div>
  )
}
