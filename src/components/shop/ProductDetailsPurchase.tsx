'use client'

import { useState } from 'react'
import AddToCart from '@/components/AddToCart'

type ApiItem = {
  id: string
  name: string
  quantity: number
}

type ProductSize = {
  id: string
  size_code: string
  label: string
  price: string
  compare_at_price?: string
  is_active?: boolean
  fillers?: string[]
  colors?: {
    decorative_colors: string[]
    net: string[]
    product_color: string[]
    ribbon: string[]
  }
}

type ProductDetailsPurchaseProps = {
  productId: string
  detailName: string
  detailImage: string | null
  detailPrice: string
  detailDescription: string
  sizes: ProductSize[]
  apiItems: ApiItem[]
  localIncludes: string[]
}
function SizeAndCustomization({
  sizes,
  onSizeChange,
}: {
  sizes: ProductSize[]
  onSizeChange?: (size: ProductSize) => void
}) {
  const activeSizes = sizes.filter((s) => s.is_active !== false)
  const [selectedSizeId, setSelectedSizeId] = useState<string>(activeSizes[0]?.id ?? '')
  const [selectedFiller, setSelectedFiller] = useState<string>('')
  const [selectedBasketColor, setSelectedBasketColor] = useState<string>('')
  const [selectedNetColor, setSelectedNetColor] = useState<string>('')
  const [selectedRibbonColor, setSelectedRibbonColor] = useState<string>('')
  const [selectedDecorColor, setSelectedDecorColor] = useState<string>('')

  const selectedSize = activeSizes.find((s) => s.id === selectedSizeId)

  const fillers = selectedSize?.fillers ?? []
  const productColors = selectedSize?.colors?.product_color ?? []
  const netColors = selectedSize?.colors?.net ?? []
  const ribbonColors = selectedSize?.colors?.ribbon ?? []
  const decorColors = selectedSize?.colors?.decorative_colors ?? []

  const handleSizeSelect = (size: ProductSize) => {
    setSelectedSizeId(size.id)
    setSelectedFiller('')
    setSelectedBasketColor('')
    setSelectedNetColor('')
    setSelectedRibbonColor('')
    setSelectedDecorColor('')
    onSizeChange?.(size)
  }

  const labelClass = 'text-[18px] font-normal leading-6 text-[#252525]'

  const ColorCircle = ({
    color,
    selected,
    onClick,
  }: {
    color: string
    selected: boolean
    onClick: () => void
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="relative w-8  h-8 rounded-full border transition-all duration-150 shrink-0 focus:outline-none"
      style={{
        backgroundColor: color,
        borderColor: selected ? '#252525' : color === '#ffffff' || color === 'white' || color === '#FFFFFF' ? '#25252533' : color,
        boxShadow: selected ? '0 0 0 2px #FAFAF5, 0 0 0 3.5px #252525' : 'none',
      }}
      aria-label={`Color ${color}`}
    />
  )

  return (
    <div className="sm:space-y-20 sm:my-20  space-y-10 my-10">

      {/* Baskit size */}
      {activeSizes.length > 0 && (
        <div className="space-y-3">
          <p className={labelClass}>Baskit size</p>
          <div className="flex items-center gap-2 flex-wrap">
            {activeSizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => handleSizeSelect(size)}
                className={`min-w-[48px] h-[48px] px-4 border text-[20x] leading-6 font-normal leading-5 transition-all duration-150 focus:outline-none
                  ${selectedSizeId === size.id
                    ? 'border-[#252525] text-[#252525] bg-transparent'
                    : 'border-[#25252533] text-[#252525] bg-transparent hover:border-[#25252566]'
                  }`}
              >
                {size.size_code}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Decorative fillers */}
      {fillers.length > 0 && (
        <div className="space-y-3">
          <p className={labelClass}>Decorative fillers</p>
          <div className="flex items-center gap-2 flex-wrap">
            {fillers.map((filler) => (
              <button
                key={filler}
                type="button"
                onClick={() => setSelectedFiller((prev) => (prev === filler ? '' : filler))}
                className={`p-3 border text-[20px] tobia-normal leading-5 transition-all duration-150 focus:outline-none
                  ${selectedFiller === filler
                    ? 'border-[#D3556533] bg-[#D3556514] text-[#252525]'
                    : 'border-[#25252533] text-[#252525] bg-transparent hover:border-[#25252566]'
                  }`}
              >
                {filler}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Baskit color */}
      {productColors.length > 0 && (
        <div className="space-y-3">
          <p className={labelClass}>Baskit color</p>
          <div className="flex items-center gap-3 flex-wrap">
            {productColors.map((color) => (
              <ColorCircle
                key={color}
                color={color}
                selected={selectedBasketColor === color}
                onClick={() => setSelectedBasketColor((prev) => (prev === color ? '' : color))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Net color */}
      {netColors.length > 0 && (
        <div className="space-y-3">
          <p className={labelClass}>Net color</p>
          <div className="flex items-center gap-3 flex-wrap">
            {netColors.map((color) => (
              <ColorCircle
                key={color}
                color={color}
                selected={selectedNetColor === color}
                onClick={() => setSelectedNetColor((prev) => (prev === color ? '' : color))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ribbon color */}
      {ribbonColors.length > 0 && (
        <div className="space-y-3">
          <p className={labelClass}>Ribbon color</p>
          <div className="flex items-center gap-3 flex-wrap">
            {ribbonColors.map((color) => (
              <ColorCircle
                key={color}
                color={color}
                selected={selectedRibbonColor === color}
                onClick={() => setSelectedRibbonColor((prev) => (prev === color ? '' : color))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Decorative filler color */}
      {decorColors.length > 0 && (
        <div className="space-y-3">
          <p className={labelClass}>Decorative filler color</p>
          <div className="flex items-center gap-3 flex-wrap">
            {decorColors.map((color) => (
              <ColorCircle
                key={color}
                color={color}
                selected={selectedDecorColor === color}
                onClick={() => setSelectedDecorColor((prev) => (prev === color ? '' : color))}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
export default function ProductDetailsPurchase({
  productId,
  detailName,
  detailImage,
  detailPrice,
  detailDescription,
  sizes,
  apiItems,
  localIncludes,
}: ProductDetailsPurchaseProps) {
  const [displayPrice, setDisplayPrice] = useState(detailPrice)

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-6">
      <div className="space-y-5">
        <h1 className="text-[28px] sm:text-[36px] lg:text-[60px] font-medium text-[#252525] sm:leading-10 leading-9 lg:leading-[68px] tobia-normal">
          {detailName}
        </h1>
        <p className="text-[18px] sm:text-[24px] tobia-normal leading-8 text-[#252525]">
          {displayPrice}
        </p>
      </div>

      <p className="text-[20px] leading-7 text-[#252525CC] max-w-[450px] sm:max-w-[580px] font-light">
        {detailDescription}
      </p>

      {apiItems.length > 0 ? (
        <div className="space-y-4">
          <p className="text-[20px] leading-7 text-[#252525CC] font-light">This {detailName} includes:</p>
          <ul className="space-y-1 pl-8">
            {apiItems.map((item) => (
              <li key={item.id} className="text-[20px] leading-7 text-[#252525CC] font-light list-disc">
                {item.name}
                {item.quantity > 1 && (
                  <span className="text-[16px] text-[#25252566] ml-1">(x{item.quantity})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : localIncludes.length > 0 ? (
        <div className="space-y-4">
          <p className="text-[20px] leading-7 text-[#252525CC] font-light">This hamper includes:</p>
          <ul className="space-y-1 pl-8">
            {localIncludes.map((item, i) => (
              <li key={`${item}-${i}`} className="text-[20px] leading-7 text-[#252525CC] font-light list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
       
       
       {/* updated design for the detail page */}
  
{/* Please uncomment this when the backend is ready for the colors handling and remove that hard coded <SizeAndCustomization> below it and match the keys with the backend which are size_code is_active ....  */}

{/* {sizes.length > 0 && <SizeAndCustomization sizes={sizes} onSizeChange={(size) => setDisplayPrice(size.price)} />} */}



{/* <SizeAndCustomization
  sizes={[
    {
      id: '1',
      size_code: 'S',
      label: 'Small',
      price: '1500',
      is_active: true,
      fillers: ['Shredded paper', 'Tissue paper', 'Confetti'],
      colors: {
        decorative_colors: ['#E91E8C', '#29B6F6', '#E53935', '#212121', '#FFFFFF'],
        net: ['#E91E8C', '#29B6F6', '#212121', '#FFFFFF'],
        product_color: ['#6D4C41', '#212121', '#FFFFFF'],
        ribbon: ['#E91E8C', '#29B6F6', '#E53935', '#212121', '#FFFFFF'],
      },
    },
    { id: '2', size_code: 'M', label: 'Medium', price: '2500', is_active: true },
    { id: '3', size_code: 'L', label: 'Large', price: '3500', is_active: true },
    { id: '4', size_code: 'XL', label: 'X Large', price: '4500', is_active: true },
  ]}
  onSizeChange={(size) => setDisplayPrice(size.price)}
/> */}

      <AddToCart
        productId={productId}
        productName={detailName}
        productImage={detailImage}
        productPrice={detailPrice}
        sizes={sizes}
        onPriceChange={setDisplayPrice}
      />
    </div>
  )
}
