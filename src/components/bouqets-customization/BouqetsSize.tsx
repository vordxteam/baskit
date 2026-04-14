'use client'

const basketSizes = [
  { id: 'small',  label: 'Small',  image: '/images/small-bouqet.png'  },
  { id: 'medium', label: 'Medium', image: '/images/medium-bouqet.png' },
  { id: 'large',  label: 'Large',  image: '/images/large-bouqet.png'  },
]

type Props = {
  selected: string
  onSelect: (id: string) => void
  onBack: () => void
  onContinue: () => void
}

export default function BouqetsSize({ selected, onSelect, onBack, onContinue }: Props) {
  return (
    <section id="bouqet-size" className="scroll-mt-24">
      <h2 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mb-10">
Choose your bouquet size
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {basketSizes.map((size) => {
          const isSelected = selected === size.id
          return (
            <button
              key={size.id}
              onClick={() => onSelect(size.id)}
              className={`flex flex-col items-center gap-4 px-5 py-6 transition-all duration-200 border
                ${isSelected
                  ? 'bg-[#D3556514] border-[#D3556533]'
                  : 'bg-transparent border-transparent hover:bg-[#D3556514]'
                }
              `}
            >
              <div className="w-[120px] h-[120px] sm:w-[159px] sm:h-[140px] relative flex items-center justify-center">
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
    </section>
  )
}