'use client'

const sections = [
  { id: 'bouqet-type', label: 'Choose your bouquet type' },
  { id: 'bouqet-size', label: 'Choose your bouquet size' },
  { id: 'choose-flowers', label: 'Choose your flowers' },
  { id: 'decorate', label: 'Decorate your bouquet' },
]

export default function Sidebar({ activeSection }: { activeSection: string }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="hidden lg:flex flex-col gap-4 sticky mt-4  w-full max-w-[213px] shrink-0">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className={`text-left text-[18px] tobia-normal leading-6 transition-colors
            ${activeSection === s.id ? 'text-[#252525]' : 'text-[#252525CC] hover:text-[#252525]'}
          `}
        >
          {s.label}
        </button>
      ))}
    </aside>
  )
}