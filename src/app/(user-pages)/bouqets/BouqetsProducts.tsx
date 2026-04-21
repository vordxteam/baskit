    import ProductGrid from '@/components/ui/ProductGrid'
    import type { ApiProduct } from '@/api/userProducts/types'

    type BouqetsProductsProps = {
        products: ApiProduct[]
        isLoading?: boolean
            onRefresh?: () => void | Promise<void>
    }

        const BouqetsProducts = ({ products, isLoading = false, onRefresh }: BouqetsProductsProps) => (
        <ProductGrid
            products={products}
            isLoading={isLoading}
            title={`Bouqets (${products.length})`}
                onRefresh={onRefresh}
        />
    )

    export default BouqetsProducts