'use client'

import ProductListing from '@/components/ProductListing'

export default function HamperPage() {
  return <ProductListing title="Top Selling" initialFilters={{ topselling: true }} />
}