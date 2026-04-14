'use client'

import { useState } from 'react'
import ItemFilters from './ItemFilters'

type Item = {
  id: number
  name: string
  price: string
  category: string
  image: string
}

const allItems: Item[] = [
  { id: 1,  name: 'Kit Kat',        price: 'PKR 120', category: 'Chocolates',        image: '/images/kitkat.png'     },
  { id: 2,  name: 'Snickers',       price: 'PKR 120', category: 'Chocolates',        image: '/images/snickers.png'   },
  { id: 3,  name: 'Dairy Milk',     price: 'PKR 120', category: 'Chocolates',        image: '/images/dairymilk.png' },
  { id: 4,  name: 'Bueno',          price: 'PKR 120', category: 'Chocolates',        image: '/images/twix.png'      },
  { id: 5,  name: 'Maltesers',      price: 'PKR 120', category: 'Chocolates',        image: '/images/maltesers.png' },
  { id: 6,  name: 'Mars',           price: 'PKR 120', category: 'Chocolates',        image: '/images/mars.png'      },
  { id: 7,  name: 'Ferrero Rocher', price: 'PKR 120', category: 'Chocolates',        image: '/images/ferrero.png'   },
  { id: 8,  name: 'Twix',           price: 'PKR 120', category: 'Chocolates',        image: '/images/twix.png'      },
 
]

type SelectedItem = { id: number; qty: number }

type Props = {
  selected: SelectedItem[]
  onSelectionChange: (items: SelectedItem[]) => void
  onBack: () => void
  onContinue: () => void
}

export default function ChooseItemsSection({ selected, onSelectionChange, onBack, onContinue }: Props) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    )
  }

  const visibleItems = activeFilters.length > 0
    ? allItems.filter((item) => activeFilters.includes(item.category))
    : allItems

  const isSelected = (id: number) => selected.some((s) => s.id === id)

  const getQty = (id: number) => selected.find((s) => s.id === id)?.qty ?? 1

  const toggleItem = (id: number) => {
    if (isSelected(id)) {
      onSelectionChange(selected.filter((s) => s.id !== id))
    } else {
      onSelectionChange([...selected, { id, qty: 1 }])
    }
  }

  const changeQty = (id: number, delta: number) => {
    onSelectionChange(
      selected.map((s) =>
        s.id === id ? { ...s, qty: Math.max(1, s.qty + delta) } : s
      )
    )
  }

  return (
    <section id="choose-items" className="scroll-mt-24">
      <h2 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mb-6">
        Choose your items
      </h2>

      {/* Filters */}
      <ItemFilters active={activeFilters} onToggle={toggleFilter} onClear={() => setActiveFilters([])} />

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleItems.map((item) => {
          const sel = isSelected(item.id)
          return (
            <div key={item.id} className="flex flex-col">

              {/* Image card with checkbox */}
              {/* <div className="relative bg-[#DDD9CC] aspect-square flex items-center justify-center p-4"> */}
              {/* Image card with checkbox */}
<div className="relative bg-[#DDD9CC] h-[260px] flex items-center justify-center p-4">

                {/* Checkbox top-right */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="absolute top-2.5 right-2.5 w-5 h-5 border border-[#252525CC]  flex items-center justify-center transition-colors"
                  aria-label={sel ? 'Deselect' : 'Select'}
                >
                  {sel && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 3.5L3.5 6L9 1" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Product image placeholder */}
                {/* <div className="w-full h-full flex items-center justify-center">
                <img src={item.image} alt="product images" />
                </div> */}
                {/* Product image placeholder */}
<div className="w-full h-full flex items-center justify-center">
  <img 
    src={item.image} 
    alt="product images"
    className="w-full h-full object-contain"
  />
</div>
              </div>

              {/* Name, price, qty */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[20px] text-[#252525]  leading-6 tobia-normal">{item.name}</p>
                  <p className="text-[20px] text-[#252525] leading-6 mt-2 tobia-normal">{item.price}</p>
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