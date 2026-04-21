'use client'

type BouqetSizeOption = {
  id: string
  label: string
  image: string
  minItems?: number
  maxItems?: number
}

type Props = {
  selected: string
  onSelect: (id: string) => void
  onBack: () => void
  onContinue: () => void
  options?: BouqetSizeOption[]
  isLoading?: boolean
  message?: string
}

export default function BouqetsSize({ selected, onSelect, onBack, onContinue, options = [], isLoading = false, message = '' }: Props) {
  const showMessage = Boolean(message) || (!isLoading && options.length === 0)
  const messageText = message || 'No bouquet sizes available.'

  return (
    <section id="bouqet-size" className="scroll-mt-24">
      <h2 className="text-[28px] tobia-normal text-[#252525] mb-10">
        Choose your bouquet size
      </h2>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((skeleton) => (
            <div key={skeleton} className="border border-[#2525251A] p-5 animate-pulse">
              <div className="h-[90px] bg-[#EEE9DE]" />
              <div className="mt-4 h-5 bg-[#EEE9DE]" />
            </div>
          ))}
        </div>
      )}

      {showMessage && (
        <div className="rounded-md border border-dashed border-[#25252533] p-4 text-sm text-[#8E8A83]">
          {messageText}
        </div>
      )}

      {!isLoading && options.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {options.map((size) => {
          const isSelected = selected === size.id
          return (
            <button
              key={size.id}
              onClick={() => onSelect(size.id)}
              className={`flex flex-col items-center justify-end gap-4 p-5 transition-all duration-200 border
                ${isSelected
                  ? 'bg-[#D3556514] border-[#D3556533]'
                  : 'bg-transparent border-transparent hover:bg-[#D3556514]'
                }
              `}
            >
              <div className="relative flex items-center justify-center">
                <img src={size.image} alt="basket size" />
              </div>
              <span className={`text-[15px] tobia-normal sm:text-[20px] leading-6
                ${isSelected ? 'text-[#252525] font-medium' : 'text-[#252525] font-light'}
              `}>
                {size.label}
              </span>
            </button>
          )
        })}
      </div>
      )}
    </section>
  )
}