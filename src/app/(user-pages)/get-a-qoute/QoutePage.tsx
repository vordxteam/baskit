'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/components/get-a-qoute/Breadcrumb'
import SidebarNav from '@/components/get-a-qoute/SidebarNav'
import BasketTypeSection from '@/components/get-a-qoute/BasketTypeSection'
import BasketSizeSection from '@/components/get-a-qoute/BasketSizeSection'
import ChooseItemsSection from '@/components/get-a-qoute/ChooseItemsSection'
import DecorateSection from '@/components/get-a-qoute/DecorateSection'
import Button from '@/components/ui/button/Button'
import { Customization } from '@/api/customization'
import BasketWrapSection from '@/components/get-a-qoute/BasketWrapSection'

const sectionIds = ['basket-type', 'basket-size', 'basket-wrap', 'choose-items', 'decorate']

type ProductTypeItem = {
  id: string
  code: string
  name: string
  description?: string
}

type ProductTypesResponse = {
  success: boolean
  data: ProductTypeItem[]
}

type ProductSubTypeItem = {
  id: string
  code: string
  name: string
  image_url?: string
  description?: string
}

type ProductSubTypesResponse = {
  success: boolean
  data: ProductSubTypeItem[]
}

type ProductStyleItem = {
  id: string
  name: string
  image_url?: string
}

type ProductStylesResponse = {
  success: boolean
  data: ProductStyleItem[]
}

type ProductSizeItem = {
  id: string
  size_code?: string
  label?: string
  min_items?: number
  max_items?: number
}

type ProductSizesResponse = {
  success: boolean
  data: ProductSizeItem[]
}

type BasketTypeOption = {
  id: string
  label: string
  image?: string
}

type BasketWrapOption = {
  id: string
  label: string
  image?: string
}

type BasketSizeOption = {
  id: string
  label: string
  image: string
  sizeCode?: string
  minItems?: number
  maxItems?: number
}

type CatalogItemLike = {
  id?: string
  name?: string
  price?: string | number
  type?: string
  image_url?: string | null
}

type QuoteItem = {
  id: string
  name: string
  price?: string | number
  category: string
  image_url?: string | null
}

type DecorationState = {
  basketCover: string
  ribbonStyle: string
  decorativeFiller: string
  basketColor: string
  basketCoverColor: string
  ribbonColor: string
  decorativeFillerColor: string
  basketWrapColor: string
  glitterColor: string
}

type BasketSummaryItem = {
  id: string
  name: string
  qty: number
  unitPrice: number
  subtotal: number
}

type BasketSummaryPayload = {
  basketTypeId: string
  basketSubTypeId: string
  basketType: string
  basketSizeId: string
  basketSizeCode: string
  basketSize: string
  basketWrapId: string
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
  selectedCatalogItems: Array<{ catalogItemId: string; quantity: number }>
  minItems?: number
  maxItems?: number
  totalSelectedQty: number
  items: BasketSummaryItem[]
  total: number
}

const extractList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[]

  if (payload && typeof payload === 'object') {
    const obj = payload as { data?: unknown }
    if (Array.isArray(obj.data)) return obj.data as T[]

    if (obj.data && typeof obj.data === 'object') {
      const nested = obj.data as { data?: unknown }
      if (Array.isArray(nested.data)) return nested.data as T[]
    }
  }

  return []
}

const sizeImageByCode: Record<string, string> = {
  S: '/images/sm1.svg',
  M: '/images/sm2.svg',
  L: '/images/sm3.svg',
  XL: '/images/sm4.svg',
}

const getSizeImage = (sizeCode?: string, label?: string) => {
  const normalizedCode = (sizeCode || '').toUpperCase()
  if (sizeImageByCode[normalizedCode]) return sizeImageByCode[normalizedCode]

  const normalizedLabel = (label || '').toLowerCase()
  if (normalizedLabel.includes('small')) return '/images/sm1.svg'
  if (normalizedLabel.includes('medium')) return '/images/sm2.svg'
  if (normalizedLabel.includes('large') && normalizedLabel.includes('x')) return '/images/sm4.svg'
  if (normalizedLabel.includes('large')) return '/images/sm3.svg'
  return '/images/sm3.svg'
}

