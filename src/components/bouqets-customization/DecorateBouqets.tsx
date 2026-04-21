'use client'

type ColorOption = {
  id: string
  hex: string
  label: string
}

type RibbonStyleOption = {
  id: string
  label: string
}

type Decoration = {
  ribbonStyle: string
  bouquetWrapColor: string
  ribbonColor: string
  glitterColor: string
}

type Props = {
  decoration: Decoration
  onDecorChange: (key: keyof Decoration, value: string) => void
}

const ribbonStyles: RibbonStyleOption[] = [
  { id: 'standard-satin', label: 'Standard satin' },
  { id: 'curl-ribbon', label: 'Curl ribbon' },
  { id: 'jute-twine', label: 'Jute twine' },
  { id: 'no-ribbon', label: 'No ribbon' },
]

const bouquetWrapColors: ColorOption[] = [
  { id: 'pink', hex: '#E56CC5', label: 'Pink' },
  { id: 'sky-blue', hex: '#77C7F2', label: 'Sky blue' },
  { id: 'red', hex: '#F33A3A', label: 'Red' },
  { id: 'black', hex: '#000000', label: 'Black' },
  { id: 'white', hex: '#F5F5F5', label: 'White' },
]

const ribbonColors: ColorOption[] = [
  { id: 'pink', hex: '#E56CC5', label: 'Pink' },
  { id: 'sky-blue', hex: '#77C7F2', label: 'Sky blue' },
  { id: 'red', hex: '#F33A3A', label: 'Red' },
  { id: 'black', hex: '#000000', label: 'Black' },
  { id: 'maroon', hex: '#5C0000', label: 'Maroon' },
  { id: 'white', hex: '#F5F5F5', label: 'White' },
]

const glitterColors: ColorOption[] = [
  { id: 'yellow', hex: '#EFD443', label: 'Yellow' },
  { id: 'silver', hex: '#D9D9D9', label: 'Silver' },
  { id: 'pink', hex: '#E56CC5', label: 'Pink' },
  { id: 'sky-blue', hex: '#77C7F2', label: 'Sky blue' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[28px] leading-8 tobia-normal text-[#252525]">
      {children}
    </h3>
  )
}

function RibbonStyleSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-8">
      <SectionTitle>Choose ribbon style</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {ribbonStyles.map((style) => {
          const isSelected = value === style.id

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
              className={`h-[66px] border text-center text-[18px] font-normal text-[#252525] transition-all duration-200
                ${isSelected
                  ? 'border-[#E8CFC8] bg-[#F4E7E3]'
                  : 'border-[#D7D3C8] bg-transparent hover:bg-[#F8F6F0]'
                }`}
            >
              {style.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ColorPicker({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: ColorOption[]
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="space-y-8">
      <SectionTitle>{label}</SectionTitle>

      <div className="flex flex-wrap items-center gap-4">
        {options.map((color) => {
          const isSelected = selected === color.id
          const isLight = color.hex.toLowerCase() === '#f5f5f5' || color.hex.toLowerCase() === '#ffffff'

          return (
            <button
              key={color.id}
              type="button"
              aria-label={color.label}
              title={color.label}
              onClick={() => onSelect(color.id)}
              className={`relative flex h-[32px] w-[32px] items-center justify-center rounded-full transition-all duration-200
                ${isSelected ? 'ring-1 ring-[#252525] ring-offset-[3px] ring-offset-[#F7F5EC]' : ''}
                ${isLight ? 'border border-[#E2DED3]' : ''}
              `}
              style={{ backgroundColor: color.hex }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function DecorateBouquets({
  decoration,
  onDecorChange,
}: Props) {
  return (
    <section
      id="decorate"
      className="scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-[1200px] space-y-14">
        <RibbonStyleSelector
          value={decoration.ribbonStyle}
          onChange={(value) => onDecorChange('ribbonStyle', value)}
        />

        <div className="grid grid-cols-1 gap-y-14 gap-x-16 lg:grid-cols-2">
          <ColorPicker
            label="Choose bouquet wrap color"
            options={bouquetWrapColors}
            selected={decoration.bouquetWrapColor}
            onSelect={(value) => onDecorChange('bouquetWrapColor', value)}
          />

          <ColorPicker
            label="Choose ribbon color"
            options={ribbonColors}
            selected={decoration.ribbonColor}
            onSelect={(value) => onDecorChange('ribbonColor', value)}
          />
        </div>

        <div className="max-w-[520px]">
          <ColorPicker
            label="Choose glitter color (optional)"
            options={glitterColors}
            selected={decoration.glitterColor}
            onSelect={(value) => onDecorChange('glitterColor', value)}
          />
        </div>
      </div>
    </section>
  )
}