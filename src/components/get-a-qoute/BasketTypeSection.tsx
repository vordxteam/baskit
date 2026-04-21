'use client'

import { useState } from 'react'

type BasketTypeOption = {
  id: string
  label: string
  image?: string
}

type Props = {
  selected: string
  onSelect: (id: string) => void
  onContinue: () => void
  options?: BasketTypeOption[]
  isLoading?: boolean
  message?: string
}

export default function BasketTypeSection({
  selected,
  onSelect,
  onContinue,
  options = [],
  isLoading = false,
  message = '',
}: Props) {
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({})

  const showMessage = Boolean(message) || (!isLoading && options.length === 0)
  const messageText = message || 'No basket types available.'

  return (
    <section id="basket-type" className="scroll-mt-24">
      <h2 className="text-[28px] tobia-normal text-[#252525] mb-10">
        Choose your basket type
      </h2>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="border border-[#2525251A] px-5 py-6 animate-pulse">
              <div className="h-[120px] sm:h-[140px] bg-[#EEE9DE]" />
              <div className="mt-4 h-5 bg-[#EEE9DE]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && showMessage && (
        <div className="rounded-md border border-dashed border-[#25252533] p-4 text-sm text-[#8E8A83]">
          {messageText}
        </div>
      )}

      {!isLoading && options.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {options.map((type) => {
            const isSelected = selected === type.id
            const imageUnavailable = !type.image || brokenImages[type.id]

            return (
              <button
                key={type.id}
                onClick={() => onSelect(type.id)}
                className={`flex flex-col items-center gap-4 px-5 py-6 transition-all duration-200 border
                  ${isSelected
                    ? 'bg-[#D3556514] border-[#D3556533]'
                    : 'bg-transparent border-transparent hover:bg-[#D3556514]'
                  }
                `}
              >
                <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] relative flex items-center justify-center">
                  {imageUnavailable ? (
                    <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-[#25252533] text-xs text-[#8E8A83]">
                      Image preview not available
                    </div>
                  ) : (
                    <img
                      src={type.image}
                      width={139}
                      height={140}
                      alt={type.label}
                      onError={() => setBrokenImages((prev) => ({ ...prev, [type.id]: true }))}
                    />
                  )}
                </div>
                <span
                  className={`text-[14px] tobia-normal sm:text-[20px] leading-6
                    ${isSelected ? 'text-[#252525] font-medium' : 'text-[#252525] font-light'}
                  `}
                >
                  {type.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}