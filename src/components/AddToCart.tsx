// src/components/shop/AddToCart.tsx
'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/button/Button'

interface AddToCartProps {
  productName: string
}

export default function AddToCart({ productName }: AddToCartProps) {
  const [wished, setWished] = useState(false)
  const [qty, setQty] = useState(1)

  return (
    <div className="flex flex-col gap-3">
      {/* Wishlist + Quantity + Add to Baskit */}
      <div className="flex items-center gap-3">

        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          className="shrink-0 w-16 h-12 border border-[#25252533] flex items-center justify-center hover:border-[#252525] transition-colors"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
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

        {/* Quantity */}
        <div className="flex items-center border border-[#25252533] h-12">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-full flex items-center justify-center text-[#25252599] hover:bg-[#f5f5f5] transition-colors text-xl"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-[20px] leading-6 tobia-normal text-[#252525]">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-full flex items-center justify-center text-[#25252599] hover:bg-[#f5f5f5] transition-colors text-xl"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to Baskit */}
        <Button variant="primary" className="flex-1 h-11 text-[18px] leading-6">
          Add to Baskit
        </Button>
      </div>

      {/* Buy Now */}
      <Button variant="outline" className="w-full h-12 text-[18px] leading-6">
        Buy now
      </Button>
    </div>
  )
}