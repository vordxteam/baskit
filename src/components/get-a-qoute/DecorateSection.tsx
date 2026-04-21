'use client'

type ColorOption = {
  id: string
  hex: string
  label: string
}

type Option = {
  id: string
  label: string
}

type Decoration = {
  basketCover: string
  ribbonStyle: string
  decorativeFiller: string
  basketColor: string
  basketCoverColor: string
  ribbonColor: string
  decorativeFillerColor: string
}

type Props = {
  decoration: Decoration
  onDecorChange: (key: keyof Decoration, value: string) => void
}

const basketCoverOptions: Option[] = [
  { id: 'net', label: 'Net' },
  { id: 'cellophane-wrap', label: 'Cellophane wrap' },
  { id: 'satin', label: 'Satin' },
  { id: 'no-cover', label: 'No cover' },
]

const ribbonStyles: Option[] = [
  { id: 'standard-satin', label: 'Standard satin' },
  { id: 'curl-ribbon', label: 'Curl ribbon' },
  { id: 'jute-twine', label: 'Jute twine' },
  { id: 'no-ribbon', label: 'No ribbon' },
]

const decorativeFillers: Option[] = [
  { id: 'shredded-paper', label: 'Shredded paper' },
  { id: 'tissue-paper', label: 'Tissue paper' },
  { id: 'confetti', label: 'Confetti' },
]

const basketColors: ColorOption[] = [
  { id: 'black', hex: '#000000', label: 'Black' },
  { id: 'brown', hex: '#B8642D', label: 'Brown' },
  { id: 'white', hex: '#F5F5F5', label: 'White' },
]

const basketCoverColors: ColorOption[] = [
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

const decorativeFillerColors: ColorOption[] = [
  { id: 'yellow', hex: '#EFD443', label: 'Yellow' },
  { id: 'silver', hex: '#D9D9D9', label: 'Silver' },
  { id: 'pink', hex: '#E56CC5', label: 'Pink' },
  { id: 'sky-blue', hex: '#77C7F2', label: 'Sky blue' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[28px] leading-[1.2] tobia-normal text-[#252525]">
      {children}
    </h3>
  )
}

function OptionSelector({
  title,
  options,
  value,
  onChange,
  columns = 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
}: {
  title: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  columns?: string
}) {
  return (
    <div className="space-y-8">
      <SectionTitle>{title}</SectionTitle>

      <div className={`grid ${columns} gap-4`}>
        {options.map((option) => {
          const isSelected = value === option.id

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`h-[66px] border text-center text-[18px] tobia-normal text-[#252525] transition-all duration-200
                ${
                  isSelected
                    ? 'border-[#E8CFC8] bg-[#F4E7E3]'
                    : 'border-[#D7D3C8] bg-transparent hover:bg-[#F8F6F0]'
                }`}
            >
              {option.label}
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
          const isLight =
            color.hex.toLowerCase() === '#f5f5f5' ||
            color.hex.toLowerCase() === '#ffffff'

          return (
            <button
              key={color.id}
              type="button"
              aria-label={color.label}
              title={color.label}
              onClick={() => onSelect(color.id)}
              className={`relative h-[32px] w-[32px] rounded-full transition-all duration-200
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

export default function DecorateSection({ decoration, onDecorChange }: Props) {
  return (
    <section id="decorate" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-[1200px] space-y-14">
        <OptionSelector
          title="Choose Baskit cover"
          options={basketCoverOptions}
          value={decoration.basketCover}
          onChange={(value) => onDecorChange('basketCover', value)}
        />

        <OptionSelector
          title="Choose ribbon style"
          options={ribbonStyles}
          value={decoration.ribbonStyle}
          onChange={(value) => onDecorChange('ribbonStyle', value)}
        />

        <OptionSelector
          title="Choose decorative fillers"
          options={decorativeFillers}
          value={decoration.decorativeFiller}
          onChange={(value) => onDecorChange('decorativeFiller', value)}
          columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        />

        <div className="grid grid-cols-1 gap-y-14 gap-x-16 lg:grid-cols-2">
          <ColorPicker
            label="Choose Baskit color"
            options={basketColors}
            selected={decoration.basketColor}
            onSelect={(value) => onDecorChange('basketColor', value)}
          />

          <ColorPicker
            label="Choose Baskit cover color"
            options={basketCoverColors}
            selected={decoration.basketCoverColor}
            onSelect={(value) => onDecorChange('basketCoverColor', value)}
          />

          <ColorPicker
            label="Choose ribbon color"
            options={ribbonColors}
            selected={decoration.ribbonColor}
            onSelect={(value) => onDecorChange('ribbonColor', value)}
          />

          <ColorPicker
            label="Decorative filler color"
            options={decorativeFillerColors}
            selected={decoration.decorativeFillerColor}
            onSelect={(value) => onDecorChange('decorativeFillerColor', value)}
          />
        </div>
      </div>
    </section>
  )
}