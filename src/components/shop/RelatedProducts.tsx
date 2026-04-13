// src/components/shop/RelatedProducts.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/button/Button'

type Product = {
  id: number
  image: string
  name: string
  description: string
  price: string
}

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section className="mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] sm:text-[28px] tobia-normal text-[#252525]">
          More related products
        </h2>
        <Link
          href="/products"
          className="text-[13px] sm:text-[18px] border border-[#252525] px-5 py-3 text-[#252525] hover:bg-[#252525] hover:text-white transition-colors font-normal"
        >
          View more
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
        {products.map((product) => (
          <RelatedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function RelatedCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false)

  return (
    <div className="flex flex-col items-center text-center space-y-4 group">
      {/* Image box */}
      <div className="relative w-full h-72 sm:h-64 lg:h-72 overflow-hidden transition-colors duration-300 group-hover:bg-[#ebd9c7]">
        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Wishlist"
        >
          <svg
            width="24"
            height="24"
            fill={wished ? '#e05c5c' : 'none'}
            stroke={wished ? '#e05c5c' : '#252525'}
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Clickable image → detail page */}
        <Link href={`/product/${product.id}`} className="block w-full h-full px-3 py-5">
          <Image
            src={product.image}
            fill
            alt={product.name}
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
      </div>

      <h3 className="text-[18px] font-medium text-[#252525]">{product.name}</h3>
      <p className="text-[13px] sm:text-[14px] text-[#252525CC] font-light leading-5">
        {product.description}
      </p>
      <p className="text-[18px] font-semibold text-[#252525]">{product.price}</p>
      <Button variant="primary" className="w-full">
        Add to Baskit
      </Button>
    </div>
  )
}