'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import { Heart } from 'lucide-react'
import { useUserProducts } from '@/hooks/useUserProducts'
import { useModal } from '@/hooks/useModal'
import { Favourite } from '@/api/favourite'
import ImageWithEmptyState from '@/components/ui/ImageWithEmptyState'
import { normalizeImageUrl } from '@/utils/cart'
import ConfirmationModal from '@/components/example/ModalExample/ConfirmationModal'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

type Product = {
    id: string
    image: string
    name: string
    description: string
    price: string
    is_favorite: boolean
}

// const products: Product[] = [
//     {
//         id: 1,
//         image: '/images/baskit1.png',
//         name: 'The Luxe Hamper',
//         description: 'Premium selection of treats and delights',
//         price: 'PKR 3,999',
//     },
//     {
//         id: 2,
//         image: '/images/baskit2.png',
//         name: 'Celebration Basket',
//         description: 'Curated goodies to make birthdays and anniversaries',
//         price: 'PKR 6,999',
//     },
//     {
//         id: 3,
//         image: '/images/baskit3.png',
//         name: 'Ultimate Indulgence Basket',
//         description: 'A vibrant bouquet for friends and loved ones.',
//         price: 'PKR 4,999',
//     },
//     {
//         id: 4,
//         image: '/images/baskit4.png',
//         name: 'Joyful Surprise',
//         description: 'A cheerful mix of gifts designed to spread smiles',
//         price: 'PKR 2,999',
//     },
//     {
//         id: 5,
//         image: '/images/baskit5.png',
//         name: 'Elegant Essentials',
//         description: 'A refined collection of essentials',
//         price: 'PKR 2,999',
//     },
//     {
//         id: 6,
//         image: '/images/baskit6.png',
//         name: 'The Personalized Touch',
//         description: 'Customizable baskets that reflect your style',
//         price: 'PKR 2,999',
//     },
//     {
//         id: 7,
//         image: '/images/baskit1.png',
//         name: 'The Luxe Hamper',
//         description: 'Premium selection of treats and delights',
//         price: 'PKR 3,999',
//     },
//     {
//         id: 8,
//         image: '/images/baskit2.png',
//         name: 'Celebration Basket',
//         description: 'Curated goodies to make birthdays and anniversaries',
//         price: 'PKR 6,999',
//     },
//     {
//         id: 9,
//         image: '/images/baskit3.png',
//         name: 'Ultimate Indulgence Basket',
//         description: 'A vibrant bouquet for friends and loved ones.',
//         price: 'PKR 4,999',
//     },
//     {
//         id: 10,
//         image: '/images/baskit4.png',
//         name: 'Joyful Surprise',
//         description: 'A cheerful mix of gifts designed to spread smiles',
//         price: 'PKR 2,999',
//     },
//     {
//         id: 11,
//         image: '/images/baskit5.png',
//         name: 'Elegant Essentials',
//         description: 'A refined collection of essentials',
//         price: 'PKR 2,999',
//     },
//     {
//         id: 12,
//         image: '/images/baskit6.png',
//         name: 'The Personalized Touch',
//         description: 'Customizable baskets that reflect your style',
//         price: 'PKR 2,999',
//     },
//     {
//         id: 13,
//         image: '/images/baskit5.png',
//         name: 'Elegant Essentials',
//         description: 'A refined collection of essentials',
//         price: 'PKR 2,999',
//     },
//     {
//         id: 14,
//         image: '/images/baskit6.png',
//         name: 'The Personalized Touch',
//         description: 'Customizable baskets that reflect your style',
//         price: 'PKR 2,999',
//     },
//      {
//         id: 15,
//         image: '/images/baskit2.png',
//         name: 'Celebration Basket',
//         description: 'Curated goodies to make birthdays and anniversaries',
//         price: 'PKR 6,999',
//     },
//     {
//         id: 16,
//         image: '/images/baskit3.png',
//         name: 'Ultimate Indulgence Basket',
//         description: 'A vibrant bouquet for friends and loved ones.',
//         price: 'PKR 4,999',
//     },
//     {
//         id: 17,
//         image: '/images/baskit4.png',
//         name: 'Joyful Surprise',
//         description: 'A cheerful mix of gifts designed to spread smiles',
//         price: 'PKR 2,999',
//     },
//     {
//         id: 18,
//         image: '/images/baskit5.png',
//         name: 'Elegant Essentials',
//         description: 'A refined collection of essentials',
//         price: 'PKR 2,999',
//     },
// ]

const ITEMS_PER_SLIDE = 6

