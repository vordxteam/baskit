'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import Image from 'next/image'
import type {
  ApiFilterSizeOption,
  ApiFilterCategoryOption,
  ApiProductFilterCategory,
  UserProductsQueryParams,
} from '@/api/userProducts/types'

interface CheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (id: string) => void
}

interface PriceRange {
  min: number
  max: number
}

interface FiltersProps {
  categories?: ApiFilterCategoryOption[]
  productTypes?: ApiProductFilterCategory[]
  sizes?: ApiFilterSizeOption[]
  onFiltersChange?: (filters: UserProductsQueryParams) => void
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2.5 cursor-pointer group select-none"
  >
    <div className="relative shrink-0">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => onChange(id)}
        className="sr-only"
      />
      <div
        className={`
          w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center
          transition-all duration-150
          ${checked
            ? 'border-[#252525]'
            : 'border-[#252525] group-hover:border-[#393A1B80]'
          }
        `}
      >
        {checked && (
          <Image src="/images/icons/checked.svg" alt="tick" width={5} height={4} />
        )}
      </div>
    </div>
    <span className="text-[14px] font-light leading-5 transition-colors duration-150 text-[#252525]">
      {label}
    </span>
  </label>
)

const Divider = () => <div className="border-t border-[#4E0A0B14] my-1" />

