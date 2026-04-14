'use client'

import { Filter, X } from 'lucide-react'

const filters = [
  'Chocolates',
  'Chips',
  'Biscuit & cookies',
  'Dried fruit & nuts',
  'Beverages',
  'Nimco & crackers',
  'Cakes & wafers',
]

type Props = {
  active: string[]
  onToggle: (filter: string) => void
  onClear: () => void
}

export default function ItemFilters({ active, onToggle, onClear }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">

      {/* Filter icon label */}
      {/* <div className="flex items-center gap-1.5 text-[13px] text-[#252525] font-light mr-1">
        <Filter size={14} />
        <span>Filters</span>
      </div> */}
      <div className='border border-[#25252533] py-2 px-4'>
      <div className='flex gap-2'>
         <img src="/images/icons/filter.svg" width={20} height={20} alt="fiter" />
         <span className='font-light text-[16px] leading-5 text-[#252525]'>Filters</span>
      </div>
      </div>
      {filters.map((f) => {
        const isActive = active.includes(f)
        return (
          <button
            key={f}
            onClick={() => onToggle(f)}
            className={`flex items-center gap-2 text-[16px] leading-5 font-light px-4 py-2 border transition-all duration-150
              ${isActive
                ? 'border-[#D3556566] bg-[#D3556514] text-[#D35565]'
                : 'border-[#25252533] bg-transparent text-[#252525B8] hover:border-[#252525]'
              }
            `}
          >
            {f}
            {isActive && <X size={12} className="text-[#D35565]" />}
          </button>
        )
      })}
    </div>
  )
}