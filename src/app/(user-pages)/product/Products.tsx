'use client'

import { UserProduct } from '@/api/userProducts'
import ProductGrid from '@/components/ui/ProductGrid'
import { useEffect } from 'react'

const AllProducts = () => {
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const userProductApi = new UserProduct()
                const res = await userProductApi.getUserProducts()
                console.log(res)
            } catch (error) {
                console.error('Failed to fetch products:', error)
            }
        }

        fetchProducts()
    }, [])

    return <ProductGrid />
}

export default AllProducts