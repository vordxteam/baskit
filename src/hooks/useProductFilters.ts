'use client'

import { useQuery } from '@tanstack/react-query'
import { UserProduct } from '@/api/userProducts'
import type { ProductFiltersData } from '@/api/userProducts/types'

const userProductApi = new UserProduct()

export function useProductFilters(productType?: 'bouquet' | 'basket', enabled = true) {
  const queryKey = ['productFilters', productType ?? 'all']

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      return await userProductApi.getProductFilters(productType)
    },
    enabled,
  })

  return {
    data: query.data || ({ product_types: [], categories: [], sizes: [] } as ProductFiltersData),
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
  }
}
