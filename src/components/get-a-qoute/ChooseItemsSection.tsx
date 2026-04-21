'use client'

import { useState } from 'react'

type QuoteItem = {
  id: string
  name: string
  price?: string | number
  category: string
  image_url?: string | null
}

type SelectedItem = { id: string; qty: number }

type Props = {
  items: QuoteItem[]
  selected: SelectedItem[]
  onSelectionChange: (items: SelectedItem[]) => void
  onBack: () => void
  onContinue: () => void
  isLoading?: boolean
  message?: string
  minItems?: number
  maxItems?: number
}

export default function ChooseItemsSection({
  items,
  selected,
  onSelectionChange,
  onBack,
  onContinue,
  isLoading = false,
  message = '',
  minItems,
  maxItems,
}: Props) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({})

  const totalSelectedQty = selected.reduce((sum, item) => sum + item.qty, 0)
  const hasMinItems = typeof minItems === 'number'
  const hasMaxItems = typeof maxItems === 'number'
  const isBelowMin = hasMinItems ? totalSelectedQty < (minItems || 0) : false
  const isAboveMax = hasMaxItems ? totalSelectedQty > (maxItems || Number.MAX_SAFE_INTEGER) : false

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    )
  }

  const visibleItems =
    activeFilters.length > 0
      ? items.filter((item) => activeFilters.includes(item.category))
      : items

  const isSelected = (id: string) => selected.some((s) => s.id === id)

  const getQty = (id: string) => selected.find((s) => s.id === id)?.qty ?? 1

  const toggleItem = (id: string) => {
    if (isSelected(id)) {
      onSelectionChange(selected.filter((s) => s.id !== id))
    } else {
      if (hasMaxItems && totalSelectedQty >= (maxItems || Number.MAX_SAFE_INTEGER)) return
      onSelectionChange([...selected, { id, qty: 1 }])
    }
  }

  const changeQty = (id: string, delta: number) => {
    const currentQty = getQty(id)

    if (delta > 0 && hasMaxItems && totalSelectedQty >= (maxItems || Number.MAX_SAFE_INTEGER)) return
    if (delta < 0 && currentQty <= 1) return

    onSelectionChange(
      selected.map((s) => (s.id === id ? { ...s, qty: Math.max(1, s.qty + delta) } : s))
    )
  }

  return (
    <section id="choose-items" className="scroll-mt-24">
      <h2 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mb-6">
        Choose Baskit items
      </h2>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {[1, 2, 3, 4].map((skeleton) => (
            <div key={skeleton} className="animate-pulse">
              <div className="h-[260px] bg-[#EEE9DE]" />
              <div className="mt-2 h-5 bg-[#EEE9DE]" />
              <div className="mt-2 h-5 w-2/3 bg-[#EEE9DE]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="mb-4 rounded-md border border-dashed border-[#25252533] p-4 text-sm text-[#8E8A83]">
          {message || 'No items available.'}
        </div>
      )}

      {!isLoading && items.length > 0 && (hasMinItems || hasMaxItems) && (
        <div
          className={`mb-4 rounded-md border p-3 text-sm ${
            isBelowMin || isAboveMax
              ? 'border-red-300 bg-red-50 text-red-700'
              : 'border-[#25252533] text-[#8E8A83]'
          }`}
        >
          {hasMinItems && hasMaxItems
            ? `Select between ${minItems} and ${maxItems} items. Current: ${totalSelectedQty}`
            : hasMinItems
            ? `Select at least ${minItems} items. Current: ${totalSelectedQty}`
            : `Select up to ${maxItems} items. Current: ${totalSelectedQty}`}
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleItems.map((item) => {
          const sel = isSelected(item.id)
          const imageUnavailable = !item.image_url || brokenImages[item.id]

          return (
            <div key={item.id} className="flex flex-col">

              {/* Image card with checkbox */}
              <div className="relative bg-[#DDD9CC] h-[260px] flex items-center justify-center pt-3 px-3">

                {/* Checkbox top-right */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="absolute top-2.5 right-2.5 w-5 h-5 border border-[#252525CC] flex items-center justify-center transition-colors"
                  aria-label={sel ? 'Deselect' : 'Select'}
                >
                  {sel && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 3.5L3.5 6L9 1"
                        stroke="#252525"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* Product image */}
                <div className="w-full h-full flex items-center justify-center">
                  {imageUnavailable ? (
                    <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-[#25252533] text-xs text-[#8E8A83]">
                      Image preview not available
                    </div>
                  ) : (
                    <img
                      src={item.image_url ?? undefined}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={() => setBrokenImages((prev) => ({ ...prev, [item.id]: true }))}
                    />
                  )}
                </div>
              </div>

              {/* Name, price, qty */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[20px] text-[#252525] leading-6 tobia-normal">{item.name}</p>
                  <p className="text-[20px] text-[#252525] leading-6 mt-2 tobia-normal">
                    {item.price ?? ''}
                  </p>
                </div>

                {/* Qty buttons */}
                <div className="flex items-center border border-[#25252533] h-8 shrink-0">
                  <button
                    onClick={() => sel && changeQty(item.id, -1)}
                    className="w-4 h-full flex items-center justify-center text-[#252525] hover:bg-[#f5f0e8] transition-colors text-[14px]"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-[16px] leading-5 text-[#252525] tobia-normal">
                    {sel ? getQty(item.id) : 1}
                  </span>
                  <button
                    onClick={() => sel && changeQty(item.id, 1)}
                    disabled={
                      hasMaxItems &&
                      totalSelectedQty >= (maxItems || Number.MAX_SAFE_INTEGER) &&
                      sel
                    }
                    className="w-4 h-full flex items-center justify-center text-[#252525] hover:bg-[#f5f0e8] transition-colors text-[14px]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}