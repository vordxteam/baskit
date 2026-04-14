'use client'
import Link from "next/link"
type ColorOption = { id: string; hex: string }


const ribbonColors: ColorOption[] = [
  { id: 'pink',  hex: '#E91E8C' },
  { id: 'blue',  hex: '#00BCD4' },
  { id: 'red',   hex: '#E53935' },
  { id: 'white', hex: '#FFFFFF' },
]

type Decoration = {
  basketColor: string
  netColor: string
  ribbonColor: string
}

type Props = {
  decoration: Decoration
  onDecorChange: (key: keyof Decoration, value: string) => void
  onBack: () => void
  onContinue: () => void
}

const ColorPicker = ({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: ColorOption[]
  selected: string
  onSelect: (id: string) => void
}) => (
  <div className="space-y-3">
    <p className="text-[18px] leading-6 font-normal text-[#252525]">{label}</p>
    <div className="flex items-center gap-2">
      {options.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`w-15 h-15 shrink-0 transition-all duration-150
            ${selected === c.id ? 'ring-2 ring-offset-2 ring-[#252525]' : ''}
            ${c.hex === '#FFFFFF' ? 'border border-[#25252533]' : ''}
          `}
          style={{ backgroundColor: c.hex }}
          aria-label={c.id}
        />
      ))}
    </div>
  </div>
)

export default function DecorateBouqets({ decoration, onDecorChange, onBack, onContinue }: Props) {
  return (
    <section id="decorate" className="scroll-mt-24">
      <h2 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mb-8">
       Decorate your bouquet
      </h2>

      <div className="flex flex-col sm:flex-row gap-10 sm:gap-16">
       
        <ColorPicker
          label="Ribbon color"
          options={ribbonColors}
          selected={decoration.ribbonColor}
          onSelect={(v) => onDecorChange('ribbonColor', v)}
        />
      </div>

      {/* Go back / Continue */}
      <div className="flex items-center justify-between mt-15">
        <button
          onClick={onBack}
          className="border border-[#252525] text-[18px] leading-6 font-light text-[#252525] px-5 py-3 hover:bg-[#f5f0e8] transition-colors"
        >
          Go back
        </button>
        
        
        <Link href="/bouqets-summary"
      
          className="bg-[#252525] text-[#FFFEF2] text-[18px] leading-6 font-light px-5 py-3 hover:opacity-90 transition-opacity"
        >
          Continue
        </Link>
   
      </div>
    </section>
  )
}