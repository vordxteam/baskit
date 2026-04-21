'use client'

import AllProducts from './Products'
import Filters from './Filters'
import { UserProduct } from '@/api/userProducts'
import { useCallback, useEffect, useState } from 'react'
import type {
  ApiProduct,
  ProductFiltersData,
  UserProductsQueryParams,
} from '@/api/userProducts/types'

const ProductPage = () => {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [filterData, setFilterData] = useState<ProductFiltersData>({
    product_types: [],
    categories: [],
    sizes: [],
  })
  const [queryParams, setQueryParams] = useState<UserProductsQueryParams>({})

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const userProductApi = new UserProduct()
        const res = await userProductApi.getProductFilters()
        setFilterData(res)
      } catch (error) {
        console.error('Failed to fetch product filters:', error)
      }
    }

    fetchFilters()
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const userProductApi = new UserProduct()
      const res = await userProductApi.getUserProducts(queryParams)
      setProducts(Array.isArray(res) ? res : [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }, [queryParams])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div>
      <div className='flex sm:items-start sm:flex-row flex-col gap-8 px-12 py-20 max-w-[1440px] m-auto'>
        <div>
          <Filters
            categories={filterData.categories}
            productTypes={filterData.product_types}
            sizes={filterData.sizes}
            onFiltersChange={setQueryParams}
          />
        </div>
        <div className='w-full'>
          <AllProducts products={products} onRefresh={fetchProducts} />
        </div>
      </div>
    </div>
  )
}

export default ProductPage