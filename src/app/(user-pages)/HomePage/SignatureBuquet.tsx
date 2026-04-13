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
        image: '/images/product1.png',
        name: 'Sunshine Mix',
        description: 'Bright, cheerful blooms that bring warmth',
        price: 'PKR 3,999',
    },
    {
        id: 2,
        image: '/images/product2.png',
        name: 'Tropical Vibes',
        description: 'Exotic blooms full of color and energy',
        price: 'PKR 6,999',
    },
    {
        id: 3,
        image: '/images/product3.png',
        name: 'Pastel Dreams',
        description: 'Soft pastel flowers creating an elegant look',
        price: 'PKR 4,999',
    },
    {
        id: 4,
        image: '/images/product4.png',
        name: 'Roses & Grace',
        description: 'A vibrant bouquet for friends and loved ones.',
        price: 'PKR 2,999',
    },
    {
        id: 5,
        image: '/images/product5.png',
        name: 'Joyful Blooms',
        description: 'A playful mix of fresh seasonal flowers',
        price: 'PKR 2,999',
    },
    {
        id: 6,
        image: '/images/product6.png',
        name: 'Pink Roses',
        description: 'Classic pink roses arranged to convey love',
        price: 'PKR 2,999',
    },
    {
        id: 7,
        image: '/images/product6.png',
        name: 'Pink Roses',
        description: 'Classic pink roses arranged to convey love',
        price: 'PKR 2,999',


    },
    {
        id: 8,
        image: '/images/product5.png',
        name: 'Joyful Blooms',
        description: 'A playful mix of fresh seasonal flowers',
        price: 'PKR 2,999',


    },
    {
        id: 9,
        image: '/images/product3.png',
        name: 'Pastel Dreams',
        description: 'Soft pastel flowers creating an elegant look',
        price: 'PKR 4,999',
    },
    {
        id: 10,
        image: '/images/product4.png',
        name: 'Roses & Grace',
        description: 'A vibrant bouquet for friends and loved ones.',
        price: 'PKR 2,999',
    },
    {
        id: 11,
        image: '/images/product2.png',
        name: 'Tropical Vibes',
        description: 'Exotic blooms full of color and energy',
        price: 'PKR 6,999',
    },
    {
        id: 12,
        image: '/images/product1.png',
        name: 'Sunshine Mix',
        description: 'Bright, cheerful blooms that bring warmth',
        price: 'PKR 3,999',
    },
     {
        id: 13,
        image: '/images/product6.png',
        name: 'Pink Roses',
        description: 'Classic pink roses arranged to convey love',
        price: 'PKR 2,999',


    },
    {
        id: 14,
        image: '/images/product5.png',
        name: 'Joyful Blooms',
        description: 'A playful mix of fresh seasonal flowers',
        price: 'PKR 2,999',


    },
    {
        id: 15,
        image: '/images/product3.png',
        name: 'Pastel Dreams',
        description: 'Soft pastel flowers creating an elegant look',
        price: 'PKR 4,999',
    },
    {
        id: 16,
        image: '/images/product4.png',
        name: 'Roses & Grace',
        description: 'A vibrant bouquet for friends and loved ones.',
        price: 'PKR 2,999',
    },
]

const ITEMS_PER_SLIDE = 6

const ProductCard = ({ product }: { product: Product }) => {
    const [wished, setWished] = useState(false)

    return (
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 group">
            {/* Image Container */}
            <div className="relative flex h-80 w-full items-center justify-center overflow-hidden px-3 py-5 transition-all duration-300 group-hover:bg-[#ebd9c7] sm:h-[280px] lg:h-80">
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

const SignatureBouquet = () => {
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
                        Explore our exclusive signature bouquet collection
                    </h1>
                    <p className="text-[#252525CC] text-[16px] sm:text-[18px] lg:text-[20px] font-normal leading-7">
                        Discover a blooming collection of fresh, handpicked bouquets
                        designed to express every emotion beautifully.
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

export default SignatureBouquet