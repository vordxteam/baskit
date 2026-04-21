'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/button/Button'
import { addItemToCart, openCartDrawer } from '@/utils/cart'

interface SizeColors {
  decorative_colors: string[]
  net: string[]
  product_color: string[]
  ribbon: string[]
}

interface ProductSize {
  id: string
  size_code: string
  label: string
  price: string
  compare_at_price?: string
  is_active?: boolean
  fillers?: string[]
  colors?: SizeColors
}

interface AddToCartProps {
  productId?: string
  productName: string
  productImage?: string | null
  productPrice?: string
  sizes?: ProductSize[]
  onPriceChange?: (priceLabel: string) => void
}

const getInitialSizeCode = (sizes: ProductSize[]) => {
  return sizes[0]?.size_code ?? ''
}

const getFirstColor = (colors?: string[]) => {
  return colors?.[0] ?? ''
}

function ColorSwatch({
  color,
  selected,
  onClick,
}: {
  color: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={color}
      className={`w-8 h-8 rounded-full border-2 transition-all ${selected ? 'border-[#252525] scale-110' : 'border-transparent hover:border-[#25252566]'
        }`}
      style={{ backgroundColor: color }}
      aria-label={`Color ${color}`}
    />
  )
}

export default function AddToCart({
  productId,
  productName,
  productImage,
  productPrice,
  sizes = [],
  onPriceChange,
}: AddToCartProps) {
  const [wished, setWished] = useState(false)
  const [qty, setQty] = useState(1)

  const [selectedSizeCode, setSelectedSizeCode] = useState<string>(
    getInitialSizeCode(sizes)
  )
  const [selectedFiller, setSelectedFiller] = useState<string>('')
  const [selectedProductColor, setSelectedProductColor] = useState<string>('')
  const [selectedNetColor, setSelectedNetColor] = useState<string>('')
  const [selectedRibbonColor, setSelectedRibbonColor] = useState<string>('')
  const [selectedDecorativeColor, setSelectedDecorativeColor] = useState<string>('')

  useEffect(() => {
    if (sizes.length === 0) {
      return
    }

    const initialSizeCode = getInitialSizeCode(sizes)
    const initialSize = sizes.find((size) => size.size_code === initialSizeCode)

    setSelectedSizeCode((current) => current || initialSizeCode)
    setSelectedFiller('')
    setSelectedProductColor(getFirstColor(initialSize?.colors?.product_color))
    setSelectedNetColor(getFirstColor(initialSize?.colors?.net))
    setSelectedRibbonColor(getFirstColor(initialSize?.colors?.ribbon))
    setSelectedDecorativeColor(getFirstColor(initialSize?.colors?.decorative_colors))
  }, [sizes])

  const selectedSize = useMemo(
    () => sizes.find((s) => s.size_code === selectedSizeCode),
    [sizes, selectedSizeCode]
  )
  const resolvedSelectedSize = selectedSize ?? sizes[0]

  const fillers = resolvedSelectedSize?.fillers ?? []
  const colors = resolvedSelectedSize?.colors

  const productColors = colors?.product_color ?? []
  const netColors = colors?.net ?? []
  const ribbonColors = colors?.ribbon ?? []
  const decorativeColors = colors?.decorative_colors ?? []

  const displayPrice = resolvedSelectedSize?.price
    ? `PKR ${Number(resolvedSelectedSize.price).toLocaleString()}`
    : productPrice ?? ''

  useEffect(() => {
    if (!onPriceChange || !displayPrice) return
    onPriceChange(displayPrice)
  }, [displayPrice, onPriceChange])

  const handleAddToCart = () => {
    if (!productId || !displayPrice) return

    const customization = {
      productId,
      productSizeId: resolvedSelectedSize?.id || undefined,
      sizeCode: resolvedSelectedSize?.size_code || undefined,
      sizeLabel: resolvedSelectedSize?.label || undefined,
      filler: selectedFiller || undefined,
      productColor: selectedProductColor || undefined,
      netColor: selectedNetColor || undefined,
      ribbonColor: selectedRibbonColor || undefined,
      decorativeColor: selectedDecorativeColor || undefined,
    }

    const customizationValues = [
      customization.sizeCode,
      customization.filler,
      customization.productColor,
      customization.netColor,
      customization.ribbonColor,
      customization.decorativeColor,
    ].filter(Boolean)

    const lineId =
      customizationValues.length > 0
        ? `${productId}__${customizationValues
            .map((value) => String(value).toLowerCase().trim().replace(/\s+/g, '-'))
            .join('__')}`
        : productId

    addItemToCart({
      id: lineId,
      name: productName,
      imageUrl: productImage,
      priceLabel: displayPrice,
      quantity: qty,
      customization,
    })
    openCartDrawer()
  }

  return (
    <div className="flex flex-col gap-20">

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium text-[#252525] tracking-wide uppercase">Baskit size</p>
          <div className="flex items-center gap-2 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  setSelectedSizeCode(size.size_code)
                  setSelectedFiller('')
                  setSelectedProductColor(getFirstColor(size.colors?.product_color))
                  setSelectedNetColor(getFirstColor(size.colors?.net))
                  setSelectedRibbonColor(getFirstColor(size.colors?.ribbon))
                  setSelectedDecorativeColor(getFirstColor(size.colors?.decorative_colors))
                }}
                className={`px-4 py-2 text-[14px] border transition-all ${selectedSizeCode === size.size_code
                    ? 'border-[#252525] text-[#252525] bg-white'
                    : 'border-[#25252533] text-[#25252599] hover:border-[#25252566]'
                  }`}
              >
                {size.size_code}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Decorative Fillers */}
      {fillers.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium text-[#252525] tracking-wide uppercase">Decorative fillers</p>
          <div className="flex items-center gap-2 flex-wrap">
            {fillers.map((filler) => (
              <button
                key={filler}
                onClick={() => setSelectedFiller(filler)}
                className={`px-4 py-2 text-[14px] border transition-all ${selectedFiller === filler
                    ? 'border-[#252525] text-[#252525] bg-white'
                    : 'border-[#25252533] text-[#25252599] hover:border-[#25252566]'
                  }`}
              >
                {filler}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Baskit Color */}
      {productColors.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium text-[#252525] tracking-wide uppercase">Baskit color</p>
          <div className="flex items-center gap-2 flex-wrap">
            {productColors.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                selected={selectedProductColor === color}
                onClick={() => setSelectedProductColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Net Color */}
      {netColors.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium text-[#252525] tracking-wide uppercase">Net color</p>
          <div className="flex items-center gap-2 flex-wrap">
            {netColors.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                selected={selectedNetColor === color}
                onClick={() => setSelectedNetColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ribbon Color */}
      {ribbonColors.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium text-[#252525] tracking-wide uppercase">Ribbon color</p>
          <div className="flex items-center gap-2 flex-wrap">
            {ribbonColors.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                selected={selectedRibbonColor === color}
                onClick={() => setSelectedRibbonColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Decorative Filler Color */}
      {decorativeColors.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium text-[#252525] tracking-wide uppercase">Decorative filler color</p>
          <div className="flex items-center gap-2 flex-wrap">
            {decorativeColors.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                selected={selectedDecorativeColor === color}
                onClick={() => setSelectedDecorativeColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Wishlist + Quantity + Add to Baskit */}
      <div className='space-y-3'>

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
          <Button variant="primary" className="flex-1 h-11 text-[18px] leading-6" onClick={handleAddToCart}>
            Add to Baskit
          </Button>
        </div>

        {/* Buy Now */}
        <Button variant="outline" className="w-full h-12 text-[18px] leading-6">
          Buy now

        </Button>
      </div>
    </div>
  )
}