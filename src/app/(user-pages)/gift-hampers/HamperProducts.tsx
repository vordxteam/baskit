    import ProductGrid from '@/components/ui/ProductGrid'
    import type { ApiProduct } from '@/api/userProducts/types'

    type HamperProductsProps = {
        products: ApiProduct[]
        isLoading?: boolean
            onRefresh?: () => void | Promise<void>
    }

        const HamperProducts = ({ products, isLoading = false, onRefresh }: HamperProductsProps) => (
        <ProductGrid
            products={products}
            isLoading={isLoading}
            title={`Gift Hampers (${products.length})`}
                onRefresh={onRefresh}
        />
    )

    export default HamperProducts