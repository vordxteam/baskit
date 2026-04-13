'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/button/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

type Product = {
    id: number
    image: string
    name: string
    description: string
    price: string
}

const products: Product[] = [
    {
        id: 1,
        image: '/images/baskit1.png',
        name: 'The Luxe Hamper',
        description: 'Premium selection of treats and delights',
        price: 'PKR 3,999',
    },
    {
        id: 2,
        image: '/images/baskit2.png',
        name: 'Celebration Basket',
        description: 'Curated goodies to make birthdays and anniversaries',
        price: 'PKR 6,999',
    },
    {
        id: 3,
        image: '/images/baskit3.png',
        name: 'Ultimate Indulgence Basket',
        description: 'A vibrant bouquet for friends and loved ones.',
        price: 'PKR 4,999',
    },
    {
        id: 4,
        image: '/images/baskit4.png',
        name: 'Joyful Surprise',
        description: 'A cheerful mix of gifts designed to spread smiles',
        price: 'PKR 2,999',
    },
    {
        id: 5,
        image: '/images/baskit5.png',
        name: 'Elegant Essentials',
        description: 'A refined collection of essentials',
        price: 'PKR 2,999',
    },
    {
        id: 6,
        image: '/images/baskit6.png',
        name: 'The Personalized Touch',
        description: 'Customizable baskets that reflect your style',
        price: 'PKR 2,999',
    },
    {
        id: 7,
        image: '/images/baskit1.png',
        name: 'The Luxe Hamper',
        description: 'Premium selection of treats and delights',
        price: 'PKR 3,999',
    },
    {
        id: 8,
        image: '/images/baskit2.png',
        name: 'Celebration Basket',
        description: 'Curated goodies to make birthdays and anniversaries',
        price: 'PKR 6,999',
    },
    {
        id: 9,
        image: '/images/baskit3.png',
        name: 'Ultimate Indulgence Basket',
        description: 'A vibrant bouquet for friends and loved ones.',
        price: 'PKR 4,999',
    },
    {
        id: 10,
        image: '/images/baskit4.png',
        name: 'Joyful Surprise',
        description: 'A cheerful mix of gifts designed to spread smiles',
        price: 'PKR 2,999',
    },
    {
        id: 11,
        image: '/images/baskit5.png',
        name: 'Elegant Essentials',
        description: 'A refined collection of essentials',
        price: 'PKR 2,999',
    },
    {
        id: 12,
        image: '/images/baskit6.png',
        name: 'The Personalized Touch',
        description: 'Customizable baskets that reflect your style',
        price: 'PKR 2,999',
    },
    {
        id: 13,
        image: '/images/baskit5.png',
        name: 'Elegant Essentials',
        description: 'A refined collection of essentials',
        price: 'PKR 2,999',
    },
    {
        id: 14,
        image: '/images/baskit6.png',
        name: 'The Personalized Touch',
        description: 'Customizable baskets that reflect your style',
        price: 'PKR 2,999',
    },
     {
        id: 15,
        image: '/images/baskit2.png',
        name: 'Celebration Basket',
        description: 'Curated goodies to make birthdays and anniversaries',
        price: 'PKR 6,999',
    },
    {
        id: 16,
        image: '/images/baskit3.png',
        name: 'Ultimate Indulgence Basket',
        description: 'A vibrant bouquet for friends and loved ones.',
        price: 'PKR 4,999',
    },
    {
        id: 17,
        image: '/images/baskit4.png',
        name: 'Joyful Surprise',
        description: 'A cheerful mix of gifts designed to spread smiles',
        price: 'PKR 2,999',
    },
    {
        id: 18,
        image: '/images/baskit5.png',
        name: 'Elegant Essentials',
        description: 'A refined collection of essentials',
        price: 'PKR 2,999',
    },
]

const ITEMS_PER_SLIDE = 6

const ProductCard = ({ product }: { product: Product }) => {
    const [wished, setWished] = useState(false)

    return (
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 group">
            {/* Image Container */}
            <div className="relative flex h-80 w-full items-center justify-center overflow-hidden bg-[#f5efe8] px-3 py-5 transition-all duration-300 group-hover:bg-[#ebd9c7] sm:h-[280px] lg:h-80">
                {/* Wishlist heart */}
                <button
                    onClick={() => setWished((w) => !w)}
                    aria-label="Add to wishlist"
                    className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center transition-transform duration-200 hover:scale-110"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill={wished ? '#e05c5c' : 'none'}
                        stroke={wished ? '#e05c5c' : '#252525'}
                        strokeWidth="1.5"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                <Image
                    src={product.image}
                    width={413}
                    height={420}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                />
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
                <Button variant="primary" className="w-full">
                    Add to Baskit
                </Button>
            </div>
        </div>
    )
}

const BaskitCollection = () => {
    const showSlider = products.length > ITEMS_PER_SLIDE

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

                {/* Grid or Slider */}
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
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                    </div>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 sm:gap-y-12 lg:gap-y-16">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}

export default BaskitCollection