// ---------- Product Card ----------
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

    return (
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 group">
            {/* Image Container */}
            <div className="relative flex h-80 w-full items-center justify-center overflow-hidden bg-[#f5efe8] px-3 py-5 transition-all duration-300 group-hover:bg-[#ebd9c7] sm:h-[280px] lg:h-80">
                {/* Wishlist heart */}
                <button
                    type="button"
                    onClick={() => onFavoriteClick(product)}
                    disabled={isFavoriteLoading}
                    className={`absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110 ${isFavoriteLoading ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
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
                            src={product.image}
                            alt={product.name}
                            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                    </div>
                </Link>
            </div>

            {/* Info */}
            <div className="space-y-1.5">
                <h3 className="text-[18px] sm:text-[20px] font-medium text-[#252525]">
                    {product.name}
                </h3>
                <p className="text-[#252525CC] text-[13px] sm:text-[14px] font-normal leading-5">
                    {product.description}
                </p>
            </div>

            {/* Price */}
            <p className="text-[18px] sm:text-[20px] leading-6 font-semibold text-[#252525]">
                {product.price}
            </p>

            {/* Button */}
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

const BaskitCollection = () => {
    const router = useRouter()
    const { isOpen, openModal, closeModal } = useModal()

    // Fetch BASKET products from API (includes baskets and hampers)
    const { data: apiProducts, isLoading } = useUserProducts({ product_type: 'BASKET' })

    // Favorite functionality state
    const [canUseFavourites, setCanUseFavourites] = useState(false)
    const [favouriteLoadingId, setFavouriteLoadingId] = useState<string | null>(null)
    const [favouriteOverrides, setFavouriteOverrides] = useState<Record<string, boolean>>({})
    const favouriteApi = new Favourite()

    // Check if user can use favourites (logged in as CUSTOMER)
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

    // Map API products to UI Product type
    const products: Product[] = useMemo(() => {
        return apiProducts.map((apiProduct: any) => ({
            id: apiProduct.id,
            image: apiProduct.base_image_url || apiProduct.image_url || '/images/baskit1.png',
            name: apiProduct.name,
            description: apiProduct.short_description || apiProduct.description || '',
            price: apiProduct.price,
            is_favorite: favouriteOverrides[apiProduct.id] ?? Boolean(apiProduct.is_favorite),
        }))
    }, [apiProducts, favouriteOverrides])

    const showSlider = products.length > ITEMS_PER_SLIDE

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
        } catch (error) {
            console.error('Failed to toggle product favourite:', error)
        } finally {
            setFavouriteLoadingId((prev) => (prev === product.id ? null : prev))
        }
    }

    return (
        <>
            <style jsx global>{`
        .bouquet-swiper .swiper-pagination {
          position: relative;
          margin-top: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }

        .bouquet-swiper .swiper-pagination-bullet {
          width: 28px;
          height: 5px;
          border-radius: 999px;
          background: #25252530;
          opacity: 1;
          transition: background 0.3s, width 0.3s;
          cursor: pointer;
          margin: 0 !important;
        }

        .bouquet-swiper .swiper-pagination-bullet-active {
          background: #252525;
          width: 48px;
        }
      `}</style>

            <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="max-w-[640px] mx-auto space-y-4 sm:space-y-5 text-center mb-10 sm:mb-14 lg:mb-16">
                    <h1 className="text-[#252525] text-[32px] sm:text-[40px] lg:text-[48px] tobia-normal leading-tight">
                        Shop from our curated gift Baskit collection
                    </h1>
                    <p className="text-[#252525CC] text-[16px] sm:text-[18px] lg:text-[20px] font-normal leading-7">
                        Discover premium gift hampers thoughtfully arranged for every occasion, ready to delight and impress your loved ones.
                    </p>
                </div>

                {/* 🔄 Loading State */}
                {isLoading && (
                    <div className="text-center py-20 text-gray-500">
                        Loading products...
                    </div>
                )}

                {/* ❌ Empty State */}
                {!isLoading && products.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No products found.
                    </div>
                )}

                {/* ✅ Products Grid or Slider */}
                {!isLoading && products.length > 0 && (
                    <>
                        {showSlider ? (
                            <Swiper
                                modules={[Pagination, Navigation, Autoplay]}
                                slidesPerView={1}
                                pagination={{ clickable: true }}
                                autoplay={{
                                    delay: 7000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed={900}
                                loop
                                className="bouquet-swiper"
                            >
                                {/* Chunk products into groups of 6 */}
                                {Array.from(
                                    { length: Math.ceil(products.length / ITEMS_PER_SLIDE) },
                                    (_, slideIndex) => (
                                        <SwiperSlide key={slideIndex}>
                                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 sm:gap-y-12 lg:gap-y-16">
                                                {products
                                                    .slice(
                                                        slideIndex * ITEMS_PER_SLIDE,
                                                        slideIndex * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE
                                                    )
                                                    .map((product) => (
                                                        <ProductCard
                                                            key={product.id}
                                                            product={product}
                                                            onFavoriteClick={handleFavoriteClick}
                                                            isFavoriteLoading={favouriteLoadingId === product.id}
                                                        />
                                                    ))}
                                            </div>
                                        </SwiperSlide>
                                    )
                                )}
                            </Swiper>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 sm:gap-y-12 lg:gap-y-16">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onFavoriteClick={handleFavoriteClick}
                                        isFavoriteLoading={favouriteLoadingId === product.id}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Login Required Modal */}
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
        </>
    )
}

export default BaskitCollection