export default function QuotePage() {
  const router = useRouter()
  const [baseProductTypeId, setBaseProductTypeId] = useState('')
  const [activeSection, setActiveSection] = useState('basket-type')
  const [basketType, setBasketType] = useState('')
  const [basketSize, setBasketSize] = useState('')
  const [basketWrap, setBasketWrap] = useState('')
  const [selectedItems, setSelectedItems] = useState<{ id: string; qty: number }[]>([])
  const [basketTypeOptions, setBasketTypeOptions] = useState<BasketTypeOption[]>([])
  const [basketWrapOptions, setBasketWrapOptions] = useState<BasketWrapOption[]>([])
  const [basketSizeOptions, setBasketSizeOptions] = useState<BasketSizeOption[]>([])
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [isLoadingTypesAndStyles, setIsLoadingTypesAndStyles] = useState(true)
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [typeMessage, setTypeMessage] = useState('')
  const [wrapMessage, setWrapMessage] = useState('')
  const [sizeMessage, setSizeMessage] = useState('')
  const [itemMessage, setItemMessage] = useState('Select a basket type to load items.')

  const [decoration, setDecoration] = useState<DecorationState>({
    basketCover: 'net',
    ribbonStyle: 'jute-twine',
    decorativeFiller: 'shredded-paper',
    basketColor: 'brown',
    basketCoverColor: 'pink',
    basketWrapColor: 'pink',
    ribbonColor: 'white',
    decorativeFillerColor: 'yellow',
    glitterColor: '',
  })

  const customizationApi = new Customization()

  // Fetch product type (BASKET), subtypes, styles, sizes on mount
  useEffect(() => {
    const fetchProductTypeAndSubTypes = async () => {
      try {
        setIsLoadingTypesAndStyles(true)
        setTypeMessage('')
        setWrapMessage('')
        setSizeMessage('')

        const productTypesRes = await customizationApi.getProductTypes<ProductTypesResponse>()

        console.log('Product Types:', productTypesRes)

        const basketType = productTypesRes?.data?.find(
          (item) => item.code === 'BASKET'
        )

        if (!basketType?.id) {
          setBaseProductTypeId('')
          setBasketTypeOptions([])
          setBasketWrapOptions([])
          setBasketSizeOptions([])
          setTypeMessage('Basket types are not available right now.')
          setWrapMessage('Basket wraps are not available right now.')
          setSizeMessage('Basket sizes are not available right now.')
          return
        }

        setBaseProductTypeId(basketType.id)

        console.log('BASKET ID:', basketType.id)

        const subTypesRes =
          await customizationApi.getProductSubTypes<ProductSubTypesResponse>(basketType.id)

        const style =
          await customizationApi.getProductStyle<ProductStylesResponse>(basketType.id)

        const size =
          await customizationApi.getProductSize<ProductSizesResponse>(basketType.id)

        const container =
          await customizationApi.getContainer<ProductSizesResponse>(basketType.id)

        console.log('BASKET size:', size)

        const mappedSubTypes = (subTypesRes?.data || [])
          .map((item) => ({
            id: item.id,
            label: item.name,
            image: item.image_url,
          }))
          .filter((item) => Boolean(item.id) && Boolean(item.label))

        const mappedStyles = (style?.data || [])
          .map((item) => ({
            id: item.id,
            label: item.name,
            image: item.image_url,
          }))
          .filter((item) => Boolean(item.id) && Boolean(item.label))

        const mappedSizes = (size?.data || [])
          .map((item) => ({
            id: item.id,
            label: item.label || item.size_code || '',
            image: getSizeImage(item.size_code, item.label),
            sizeCode: item.size_code,
            minItems: item.min_items,
            maxItems: item.max_items,
          }))
          .filter((item) => Boolean(item.id) && Boolean(item.label))

        setBasketTypeOptions(mappedSubTypes)
        setBasketWrapOptions(mappedStyles)
        setBasketSizeOptions(mappedSizes)

        if (mappedSubTypes.length === 0) setTypeMessage('No basket types found.')
        if (mappedStyles.length === 0) setWrapMessage('No basket wraps found.')
        if (mappedSizes.length === 0) setSizeMessage('No basket sizes found.')
      } catch (error) {
        console.error('Error fetching product types or subtypes:', error)
        setBaseProductTypeId('')
        setBasketTypeOptions([])
        setBasketWrapOptions([])
        setBasketSizeOptions([])
        setTypeMessage('Failed to load basket types.')
        setWrapMessage('Failed to load basket wraps.')
        setSizeMessage('Failed to load basket sizes.')
      } finally {
        setIsLoadingTypesAndStyles(false)
      }
    }

    fetchProductTypeAndSubTypes()
  }, [])

  // Fetch catalog items whenever basketType (subtype id) changes
  useEffect(() => {
    const fetchCatalogItems = async () => {
      if (!basketType) {
        setIsLoadingItems(false)
        setQuoteItems([])
        setSelectedItems([])
        setItemMessage('Select a basket type to load items.')
        return
      }

      try {
        setIsLoadingItems(true)
        setItemMessage('')

        const itemsResponse = await customizationApi.getCatalogItems<unknown>(basketType)
        const mappedItems = extractList<CatalogItemLike>(itemsResponse)
          .map((item) => ({
            id: item.id || '',
            name: item.name || '',
            price: item.price,
            category: item.type || '',
            image_url: item.image_url ?? null,
          }))
          .filter((item) => Boolean(item.id) && Boolean(item.name))

        setQuoteItems(mappedItems)
        setSelectedItems((prev) =>
          prev.filter((selected) => mappedItems.some((item) => item.id === selected.id))
        )

        if (mappedItems.length === 0) {
          setItemMessage('No items found for the selected basket type.')
        }
      } catch (error) {
        console.error('Error fetching catalog items for selected basket subtype:', error)
        setQuoteItems([])
        setItemMessage('Failed to load items.')
      } finally {
        setIsLoadingItems(false)
      }
    }

    fetchCatalogItems()
  }, [basketType])

  const selectedSizeOption = basketSizeOptions.find((size) => size.id === basketSize)
  const selectedTypeOption = basketTypeOptions.find((type) => type.id === basketType)
  const selectedWrapOption = basketWrapOptions.find((wrap) => wrap.id === basketWrap)
  const totalSelectedQty = selectedItems.reduce((sum, item) => sum + item.qty, 0)
  const hasMinItems = typeof selectedSizeOption?.minItems === 'number'
  const hasMaxItems = typeof selectedSizeOption?.maxItems === 'number'
  const isWithinMin = hasMinItems ? totalSelectedQty >= (selectedSizeOption?.minItems || 0) : true
  const isWithinMax = hasMaxItems ? totalSelectedQty <= (selectedSizeOption?.maxItems || Number.MAX_SAFE_INTEGER) : true
  const isItemsValid = isWithinMin && isWithinMax

  const canContinue =
    Boolean(baseProductTypeId) &&
    Boolean(basketType) &&
    Boolean(basketSize) &&
    Boolean(basketWrap) &&
    selectedItems.length > 0 &&
    isItemsValid

  const handleSelectionChangeWithLimits = (nextItems: { id: string; qty: number }[]) => {
    if (!hasMaxItems) {
      setSelectedItems(nextItems)
      return
    }

    const maxAllowed = selectedSizeOption?.maxItems || Number.MAX_SAFE_INTEGER
    const nextTotal = nextItems.reduce((sum, item) => sum + item.qty, 0)

    if (nextTotal > maxAllowed) return

    setSelectedItems(nextItems)
  }

  const parsePrice = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const normalized = value.replace(/[^0-9.]/g, '')
      const parsed = Number(normalized)
      return Number.isFinite(parsed) ? parsed : 0
    }
    return 0
  }

  const handleContinue = () => {
    if (!basketType || !basketSize || !basketWrap || selectedItems.length === 0 || !isItemsValid) return

    const itemRows = selectedItems
      .map((selected) => {
        const item = quoteItems.find((i) => i.id === selected.id)
        if (!item) return null

        const unitPrice = parsePrice(item.price)
        const subtotal = unitPrice * selected.qty

        return {
          id: item.id,
          name: item.name,
          qty: selected.qty,
          unitPrice,
          subtotal,
        }
      })
      .filter(
        (item): item is { id: string; name: string; qty: number; unitPrice: number; subtotal: number } =>
          item !== null
      )

    const total = itemRows.reduce((sum, item) => sum + item.subtotal, 0)

    const payload: BasketSummaryPayload = {
      basketTypeId: baseProductTypeId,
      basketSubTypeId: selectedTypeOption?.id || '',
      basketType: selectedTypeOption?.label || '',
      basketSizeId: selectedSizeOption?.id || '',
      basketSizeCode: selectedSizeOption?.sizeCode || '',
      basketSize: selectedSizeOption?.label || '',
      basketWrapId: selectedWrapOption?.id || '',
      basketWrap: selectedWrapOption?.label || '',
      basketCover: decoration.basketCover,
      basketColor: decoration.basketColor,
      basketCoverColor: decoration.basketCoverColor,
      decorativeFiller: decoration.decorativeFiller,
      decorativeFillerColor: decoration.decorativeFillerColor,
      ribbonStyle: decoration.ribbonStyle,
      ribbonColor: decoration.ribbonColor,
      basketWrapColor: decoration.basketWrapColor,
      glitterColor: decoration.glitterColor,
      selectedCatalogItems: itemRows.map((item) => ({
        catalogItemId: item.id,
        quantity: item.qty,
      })),
      minItems: selectedSizeOption?.minItems,
      maxItems: selectedSizeOption?.maxItems,
      totalSelectedQty,
      items: itemRows,
      total,
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('basketSummary', JSON.stringify(payload))
    }

    router.push('/basket-summary')
  }

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

  const handleDecorChange = (
    key: keyof DecorationState,
    value: string
  ) => {
    setDecoration((prev) => ({
      ...prev,
      [key]: prev[key] === value && key === 'glitterColor' ? '' : value,
    }))
  }

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 py-5">

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Layout: sidebar + content */}
      <div className="flex gap-5 lg:gap-20 mt-8">

        {/* Left Sidebar */}
        <SidebarNav activeSection={activeSection} />

        {/* Sections */}
        <div className="flex-1 space-y-15">


          <BasketWrapSection
            selected={basketWrap}
            onSelect={setBasketWrap}
            onBack={() => scrollTo('basket-size')}
            onContinue={() => scrollTo('choose-items')}
            options={basketWrapOptions}
            isLoading={isLoadingTypesAndStyles}
            message={wrapMessage}
          />

          <BasketTypeSection
            selected={basketType}
            onSelect={setBasketType}
            onContinue={() => scrollTo('basket-size')}
            options={basketTypeOptions}
            isLoading={isLoadingTypesAndStyles}
            message={typeMessage}
          />

          <BasketSizeSection
            selected={basketSize}
            onSelect={setBasketSize}
            onBack={() => scrollTo('basket-type')}
            onContinue={() => scrollTo('basket-wrap')}
            options={basketSizeOptions}
            isLoading={isLoadingTypesAndStyles}
            message={sizeMessage}
          />



          <DecorateSection
            decoration={decoration}
            onDecorChange={handleDecorChange}
          />

          <ChooseItemsSection
            items={quoteItems}
            selected={selectedItems}
            onSelectionChange={handleSelectionChangeWithLimits}
            onBack={() => scrollTo('basket-size')}
            onContinue={() => scrollTo('decorate')}
            isLoading={isLoadingItems}
            message={itemMessage}
            minItems={selectedSizeOption?.minItems}
            maxItems={selectedSizeOption?.maxItems}
          />

          {/* Go back / Continue */}
          <div className="flex items-center justify-between mt-15">
            <Button variant="outline">Go back</Button>
            <Button variant="primary" onClick={handleContinue} disabled={!canContinue}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}