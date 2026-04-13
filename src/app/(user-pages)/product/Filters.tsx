// import React from 'react'

// const Filters = () => {
//   return (
//     <div className='min-w-[243px] space-y-6'>
//         <div className='space-y-3'>
//             <h1 className='text-[16px] text-[#2525257A] tobia-normal leading-5'>Search by product</h1>
//             <div className='relative w-full'>
                
//                 <input type="text" placeholder='Search here...' className='bg-[#FFFFFF66] border border-[#393A1B3D] text-[#393A1B99] text-[14px] font-normal leading-5 outline-none rounded-md py-2 px-3 w-full' />
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Filters

'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'

// --- Types ---
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

// --- Custom Checkbox ---
const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-center gap-[10px] cursor-pointer group select-none"
  >
    <div className="relative flex-shrink-0">
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
         <Image src="/images/icons/checked.svg" alt='tick' width={5} height={4} />
        )}
      </div>
    </div>
    <span
      className={`text-[14px] font-light leading-5 transition-colors duration-150 
        ${checked ? 'text-[#252525]' : 'text-[#252525]'}
      `}
    >
      {label}
    </span>
  </label>
)

// --- Section Divider ---
const Divider = () => <div className="border-t border-[#4E0A0B14] my-1" />

// --- Price Range Slider ---
const PriceRangeSlider: React.FC<{
  value: PriceRange
  min: number
  max: number
  onChange: (range: PriceRange) => void
}> = ({ value, min, max, onChange }) => {
  const toPercent = (v: number) => ((v - min) / (max - min)) * 100

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value.max - 500)
    onChange({ ...value, min: newMin })
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value.min + 500)
    onChange({ ...value, max: newMax })
  }

  const minPct = toPercent(value.min)
  const maxPct = toPercent(value.max)

  return (
    <div className="space-y-3">
      {/* Track */}
      <div className="relative h-2 mx-1 mt-4">
        {/* Base track */}
        <div className="absolute inset-0 rounded-full bg-[#F2EEE8]" />
        {/* Active range */}
        <div
          className="absolute top-0 h-full rounded-full bg-[#C2C395]"
          style={{
            left: `${minPct}%`,
            right: `${100 - maxPct}%`,
          }}
        />
        {/* Min thumb input */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={value.min}
          onChange={handleMinChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: value.min > max - 1000 ? 5 : 3 }}
        />
        {/* Max thumb input */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={value.max}
          onChange={handleMaxChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 4 }}
        />
        {/* Visual thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#C2C395] border-2 border-[#393A1B] shadow-md pointer-events-none"
          style={{ left: `calc(${minPct}% - 7px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#C2C395] border-2 border-[#393A1B] shadow-md pointer-events-none"
          style={{ left: `calc(${maxPct}% - 7px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-4">
        <div className="border border-[#393A1B1F] bg-[#FFFFFF99] rounded-md px-2 py-1.5 min-w-20 text-center">
          <span className="text-[12px] text-[#393A1B99] font-light leading-4">
            {value.min.toLocaleString()} rps
          </span>
        </div>
          <Image src="/images/icons/dash.svg" alt='dash' width={8} height={1}></Image>
        <div className="border border-[#393A1B1F] bg-[#FFFFFF99] rounded-md px-2 py-1.5 min-w-20 text-center">
          <span className="text-[12px] text-[#393A1B99] font-light leading-4">
            {value.max.toLocaleString()} rps
          </span>
        </div>
      </div>
    </div>
  )
}

// --- Main Filter Component ---
const Filters: React.FC = () => {
  const [search, setSearch] = useState('')

  const [sortChecks, setSortChecks] = useState<Record<string, boolean>>({
    newest: true,
    priceHighLow: false,
    priceLowHigh: false,
  })

  const [bouquetChecks, setBouquetChecks] = useState<Record<string, boolean>>({
    allBouquets: true,
    wrappedBouquets: false,
    boxBouquets: false,
    basketBouquets: false,
    glassVaseBouquets: false,
  })

  const [basketChecks, setBasketChecks] = useState<Record<string, boolean>>({
    allBaskets: false,
    birthdayBaskets: false,
    anniversaryBaskets: false,
    corporateBaskets: false,
    flowersSnacks: false,
  })

  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 2999, max: 15999 })

  const toggle = useCallback(
    (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) =>
      (id: string) => {
        setter((prev) => ({ ...prev, [id]: !prev[id] }))
      },
    []
  )

  const sectionLabel = 'text-[16px] tobia-normal text-[#252525CC] leading-5 tracking-wide'

  return (
    <div className="min-w-[243px] w-[243px]">
      {/* Search */}
      <div className="">
        <p className="text-[16px] leading-5  text-[#2525257A] tobia-normal">
          Search by product
        </p>
        <div className="relative w-full mt-3">
           <Image src="/images/icons/search.svg" alt='search' width={20} height={20} className='absolute left-3 top-1/2 -translate-y-1/2' />
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#FFFFFF66] border border-[#393A1B3D] text-[#393A1B99] placeholder:text-[#393A1B99] text-[14px] tobia-light leading-5 outline-none rounded-md py-2.5 pl-10 pr-3 w-full focus:border-[#393A1B80] transition-colors duration-150"
          />
        </div>
      </div>
      {/* Sort Filter */}
      <div className="space-y-4 my-6">
        <p className={sectionLabel}>Filter</p>
        <div className="space-y-4">
          <Checkbox id="newest" label="Newest" checked={sortChecks.newest} onChange={toggle(setSortChecks)} />
          <Checkbox id="priceHighLow" label="Price high - low" checked={sortChecks.priceHighLow} onChange={toggle(setSortChecks)} />
          <Checkbox id="priceLowHigh" label="Price low - high" checked={sortChecks.priceLowHigh} onChange={toggle(setSortChecks)} />
        </div>
      </div>

      <Divider />

      {/* Bouquets */}
      <div className="space-y-4  my-6">
        <p className={sectionLabel}>Bouquets Collection</p>
        <div className="space-y-4">
          <Checkbox id="allBouquets" label="All bouquets" checked={bouquetChecks.allBouquets} onChange={toggle(setBouquetChecks)} />
          <Checkbox id="wrappedBouquets" label="Wrapped bouquets" checked={bouquetChecks.wrappedBouquets} onChange={toggle(setBouquetChecks)} />
          <Checkbox id="boxBouquets" label="Box bouquets" checked={bouquetChecks.boxBouquets} onChange={toggle(setBouquetChecks)} />
          <Checkbox id="basketBouquets" label="Basket bouquets" checked={bouquetChecks.basketBouquets} onChange={toggle(setBouquetChecks)} />
          <Checkbox id="glassVaseBouquets" label="Glass & vase bouquets" checked={bouquetChecks.glassVaseBouquets} onChange={toggle(setBouquetChecks)} />
        </div>
      </div>

      <Divider />

      {/* Baskets */}
      <div className="space-y-4 my-6">
        <p className={sectionLabel}>Baskets Collection</p>
        <div className="space-y-[9px]">
          <Checkbox id="allBaskets" label="All baskets" checked={basketChecks.allBaskets} onChange={toggle(setBasketChecks)} />
          <Checkbox id="birthdayBaskets" label="Birthday baskets" checked={basketChecks.birthdayBaskets} onChange={toggle(setBasketChecks)} />
          <Checkbox id="anniversaryBaskets" label="Anniversary baskets" checked={basketChecks.anniversaryBaskets} onChange={toggle(setBasketChecks)} />
          <Checkbox id="corporateBaskets" label="Corporate baskets" checked={basketChecks.corporateBaskets} onChange={toggle(setBasketChecks)} />
          <Checkbox id="flowersSnacks" label="Flowers + Snacks" checked={basketChecks.flowersSnacks} onChange={toggle(setBasketChecks)} />
        </div>
      </div>

      <Divider />

      {/* Price Range */}
      <div className="space-y-4 my-6">
        <p className={sectionLabel}>Price</p>
        <PriceRangeSlider
          value={priceRange}
          min={0}
          max={20000}
          onChange={setPriceRange}
        />
      </div>
    </div>
  )
}

export default Filters