const PriceRangeSlider: React.FC<{
  value: PriceRange
  min: number
  max: number
  onChange: (range: PriceRange) => void
}> = ({ value, min, max, onChange }) => {
  const gap = 500

  const toPercent = (v: number) => ((v - min) / (max - min)) * 100

  const clamp = (val: number, minVal: number, maxVal: number) =>
    Math.min(Math.max(val, minVal), maxVal)

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawMin = Number(e.target.value)
    const newMin = clamp(rawMin, min, value.max - gap)
    onChange({ ...value, min: newMin })
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawMax = Number(e.target.value)
    const newMax = clamp(rawMax, value.min + gap, max)
    onChange({ ...value, max: newMax })
  }

  const minPct = toPercent(value.min)
  const maxPct = toPercent(value.max)

  return (
    <div className="space-y-4">
      <div className="relative h-6 mt-4">
        <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-[#F2EEE8]" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#C2C395]"
          style={{
            left: `${minPct}%`,
            width: `${maxPct - minPct}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={value.min}
          onChange={handleMinChange}
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent pointer-events-none z-3"
          style={{ pointerEvents: 'auto', zIndex: value.min > max - gap * 2 ? 8 : 6 }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={value.max}
          onChange={handleMaxChange}
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 appearance-none bg-transparent pointer-events-none z-4"
          style={{ pointerEvents: 'auto', zIndex: value.max < min + gap * 2 ? 7 : 9 }}
        />

        <div
          className="absolute top-1/2 z-5 w-3.5 h-3.5 rounded-full bg-[#C2C395] border-2 border-[#393A1B] shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${minPct}%` }}
        />

        <div
          className="absolute top-1/2 z-5 w-3.5 h-3.5 rounded-full bg-[#C2C395] border-2 border-[#393A1B] shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${maxPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="border border-[#393A1B1F] bg-[#FFFFFF99] rounded-md px-2 py-1.5 min-w-20 text-center">
          <span className="text-[12px] text-[#393A1B99] font-light leading-4">
            {value.min.toLocaleString()} pkr
          </span>
        </div>

        <Image src="/images/icons/dash.svg" alt="dash" width={8} height={1} />

        <div className="border border-[#393A1B1F] bg-[#FFFFFF99] rounded-md px-2 py-1.5 min-w-20 text-center">
          <span className="text-[12px] text-[#393A1B99] font-light leading-4">
            {value.max.toLocaleString()} pkr
          </span>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 9999px;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          background: transparent;
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}

const getAllCategoryLabel = (categoryName: string) => {
  const normalized = categoryName.trim().toLowerCase()
  const plural = normalized.endsWith('s') ? normalized : `${normalized}s`
  return `All ${plural}`
}

const sortKeyById = {
  newest: 'newest',
  priceHighLow: 'price_high_to_low',
  priceLowHigh: 'price_low_to_high',
} as const

const Filters: React.FC<FiltersProps> = ({
  categories = [],
  productTypes = [],
  sizes = [],
  onFiltersChange,
}) => {
  const [search, setSearch] = useState('')

  const [sortChecks, setSortChecks] = useState<Record<string, boolean>>({
    newest: false,
    priceHighLow: false,
    priceLowHigh: false,
  })

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string | undefined>(undefined)
  const [selectedStyleId, setSelectedStyleId] = useState<string | undefined>(undefined)
  const [selectedSizeCode, setSelectedSizeCode] = useState<string | undefined>(undefined)
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 20000 })

  const visibleCategories = useMemo(() => {
    return productTypes.filter(
      (category) => Array.isArray(category.styles) && category.styles.length > 0
    )
  }, [productTypes])

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategory((prev) => (prev === id ? undefined : id))
  }, [])

  const toggleSize = useCallback((code: string) => {
    setSelectedSizeCode((prev) => (prev === code ? undefined : code))
  }, [])

  const toggleSort = useCallback((id: string) => {
    setSortChecks((prev) => {
      if (prev[id]) {
        return prev
      }

      return {
        newest: id === 'newest',
        priceHighLow: id === 'priceHighLow',
        priceLowHigh: id === 'priceLowHigh',
      }
    })
  }, [])

  const toggleCategoryStyle = useCallback((categoryId: string, styleId: string) => {
    const category = visibleCategories.find((item) => item.id === categoryId)

    if (!category) {
      return
    }

    if (styleId === 'all') {
      setSelectedStyleId(undefined)
      setSelectedProductTypeId((prev) => (prev === categoryId ? undefined : categoryId))
      return
    }

    setSelectedProductTypeId(categoryId)
    setSelectedStyleId((prev) => (prev === styleId ? undefined : styleId))
  }, [visibleCategories])

  useEffect(() => {
    if (!onFiltersChange) {
      return
    }

    const debounceId = window.setTimeout(() => {
      const selectedSortId = Object.keys(sortChecks).find(
        (key) => sortChecks[key]
      ) as keyof typeof sortKeyById | undefined

      const nextFilters: UserProductsQueryParams = {}
      const trimmedSearch = search.trim()

      if (trimmedSearch) {
        nextFilters.search = trimmedSearch
      }

      // Only send price filter if user moved from default full range.
      if (priceRange.min > 0) {
        nextFilters.min_price = priceRange.min
      }

      if (priceRange.max < 20000) {
        nextFilters.max_price = priceRange.max
      }

      if (selectedSortId) {
        const sortKey = sortKeyById[selectedSortId]
        if (sortKey === 'newest') {
          nextFilters.newest = true
        }
        if (sortKey === 'price_high_to_low') {
          nextFilters.price_high_to_low = true
        }
        if (sortKey === 'price_low_to_high') {
          nextFilters.price_low_to_high = true
        }
      }

      if (selectedCategory) {
        nextFilters.category = selectedCategory
      }

      if (selectedStyleId) {
        nextFilters.style = selectedStyleId
      }

      onFiltersChange(nextFilters)
    }, 500)

    return () => window.clearTimeout(debounceId)
  }, [onFiltersChange, priceRange.max, priceRange.min, search, selectedCategory, selectedStyleId, sortChecks])

  const sectionLabel = 'text-[16px] tobia-normal text-[#252525CC] leading-5 tracking-wide'

  return (
    <div className="min-w-[243px] w-[243px]">
      <div>
        <p className="text-[16px] leading-5 text-[#2525257A] tobia-normal">
          Search by product
        </p>
        <div className="relative w-full mt-3">
          <Image
            src="/images/icons/search.svg"
            alt="search"
            width={20}
            height={20}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#FFFFFF66] border border-[#393A1B3D] text-[#393A1B99] placeholder:text-[#393A1B99] text-[14px] tobia-light leading-5 outline-none rounded-md py-2.5 pl-10 pr-3 w-full focus:border-[#393A1B80] transition-colors duration-150"
          />
        </div>
      </div>

      <div className="space-y-4 my-6">
        <p className={sectionLabel}>Filter</p>
        <div className="space-y-4">
          <Checkbox id="newest" label="Newest" checked={sortChecks.newest} onChange={toggleSort} />
          <Checkbox id="priceHighLow" label="Price high - low" checked={sortChecks.priceHighLow} onChange={toggleSort} />
          <Checkbox id="priceLowHigh" label="Price low - high" checked={sortChecks.priceLowHigh} onChange={toggleSort} />
        </div>
      </div>
      <Divider />
      {/* <div className="space-y-4 my-6">
        <p className={sectionLabel}>Baskit collection</p>
        <div className="space-y-4">
          <Checkbox id="allBaskits" label="All Baskits" checked={sortChecks.allBaskits} onChange={toggleSort} />
          <Checkbox id="squareBaskits" label="Square Baskits" checked={sortChecks.squareBaskits} onChange={toggleSort} />
          <Checkbox id="roundBaskits" label="Round Baskits" checked={sortChecks.roundBaskits} onChange={toggleSort} />
        </div>
      </div> */}
      {sizes.length > 0 && (
        <>
          <div className="space-y-4 my-6">
        <p className={sectionLabel}>Size</p>
        <div className="space-y-4">
              {sizes.map((size) => (
                <Checkbox
                  key={size.code}
                  id={`size-${size.code}`}
                  label={size.label}
                  checked={selectedSizeCode === size.code}
                  onChange={() => toggleSize(size.code)}
                />
              ))}
        </div>
          </div>
          <Divider />
        </>
      )}

      {categories.length > 0 && (
        <>
          <Divider />
          <div className="space-y-4 my-6">
            <p className={sectionLabel}>Occasions</p>
            <div className="space-y-4">
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  id={`category-${category.id}`}
                  label={category.name}
                  checked={selectedCategory === category.id}
                  onChange={() => toggleCategory(category.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <Divider />

      {visibleCategories.map((category, index) => {
        return (
          <React.Fragment key={category.id}>
            <div className="space-y-4 my-6">
              <p className={sectionLabel}>{category.name}</p>
              <div className="space-y-4">
                <Checkbox
                  id={`${category.id}-all`}
                  label={getAllCategoryLabel(category.name)}
                  checked={selectedProductTypeId === category.id && !selectedStyleId}
                  onChange={() => toggleCategoryStyle(category.id, 'all')}
                />

                {category.styles.map((style) => (
                  <Checkbox
                    key={style.id}
                    id={`${category.id}-${style.id}`}
                    label={style.name}
                    checked={selectedStyleId === style.id}
                    onChange={() => toggleCategoryStyle(category.id, style.id)}
                  />
                ))}
              </div>
            </div>
            {index < visibleCategories.length - 1 && <Divider />}
          </React.Fragment>
        )
      })}

      {visibleCategories.length > 0 && <Divider />}

      <div className="space-y-4 my-6">
        <p className={sectionLabel}>Price</p>
        <PriceRangeSlider
          value={priceRange}
          min={0}
          max={20000}
          onChange={setPriceRange}
        />
      </div>
      <Divider />
      {/* <div className="space-y-4 my-6">
        <p className={sectionLabel}>Occasion</p>
        <div className="space-y-4">
          <Checkbox id="small" label="Birthday" checked={sortChecks.birthday} onChange={toggleSort} />
          <Checkbox id="medium" label="Anniversary" checked={sortChecks.anniversary} onChange={toggleSort} />
          <Checkbox id="large" label="Wedding" checked={sortChecks.wedding} onChange={toggleSort} />
          <Checkbox id="xlarge" label="Thank you" checked={sortChecks.thankYou} onChange={toggleSort} />
          <Checkbox id="xlarge" label="Corporate" checked={sortChecks.corporate} onChange={toggleSort} />
          <Checkbox id="xlarge" label="Get well soon" checked={sortChecks.getWellSoon} onChange={toggleSort} />


        </div>
      </div> */}
      <Divider />
      {/* <div className="space-y-4 my-6">
        <p className={sectionLabel}>Availability</p>
        <div className="space-y-4">
          <Checkbox id="inStock" label="In - stock" checked={sortChecks.inStock} onChange={toggleSort} />
          <Checkbox id="outofstock" label="Out of stock" checked={sortChecks.outOfStock} onChange={toggleSort} />
        </div>
      </div> */}
      {/* <div className="space-y-4 my-6">
        <p className={sectionLabel}>Rating</p>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedRating((prev) => (prev === star ? 0 : star))}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0 bg-transparent border-none cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95"
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              <Star
                size={22}
                strokeWidth={1.5}
                className="transition-colors duration-150"
                style={{
                  stroke: (hoverRating || selectedRating) >= star ? '#393A1B' : '#252525',
                  fill: (hoverRating || selectedRating) >= star ? '#C2C395' : 'transparent',
                }}
              />
            </button>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default Filters