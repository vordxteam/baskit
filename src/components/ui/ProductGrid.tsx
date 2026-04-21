'use client'

import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/button/Button'
import Pagination from '@/components/ui/Pagination'
import Link from 'next/link'
import type { ApiProduct } from '@/api/userProducts/types'
import ImageWithEmptyState from '@/components/ui/ImageWithEmptyState'
import { addItemToCart, normalizeImageUrl, openCartDrawer } from '@/utils/cart'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Favourite } from '@/api/favourite'
import { useModal } from '@/hooks/useModal'
import ConfirmationModal from '@/components/example/ModalExample/ConfirmationModal'

// ---------- Types ----------
type Product = {
  id: string
  base_image_url: string | null
  name: string
  short_description: string
  price: string
  is_favorite: boolean
}

const ITEMS_PER_PAGE = 12

// ---------- Card ----------
const ProductCard = ({
  product,
  onFavoriteClick,
  isFavoriteLoading,
}: {
  product: Product
  onFavoriteClick: (product: Product) => void
  isFavoriteLoading: boolean
}) => {
  const router = useRouter()

  const handleAddToCart = () => {
    addItemToCart({
      id: product.id,
      name: product.name,
      imageUrl: product.base_image_url,
      priceLabel: product.price,
      quantity: 1,
    })
    openCartDrawer()
  }

  return (
    <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 group">
      <div className="relative flex h-80 w-full items-center justify-center overflow-hidden px-3 py-5 transition-all duration-300 group-hover:bg-[#ebd9c7] sm:h-[280px] lg:h-80">

        <button
          type="button"
          onClick={() => onFavoriteClick(product)}
          disabled={isFavoriteLoading}
          className={`absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110 ${isFavoriteLoading ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
            }`}
          aria-label={product.is_favorite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            size={24}
            strokeWidth={1.8}
            className="transition-colors duration-150"
            fill={product.is_favorite ? 'red' : 'transparent'}
            stroke={product.is_favorite ? '#393A1B' : '#252525'}
          />
        </button>

        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <div className="relative h-full w-full">
            <ImageWithEmptyState
              src={product.base_image_url}
              alt={product.name}
              className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </Link>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-[18px] sm:text-[20px] font-medium text-[#252525]">
          {product.name}
        </h3>
        <p className="text-[#252525CC] text-[13px] sm:text-[14px] leading-5">
          {product.short_description}
        </p>
      </div>

      <p className="text-[18px] sm:text-[20px] font-semibold text-[#252525]">
        {product.price}
      </p>

      <div className="w-full">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => {
            router.push(`/product/${product.id}`)
          }}
        >
          Add to Baskit
        </Button>
      </div>
    </div>
  )
}

// ---------- ProductGrid ----------
interface ProductGridProps {
  products?: ApiProduct[]
  title?: string
  isLoading?: boolean
  onRefresh?: () => void | Promise<void>
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  title,
  isLoading = false,
  onRefresh,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [canUseFavourites, setCanUseFavourites] = useState(false)
  const [favouriteLoadingId, setFavouriteLoadingId] = useState<string | null>(null)
  const [favouriteOverrides, setFavouriteOverrides] = useState<Record<string, boolean>>({})
  const favouriteApi = new Favourite()
  const { isOpen, openModal, closeModal } = useModal()
  const router = useRouter()

  useEffect(() => {
    const syncFavouriteAccess = () => {
      const token = localStorage.getItem('accessToken')
      const role = (localStorage.getItem('role') || '').toUpperCase()
      setCanUseFavourites(Boolean(token) && role === 'CUSTOMER')
    }

    syncFavouriteAccess()

    const handleStorage = () => {
      syncFavouriteAccess()
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const mappedProducts: Product[] = products.map((product) => {
    const imageUrl = product.image_url || product.base_image_url
    const normalized = normalizeImageUrl(imageUrl)
    return {
      id: product.id,
      base_image_url: normalized,
      name: product.name,
      short_description: product.short_description ?? '',
      price: product.price,
      is_favorite: favouriteOverrides[product.id] ?? Boolean(product.is_favorite),
    }
  })

  const handleFavoriteClick = async (product: Product) => {
    if (!canUseFavourites) {
      openModal()
      return
    }

    try {
      setFavouriteLoadingId(product.id)
      await favouriteApi.addToFavourites(product.id)
      setFavouriteOverrides((prev) => ({
        ...prev,
        [product.id]: !product.is_favorite,
      }))
      await onRefresh?.()
    } catch (error) {
      console.error('Failed to toggle product favourite:', error)
    } finally {
      setFavouriteLoadingId((prev) => (prev === product.id ? null : prev))
    }
  }

  const totalPages = Math.ceil(mappedProducts.length / ITEMS_PER_PAGE)

  const paginated = mappedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const displayTitle = title ?? `All Products (${mappedProducts.length})`

  return (
    <section className='w-full'>
      <h1 className="text-[#252525] tobia-normal leading-8 text-[32px] mb-8">
        {displayTitle}
      </h1>

      {/* 🔄 Loading State */}
      {isLoading && (
        <div className="text-center py-20 text-gray-500">
          Loading products...
        </div>
      )}

      {/* ❌ Empty State */}
      {!isLoading && mappedProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No products found.
        </div>
      )}

      {/* ✅ Products */}
      {!isLoading && mappedProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 sm:gap-y-12 lg:gap-y-16">
            {paginated.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavoriteClick={handleFavoriteClick}
                isFavoriteLoading={favouriteLoadingId === product.id}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={() => router.push('/signin')}
        title="Login required"
        message="You need to login to enable this feature."
        confirmLabel="Sign In"
        cancelLabel="Close"
        variant="info"
      />
    </section>
  )
}

export default ProductGrid