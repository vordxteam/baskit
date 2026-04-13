'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/button/Button'
import Pagination from '@/components/ui/Pagination'
import { products } from '../../../data/products'
import type { Category } from '../../../data/products'
import Link from 'next/link'

// ---------- Types ----------
type Product = {
  id: number
  image: string
  name: string
  description: string
  price: string
  category: Category
}

const ITEMS_PER_PAGE = 12

// ---------- Card ----------
const ProductCard = ({ product }: { product: Product }) => {
  const [wished, setWished] = useState(false)

  return (
    <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 group">
      <div className="relative flex h-80 w-full items-center justify-center overflow-hidden px-3 py-5 transition-all duration-300 group-hover:bg-[#ebd9c7] sm:h-[280px] lg:h-80">
        <button
          onClick={() => setWished((w) => !w)}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="22" height="22" fill={wished ? '#e05c5c' : 'none'} stroke={wished ? '#e05c5c' : '#252525'} strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {/* <Image
          src={product.image}
          width={413}
          height={420}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        /> */}
        <Link
  href={`/product/${product.id}`}
  className="block h-full w-full"
  aria-label={`View ${product.name}`}
>
  <Image
    src={product.image}
    width={413}
    height={420}
    alt={product.name}
    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
  />
</Link>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-[18px] sm:text-[20px] font-medium text-[#252525]">{product.name}</h3>
        <p className="text-[#252525CC] text-[13px] sm:text-[14px] leading-5">{product.description}</p>
      </div>

      <p className="text-[18px] sm:text-[20px] font-semibold text-[#252525]">{product.price}</p>

      <div className="w-full">
        <Button variant="primary" className="w-full">Add to Baskit</Button>
      </div>
    </div>
  )
}

// ---------- ProductGrid (the reusable part) ----------
interface ProductGridProps {
  /** Pass a category to filter. Omit (or pass undefined) to show ALL products. */
  category?: Category
  title?: string
}

const ProductGrid: React.FC<ProductGridProps> = ({ category, title }) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Filter once — if no category passed, show everything
  const filtered = category
    ? products.filter((p) => p.category === category)
    : products

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  // Slice for current page
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of section smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // const displayTitle = title ?? (category
  //   ? `${category.charAt(0).toUpperCase() + category.slice(1)}s (${filtered.length})`
  //   : `All Products (${filtered.length})`)
  const displayTitle = title ?? `All Products (${filtered.length})`

  return (
    <section>
      <h1 className="text-[#252525] tobia-normal leading-8 text-[32px] mb-8">
        {displayTitle}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 sm:gap-y-12 lg:gap-y-16">
        {paginated.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  )
}

export default ProductGrid  