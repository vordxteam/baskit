'use client'

import { useState, useEffect } from 'react'
import Breadcrumb from '@/components/get-a-qoute/Breadcrumb'
import Sidebar from '@/components/bouqets-customization/Sidebar'
import BouqetsSize from '@/components/bouqets-customization/BouqetsSize'
import BouqetsWrap from '@/components/bouqets-customization/BouqetsWrap'
import ChooseFlowers from '@/components/bouqets-customization/ChooseFlowers'
import DecorateBouqets from '@/components/bouqets-customization/DecorateBouqets'
import BouqetsType from '@/components/bouqets-customization/BouqetsType'
const sectionIds = ['bouqet-type', 'bouqet-size', 'choose-flowers', 'decorate']

export default function BouqetsCustomizePage() {
  const [activeSection, setActiveSection] = useState('basket-type')
  const [basketType, setBasketType] = useState('')
  const [basketSize, setBasketSize] = useState('')
  const [selectedItems, setSelectedItems] = useState<{ id: number; qty: number }[]>([])
  const [decoration, setDecoration] = useState({
    basketColor: '',
    netColor: '',
    ribbonColor: '',
  })

  // Track active section on scroll
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDecorChange = (key: keyof typeof decoration, value: string) => {
    setDecoration((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 py-5">

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Layout: sidebar + content */}
      <div className="flex gap-5  lg:gap-20 mt-8">

        {/* Left Sidebar */}
        <Sidebar activeSection={activeSection} />

        {/* Sections */}
        <div className="flex-1 space-y-15">
          <BouqetsType
            selected={basketType}
            onSelect={setBasketType}
            onContinue={() => scrollTo('basket-size')}
          />

          <BouqetsSize
            selected={basketSize}
            onSelect={setBasketSize}
            onBack={() => scrollTo('basket-type')}
            onContinue={() => scrollTo('choose-items')}
          />
        <BouqetsWrap         selected={basketSize}
            onSelect={setBasketSize}
            onBack={() => scrollTo('basket-type')}
            onContinue={() => scrollTo('choose-items')} />

          <ChooseFlowers
            selected={selectedItems}
            onSelectionChange={setSelectedItems}
            onBack={() => scrollTo('basket-size')}
            onContinue={() => scrollTo('decorate')}
          />

          <DecorateBouqets
            decoration={decoration}
            onDecorChange={handleDecorChange}
            onBack={() => scrollTo('choose-items')}
            onContinue={() => console.log({ basketType, basketSize, selectedItems, decoration })}
          />
        </div>
      </div>
    </div>
  )
}
