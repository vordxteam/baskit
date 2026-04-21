import ProductGrid from '@/components/ui/ProductGrid'
import type { ApiProduct } from '@/api/userProducts/types'

type AllProductsProps = {
    products: ApiProduct[]
    onRefresh?: () => void | Promise<void>
}

const AllProducts = ({ products, onRefresh }: AllProductsProps) => {
    return <ProductGrid products={products} onRefresh={onRefresh} />
}

export default AllProducts