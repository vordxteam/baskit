'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addItemToCart, openCartDrawer } from '@/utils/cart'

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

// ── Main Page ─────────────────────────────────────────────────────────────────

type BouquetSummaryFlower = {
  id: string
  name: string
  qty: number
  unitPrice: number
  subtotal: number
}

type BouquetSummaryPayload = {
  bouquetTypeId?: string
  bouquetType: string
  bouquetSizeId?: string
  bouquetSizeCode?: string
  bouquetSize: string
  bouquetWrapId?: string
  bouquetWrap: string
  ribbonColor: string
  ribbonStyle: string
  bouquetWrapColor: string
  glitterColor: string
  selectedFillers?: string[]
  selectedCatalogItems?: Array<{
    catalogItemId: string
    quantity: number
  }>
  minItems?: number
  maxItems?: number
  totalSelectedQty: number
  flowers: BouquetSummaryFlower[]
  total: number
}

const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`

export default function BouqetsSummary() {
  const router = useRouter()
  const [summaryData, setSummaryData] = useState<BouquetSummaryPayload | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = sessionStorage.getItem('bouquetSummary')
    if (!raw) return

    try {
      setSummaryData(JSON.parse(raw) as BouquetSummaryPayload)
    } catch {
      setSummaryData(null)
    }
  }, [])

  const summaryRows = useMemo(() => {
    if (!summaryData) return []

    const rows: Array<{ label: string; value: string }> = [
      { label: 'Bouquet type', value: summaryData.bouquetType || '-' },
      { label: 'Bouquet size', value: summaryData.bouquetSize || '-' },
      { label: 'Bouquet wrap', value: summaryData.bouquetWrap || '-' },
      { label: 'Ribbon color', value: summaryData.ribbonColor || '-' },
      { label: 'Ribbon style', value: summaryData.ribbonStyle || '-' },
      { label: 'Bouquet wrap color', value: summaryData.bouquetWrapColor || '-' },
      { label: 'Glitter color', value: summaryData.glitterColor || '-' },
    ]

    summaryData.flowers.forEach((flower) => {
      rows.push({
        label: `${flower.name} - ${flower.qty} pieces`,
        value: formatCurrency(flower.subtotal),
      })
    })

    rows.push({ label: 'Total', value: formatCurrency(summaryData.total) })
    return rows
  }, [summaryData])

  const handleAddToBaskit = () => {
    if (!summaryData) return
    if (!summaryData.bouquetTypeId || !summaryData.bouquetWrapId || !summaryData.bouquetSizeCode) return

    const selectedCatalogItems =
      summaryData.selectedCatalogItems && summaryData.selectedCatalogItems.length > 0
        ? summaryData.selectedCatalogItems
        : summaryData.flowers.map((flower) => ({
            catalogItemId: flower.id,
            quantity: flower.qty,
          }))

    const lineId = [
      'custom',
      summaryData.bouquetTypeId,
      summaryData.bouquetWrapId,
      summaryData.bouquetSizeCode,
      summaryData.ribbonColor,
      summaryData.bouquetWrapColor,
      summaryData.glitterColor,
      selectedCatalogItems.map((item) => `${item.catalogItemId}:${item.quantity}`).join('|'),
    ]
      .filter(Boolean)
      .join('__')

    addItemToCart({
      id: lineId,
      name: `${summaryData.bouquetType || 'Customized bouquet'} (Custom)`,
      imageUrl: '/images/bouqet-summary.png',
      priceLabel: formatCurrency(summaryData.total),
      quantity: 1,
      customization: {
        bouquetTypeId: summaryData.bouquetTypeId,
        productTypeId: summaryData.bouquetTypeId,
        productStyleId: summaryData.bouquetWrapId,
        sizeCode: summaryData.bouquetSizeCode,
        sizeLabel: summaryData.bouquetSize,
        selectedFillers: summaryData.selectedFillers || [],
        selectedCatalogItems,
        productColor: summaryData.bouquetWrapColor || undefined,
        netColor: undefined,
        ribbonColor: summaryData.ribbonColor || undefined,
        decorativeColor: summaryData.glitterColor || undefined,
      },
    })

    openCartDrawer()
    router.push('/checkout')
  }

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-8">

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Content */}
      <div className="flex flex-col items-center mt-10">

        {/* Illustration */}
        <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">
          <Image
            src="/images/bouqet-summary.png"
            fill
            alt="Bouquet illustration"
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-[28px] sm:text-[32px] tobia-normal text-[#252525] mt-5 mb-8">
          Bouquet summary
        </h1>

        {!summaryData && (
          <div className="mb-8 w-full max-w-150 rounded-md border border-dashed border-[#25252533] p-4 text-sm text-[#8E8A83]">
            No bouquet summary found. Please customize your bouquet first.
          </div>
        )}

        {/* Summary Table */}
        {summaryData && (
        <div className="w-full max-w-150 border border-[#25252520]">
          {summaryRows.map((row, i) => (
            <SummaryRow
              key={i}
              label={row.label}
              value={row.value}
              isLast={i === summaryRows.length - 1}
            />
          ))}
        </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col justify-center sm:flex-row gap-4 mt-10 sm:mt-15 w-full max-w-150">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto border border-[#252525] text-[18px] text-[#252525] px-7 py-3 hover:bg-[#f5f0e8] transition-colors"
          >
            Go back
          </button>
          <button
            onClick={handleAddToBaskit}
            disabled={!summaryData?.bouquetTypeId || !summaryData?.bouquetWrapId || !summaryData?.bouquetSizeCode}
            className="w-full sm:w-auto bg-[#252525] text-white text-[18px] px-5 py-3 hover:opacity-90 transition-opacity"
          >
            Add to Baskit
          </button>
        </div>

      </div>
    </div>
  )
}