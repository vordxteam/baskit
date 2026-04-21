
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ── Breadcrumb ────────────────────────────────────────────────────────────────

const Breadcrumb = () => (
  <nav className="flex items-center gap-2">
    <Link href="/" className="text-[14px] font-light text-[#25252599] hover:text-[#252525] transition-colors leading-5">
      Home
    </Link>
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
      <path d="M1 1L5 5L1 9" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Link href="/product" className="text-[14px] font-light text-[#25252599] hover:text-[#252525] transition-colors leading-5">
      Shop
    </Link>
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
      <path d="M1 1L5 5L1 9" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="text-[14px] font-light text-[#252525] leading-5">
      Order your Baskit
    </span>
  </nav>
)

// ── Summary Row ───────────────────────────────────────────────────────────────

const SummaryRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string
  value: string
  isLast?: boolean
}) => (
  <div className="px-3">
    <div className={`flex items-center justify-between py-4 tobia-normal ${!isLast ? 'border-b border-[#25252520]' : ''}`}>
      <span className="text-[16px] leading-5 text-[#252525CC]">{label}</span>
      <span className="text-[16px] leading-5 text-[#252525]">{value}</span>
    </div>
  </div>
)

type BasketSummaryItem = {
  id: string
  name: string
  qty: number
  unitPrice: number
  subtotal: number
}

type BasketSummaryPayload = {
  basketType: string
  basketSize: string
  basketWrap: string
  basketCover: string
  basketColor: string
  basketCoverColor: string
  decorativeFiller: string
  decorativeFillerColor: string
  ribbonStyle: string
  ribbonColor: string
  basketWrapColor: string
  glitterColor: string
  minItems?: number
  maxItems?: number
  totalSelectedQty: number
  items: BasketSummaryItem[]
  total: number
}

const formatValue = (value: string | number | undefined) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return value || '-'
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BasketSummary() {
  const [summaryData, setSummaryData] = useState<BasketSummaryPayload | null>(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    try {
      const storedSummary = sessionStorage.getItem('basketSummary')

      if (!storedSummary) {
        setSummaryData(null)
        setLoadError('No basket summary was found. Start from the quote page to build one.')
        return
      }

      const parsedSummary = JSON.parse(storedSummary) as BasketSummaryPayload
      setSummaryData(parsedSummary)
      setLoadError('')
    } catch (error) {
      console.error('Error reading basket summary:', error)
      setSummaryData(null)
      setLoadError('Unable to read the saved basket summary.')
    }
  }, [])

  const summary = summaryData
    ? [
        { label: 'Baskit type', value: summaryData.basketType },
        { label: 'Baskit size', value: summaryData.basketSize },
        { label: 'Baskit wrap', value: summaryData.basketWrap },
        { label: 'Basket cover', value: summaryData.basketCover },
        { label: 'Baskit color', value: summaryData.basketColor },
        { label: 'Basket cover color', value: summaryData.basketCoverColor },
        { label: 'Ribbon style', value: summaryData.ribbonStyle },
        { label: 'Ribbon color', value: summaryData.ribbonColor },
        { label: 'Basket wrap color', value: summaryData.basketWrapColor },
        { label: 'Decorative filler', value: summaryData.decorativeFiller },
        { label: 'Decorative filler color', value: summaryData.decorativeFillerColor },
        { label: 'Glitter color', value: summaryData.glitterColor || '-' },
        { label: 'Minimum items', value: summaryData.minItems ?? '-' },
        { label: 'Maximum items', value: summaryData.maxItems ?? '-' },
        { label: 'Total selected quantity', value: summaryData.totalSelectedQty },
        { label: 'Total', value: summaryData.total },
      ]
    : []

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-8">

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Content */}
      <div className="flex flex-col items-center mt-10">

        {/* Illustration */}
        <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">
          <Image
            src="/images/basket-summary.png"
            fill
            alt="Bouquet illustration"
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mt-5 mb-8">
          Baskit summary
        </h1>

        {/* Summary Table */}
        <div className="w-full max-w-150 border border-[#25252520]">
          {loadError ? (
            <div className="px-4 py-6 text-[16px] leading-6 text-[#25252599]">
              {loadError}
            </div>
          ) : (
            summary.map((row, i) => (
              <SummaryRow
                key={row.label}
                label={row.label}
                value={formatValue(row.value)}
                isLast={i === summary.length - 1}
              />
            ))
          )}
        </div>

        {summaryData && summaryData.items.length > 0 ? (
          <div className="mt-10 w-full max-w-150 border border-[#25252520]">
            <div className="px-4 py-4 border-b border-[#25252520] tobia-normal text-[18px] text-[#252525]">
              Selected items
            </div>
            {summaryData.items.map((item, index) => (
              <SummaryRow
                key={item.id}
                label={`${item.name} x${item.qty}`}
                value={formatValue(item.subtotal)}
                isLast={index === summaryData.items.length - 1}
              />
            ))}
          </div>
        ) : null}

        {/* Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-4 mt-10 sm:mt-15 w-full max-w-150">
          <button
            onClick={() => history.back()}
            className="w-full sm:w-auto border border-[#252525] text-[18px] text-[#252525] px-7 py-3 hover:bg-[#f5f0e8] transition-colors"
          >
            Go back
          </button>
          <button
            onClick={() => console.log('Add to Baskit', summaryData)}
            disabled={!summaryData}
            className="w-full sm:w-auto bg-[#252525] text-white text-[18px] px-5 py-3 hover:opacity-90 transition-opacity"
          >
            Add to Baskit
          </button>
        </div>

      </div>
    </div>
  )
}