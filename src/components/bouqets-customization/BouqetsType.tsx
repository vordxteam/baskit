'use client'

const basketTypes = [
  { id: 'wrapped', label: 'Wrapped bouqet', image: '/images/wrapped-bouqet.png' },
  { id: 'box',  label: 'Box bouquet',  image: '/images/box-bouqet.png'  },
  { id: 'baskit',    label: 'Baskit bouquet',    image: '/images/baskit20.png'    },
]

type Props = {
  selected: string
  onSelect: (id: string) => void
  onContinue: () => void
}

export default function BouqetsType({ selected, onSelect, onContinue }: Props) {
  return (
    <section id="bouqet-type" className="scroll-mt-24">
      <h2 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mb-10">
       Choose your bouquet type
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {basketTypes.map((type) => {
          const isSelected = selected === type.id
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
              {/* Replace with your actual images */}
              <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] relative flex items-center justify-center">
              <img src={type.image} width={139} height={140} alt="basket type" />
              </div>
              <span className={`text-[14px] tobia-normal sm:text-[20px] leading-6
                ${isSelected ? 'text-[#252525] font-medium' : 'text-[#252525] font-light'}
              `}>
                {type.label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}