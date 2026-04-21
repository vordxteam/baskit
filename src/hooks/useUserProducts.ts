'use client'

import { useQuery } from '@tanstack/react-query'
import { UserProduct } from '@/api/userProducts'
import type { ApiProduct, UserProductsQueryParams } from '@/api/userProducts/types'

const userProductApi = new UserProduct()

export function useUserProducts(queryParams?: UserProductsQueryParams, enabled = true) {
  const queryKey = ['userProducts', queryParams]

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      return await userProductApi.getUserProducts(queryParams)
    },
    enabled,
  })

  return {
    data: query.data || [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
  }
}
