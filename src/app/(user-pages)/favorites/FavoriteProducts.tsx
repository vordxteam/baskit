'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/button/Button'
import Pagination from '@/components/ui/Pagination'
import { Favourite, type FavouriteProduct } from '@/api/favourite'
import ImageWithEmptyState from '@/components/ui/ImageWithEmptyState'
import { normalizeImageUrl } from '@/utils/cart'
import { useRouter } from 'next/navigation'

const ITEMS_PER_PAGE = 12
const FAVORITES_UPDATED_EVENT = 'favorites-updated'

// ---------- Custom Select ----------
type SelectOption = { label: string; value: string }

const CustomSelect = ({
  options,
  value,
  onChange,
}: {
  options: SelectOption[]
  value: string
  onChange: (val: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 px-3 py-2.5 border border-[#2525253D] bg-[#FFFFFF66] text-[#252525] text-[13px] min-w-[130px] justify-between hover:border-[#252525] transition-colors duration-200"
      >
        <span>{selected?.label}</span>
        <svg
          className={`w-3.5 h-3.5 text-[#252525] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="absolute right-0 top-full mt-1 bg-white border border-[#25252526] z-20 min-w-full shadow-sm">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#f5ede4] transition-colors duration-150 ${
                  opt.value === value ? 'text-[#252525] font-medium' : 'text-[#252525CC]'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ---------- Sort Icon Button ----------
const SortToggle = ({ asc, onToggle }: { asc: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="flex items-center justify-center w-11 h-10 py-2 px-3 border border-[#2525253D] bg-[#FFFFFF66] hover:border-[#252525] transition-colors duration-200"
    title={asc ? 'Sort ascending' : 'Sort descending'}
  >
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[#252525]">
      <path d="M5 3v10M5 13l-2-2M5 13l2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 13V3M11 3L9 5M11 3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
        style={{ opacity: asc ? 1 : 0.35 }}
      />
    </svg>
  </button>
)

// ---------- Product Card ----------
const ProductCard = ({
  product,
  onToggleFavourite,
  isUpdating,
}: {
  product: FavouriteProduct
  onToggleFavourite: (productId: string) => void
  isUpdating: boolean
}) => {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 group">
      <div className="relative flex h-80 w-full items-center justify-center overflow-hidden px-3 py-5 transition-all duration-300 group-hover:bg-[#ebd9c7] sm:h-[280px] lg:h-80">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <div className="relative h-full w-full">
            <button
              type="button"
              disabled={isUpdating}
              onClick={(e) => {
                e.preventDefault()
                onToggleFavourite(product.id)
              }}
              aria-label="Remove from favourites"
              className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center transition-transform duration-200 hover:scale-110 ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="#e05c5c"
                stroke="#e05c5c"
                strokeWidth="1.5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <ImageWithEmptyState
              src={normalizeImageUrl(product.image_url)}
              alt={product.name}
              className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </Link>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-[18px] sm:text-[20px] font-medium text-[#252525]">
          {product.name}
        </h3>
        <p className="text-[#252525CC] text-[13px] sm:text-[14px] leading-5">
          {product.short_description ?? ''}
        </p>
      </div>

      <p className="text-[18px] sm:text-[20px] font-semibold text-[#252525]">
        {product.price}
      </p>

      <div className="w-full">
        <Button variant="primary" className="w-full" onClick={() => router.push(`/product/${product.id}`)}>
          Add to Baskit
        </Button>
      </div>
    </div>
  )
}

// ---------- Sort & Filter helpers ----------
const SORT_OPTIONS: SelectOption[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A–Z', value: 'name_asc' },
]

const parsePKR = (price: string) =>
  parseInt(price.replace(/[^0-9]/g, ''), 10) || 0

const sortProducts = (list: FavouriteProduct[], sort: string): FavouriteProduct[] => {
  const copy = [...list]
  if (sort === 'price_asc') return copy.sort((a, b) => parsePKR(a.price) - parsePKR(b.price))
  if (sort === 'price_desc') return copy.sort((a, b) => parsePKR(b.price) - parsePKR(a.price))
  if (sort === 'name_asc') return copy.sort((a, b) => a.name.localeCompare(b.name))
  return copy // newest = default order
}

// ---------- FavoriteProducts ----------
export default function FavoriteProducts() {
  const favouriteApi = new Favourite()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  const [priceAsc, setPriceAsc] = useState(true)
  const [favouriteProducts, setFavouriteProducts] = useState<FavouriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchFavourites = async () => {
    try {
      setLoading(true)
      const res = await favouriteApi.getFavourites()
      setFavouriteProducts(Array.isArray(res) ? res : [])
      window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT))
    } catch (error) {
      console.error('Failed to fetch favourite products:', error)
      setFavouriteProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavourites()
  }, [])

  const handleSortChange = (val: string) => {
    setSortBy(val)
    setCurrentPage(1)
  }

  const handleSortToggle = () => {
    setPriceAsc((v) => !v)
    setSortBy((prev) => {
      if (prev === 'price_asc') return 'price_desc'
      if (prev === 'price_desc') return 'price_asc'
      return prev
    })
    setCurrentPage(1)
  }

  const handleToggleFavourite = async (productId: string) => {
    try {
      setUpdatingId(productId)
      await favouriteApi.addToFavourites(productId)
      await fetchFavourites()
    } catch (error) {
      console.error('Failed to update favourite product:', error)
    } finally {
      setUpdatingId((prev) => (prev === productId ? null : prev))
    }
  }

  const sorted = sortProducts(favouriteProducts, sortBy)

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)

  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto">

      {/* Breadcrumbs — no horizontal padding */}
      <nav className="py-4 px-10">
        <ol className="flex items-center gap-2 text-[13px] text-[#252525CC]">
          <li>
            <Link href="/" className="hover:text-[#252525] text-[#25252599] font-light text-[14px] transition-colors">
              Home
            </Link>
          </li>
          <li>
            <svg viewBox="0 0 6 10" fill="none" className="w-1.5 h-2.5 inline-block">
              <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
          <li className="text-[#252525] font-medium text-[14px] leading-5">Favourites</li>
        </ol>
      </nav>

      {/* Main content — px-[120px] */}
      <div className="px-[120px] py-10">

        {/* Page heading */}
        <h1 className="text-[#252525] tobia-normal text-[40px] leading-tight mb-15">
          Favorites
        </h1>

        {/* Sub-header: count + filters */}
        <div className="flex items-center justify-between mb-10">
          <p className="text-[#252525] tobia-normal text-[26px] leading-8">
            All products ({sorted.length})
          </p>

          <div className="flex items-center gap-2">
            {/* <CustomSelect
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={handleCategoryChange}
            /> */}
            <CustomSelect
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortChange}
            />
            <SortToggle asc={priceAsc} onToggle={handleSortToggle} />
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-[#252525CC]">
            Loading favourites...
          </div>
        )}

        {/* Empty state */}
        {!loading && sorted.length === 0 && (
          <div className="text-center py-20 text-[#252525CC]">
            No products found.
          </div>
        )}

        {/* Grid */}
        {!loading && sorted.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 sm:gap-y-12 lg:gap-y-16">
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onToggleFavourite={handleToggleFavourite}
                  isUpdating={updatingId === product.id}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}