'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/components/get-a-qoute/Breadcrumb'
import Sidebar from '@/components/bouqets-customization/Sidebar'
import BouqetsSize from '@/components/bouqets-customization/BouqetsSize'
import BouqetsWrap from '@/components/bouqets-customization/BouqetsWrap'
import ChooseFlowers from '@/components/bouqets-customization/ChooseFlowers'
import DecorateBouqets from '@/components/bouqets-customization/DecorateBouqets'
import BouqetsType from '@/components/bouqets-customization/BouqetsType'
import Button from '@/components/ui/button/Button'
import { Customization } from '@/api/customization'

const sectionIds = ['bouqet-type', 'bouqet-size', 'choose-flowers', 'decorate']

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

type BouqetTypeOption = {
  id: string
  label: string
  image?: string
}

type BouqetWrapOption = {
  id: string
  label: string
  image?: string
}

type BouqetSizeOption = {
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

type FlowerItemOption = {
  id: string
  name: string
  price?: string | number
  category: string
  image_url?: string | null
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

export default function BouqetsCustomizePage() {
  const router = useRouter()
  const [baseProductTypeId, setBaseProductTypeId] = useState('')
  const [activeSection, setActiveSection] = useState('basket-type')
  const [basketType, setBasketType] = useState('')
  const [basketSize, setBasketSize] = useState('')
  const [basketWrap, setBasketWrap] = useState('')
  const [selectedItems, setSelectedItems] = useState<{ id: string; qty: number }[]>([])
  const [bouqetTypeOptions, setBouqetTypeOptions] = useState<BouqetTypeOption[]>([])
  const [bouqetWrapOptions, setBouqetWrapOptions] = useState<BouqetWrapOption[]>([])
  const [bouqetSizeOptions, setBouqetSizeOptions] = useState<BouqetSizeOption[]>([])
  const [flowerOptions, setFlowerOptions] = useState<FlowerItemOption[]>([])
  const [isLoadingTypesAndStyles, setIsLoadingTypesAndStyles] = useState(true)
  const [isLoadingFlowers, setIsLoadingFlowers] = useState(false)
  const [typeMessage, setTypeMessage] = useState('')
  const [wrapMessage, setWrapMessage] = useState('')
  const [sizeMessage, setSizeMessage] = useState('')
  const [flowerMessage, setFlowerMessage] = useState('Select a bouquet type to load flowers.')

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

  const [decoration, setDecoration] = useState({
    ribbonStyle: 'jute-twine',
    bouquetWrapColor: 'pink',
    ribbonColor: 'white',
    glitterColor: '',
  })

  const customizationApi = new Customization()

  useEffect(() => {
    const fetchProductTypeAndSubTypes = async () => {
      try {
        setIsLoadingTypesAndStyles(true)
        setTypeMessage('')
        setWrapMessage('')
        setSizeMessage('')

        const productTypesRes =
          await customizationApi.getProductTypes<ProductTypesResponse>()

        console.log('Product Types:', productTypesRes)

        const bouquetType = productTypesRes?.data?.find(
          (item) => item.code === 'BOUQUET'
        )

        if (!bouquetType?.id) {
          setBaseProductTypeId('')
          setBouqetTypeOptions([])
          setBouqetWrapOptions([])
          setBouqetSizeOptions([])
          setTypeMessage('Bouquet types are not available right now.')
          setWrapMessage('Bouquet wraps are not available right now.')
          setSizeMessage('Bouquet sizes are not available right now.')
          return
        }

        setBaseProductTypeId(bouquetType.id)

        console.log('BOUQUET ID:', bouquetType.id)

        const subTypesRes =
          await customizationApi.getProductSubTypes<ProductSubTypesResponse>(
            bouquetType.id
          )

        const style =
          await customizationApi.getProductStyle<ProductStylesResponse>(
            bouquetType.id
          )

        const size =
          await customizationApi.getProductSize<ProductSizesResponse>(
            bouquetType.id
          )

        console.log('BOUQUET size:', size)

        const mappedSubTypes = (subTypesRes?.data || []).map((item) => ({
          id: item.id,
          label: item.name,
          image: item.image_url,
        }))
          .filter((item) => Boolean(item.id) && Boolean(item.label))

        const mappedStyles = (style?.data || []).map((item) => ({
          id: item.id,
          label: item.name,
          image: item.image_url,
        }))
          .filter((item) => Boolean(item.id) && Boolean(item.label))

        const mappedSizes = (size?.data || []).map((item) => ({
          id: item.id,
          label: item.label || item.size_code || '',
          image: getSizeImage(item.size_code, item.label),
          sizeCode: item.size_code,
          minItems: item.min_items,
          maxItems: item.max_items,
        }))
          .filter((item) => Boolean(item.id) && Boolean(item.label))

        setBouqetTypeOptions(mappedSubTypes)
        setBouqetWrapOptions(mappedStyles)
        setBouqetSizeOptions(mappedSizes)

        if (mappedSubTypes.length === 0) {
          setTypeMessage('No bouquet types found.')
        }

        if (mappedStyles.length === 0) {
          setWrapMessage('No bouquet wraps found.')
        }

        if (mappedSizes.length === 0) {
          setSizeMessage('No bouquet sizes found.')
        }
      } catch (error) {
        console.error('Error fetching product types or subtypes:', error)
        setBaseProductTypeId('')
        setBouqetTypeOptions([])
        setBouqetWrapOptions([])
        setBouqetSizeOptions([])
        setTypeMessage('Failed to load bouquet types.')
        setWrapMessage('Failed to load bouquet wraps.')
        setSizeMessage('Failed to load bouquet sizes.')
      } finally {
        setIsLoadingTypesAndStyles(false)
      }
    }

    fetchProductTypeAndSubTypes()
  }, [])

  useEffect(() => {
    const fetchCatalogItems = async () => {
      if (!basketType) {
        setIsLoadingFlowers(false)
        setFlowerOptions([])
        setSelectedItems([])
        setFlowerMessage('Select a bouquet type to load flowers.')
        return
      }

      try {
        setIsLoadingFlowers(true)
        setFlowerMessage('')

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

        setFlowerOptions(mappedItems)
        setSelectedItems((prev) => prev.filter((selected) => mappedItems.some((item) => item.id === selected.id)))

        if (mappedItems.length === 0) {
          setFlowerMessage('No flowers found for the selected bouquet type.')
        }
      } catch (error) {
        console.error('Error fetching catalog items for selected bouquet subtype:', error)
        setFlowerOptions([])
        setFlowerMessage('Failed to load flowers.')
      } finally {
        setIsLoadingFlowers(false)
      }
    }

    fetchCatalogItems()
  }, [basketType])

  const selectedSizeOption = bouqetSizeOptions.find((size) => size.id === basketSize)
  const selectedTypeOption = bouqetTypeOptions.find((type) => type.id === basketType)
  const selectedWrapOption = bouqetWrapOptions.find((wrap) => wrap.id === basketWrap)
  const totalSelectedQty = selectedItems.reduce((sum, item) => sum + item.qty, 0)
  const hasMinItems = typeof selectedSizeOption?.minItems === 'number'
  const hasMaxItems = typeof selectedSizeOption?.maxItems === 'number'
  const isWithinMin = hasMinItems ? totalSelectedQty >= (selectedSizeOption?.minItems || 0) : true
  const isWithinMax = hasMaxItems ? totalSelectedQty <= (selectedSizeOption?.maxItems || Number.MAX_SAFE_INTEGER) : true
  const isItemsValid = isWithinMin && isWithinMax
  const canContinue = Boolean(baseProductTypeId) && Boolean(basketType) && Boolean(basketSize) && Boolean(basketWrap) && selectedItems.length > 0 && isItemsValid

  const handleSelectionChangeWithLimits = (nextItems: { id: string; qty: number }[]) => {
    if (!hasMaxItems) {
      setSelectedItems(nextItems)
      return
    }

    const maxAllowed = selectedSizeOption?.maxItems || Number.MAX_SAFE_INTEGER
    const nextTotal = nextItems.reduce((sum, item) => sum + item.qty, 0)

    if (nextTotal > maxAllowed) {
      return
    }

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
    if (!basketType || !basketSize || !basketWrap || selectedItems.length === 0 || !isItemsValid) {
      return
    }

    const flowerRows = selectedItems
      .map((selected) => {
        const flower = flowerOptions.find((item) => item.id === selected.id)
        if (!flower) return null

        const unitPrice = parsePrice(flower.price)
        const subtotal = unitPrice * selected.qty

        return {
          id: flower.id,
          name: flower.name,
          qty: selected.qty,
          unitPrice,
          subtotal,
        }
      })
      .filter((item): item is { id: string; name: string; qty: number; unitPrice: number; subtotal: number } => item !== null)

    const total = flowerRows.reduce((sum, item) => sum + item.subtotal, 0)

    const payload = {
      bouquetTypeId: baseProductTypeId,
      bouquetSubTypeId: selectedTypeOption?.id || '',
      bouquetType: selectedTypeOption?.label || '',
      bouquetSizeId: selectedSizeOption?.id || '',
      bouquetSizeCode: selectedSizeOption?.sizeCode || '',
      bouquetSize: selectedSizeOption?.label || '',
      bouquetWrapId: selectedWrapOption?.id || '',
      bouquetWrap: selectedWrapOption?.label || '',
      ribbonStyle: decoration.ribbonStyle,
      ribbonColor: decoration.ribbonColor,
      bouquetWrapColor: decoration.bouquetWrapColor,
      glitterColor: decoration.glitterColor,
      selectedFillers: [] as string[],
      selectedCatalogItems: flowerRows.map((item) => ({
        catalogItemId: item.id,
        quantity: item.qty,
      })),
      minItems: selectedSizeOption?.minItems,
      maxItems: selectedSizeOption?.maxItems,
      totalSelectedQty,
      flowers: flowerRows,
      total,
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bouquetSummary', JSON.stringify(payload))
    }

    router.push('/bouqets-summary')
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
    key: 'ribbonStyle' | 'bouquetWrapColor' | 'ribbonColor' | 'glitterColor',
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
      <div className="flex gap-5  lg:gap-20 mt-8">

        {/* Left Sidebar */}
        <Sidebar activeSection={activeSection} />

        {/* Sections */}
        <div className="flex-1 space-y-15">
          <BouqetsType
            selected={basketType}
            onSelect={setBasketType}
            onContinue={() => scrollTo('basket-size')}
            options={bouqetTypeOptions}
            isLoading={isLoadingTypesAndStyles}
            message={typeMessage}
          />

          <BouqetsSize
            selected={basketSize}
            onSelect={setBasketSize}
            onBack={() => scrollTo('basket-type')}
            onContinue={() => scrollTo('choose-items')}
            options={bouqetSizeOptions}
            isLoading={isLoadingTypesAndStyles}
            message={sizeMessage}
          />
          
          <BouqetsWrap selected={basketWrap}
            onSelect={setBasketWrap}
            onBack={() => scrollTo('basket-type')}
            onContinue={() => scrollTo('choose-items')}
            options={bouqetWrapOptions}
            isLoading={isLoadingTypesAndStyles}
            message={wrapMessage}
          />

          <DecorateBouqets
            decoration={decoration}
            onDecorChange={handleDecorChange}
          />

          <ChooseFlowers
            items={flowerOptions}
            selected={selectedItems}
            onSelectionChange={handleSelectionChangeWithLimits}
            onBack={() => scrollTo('basket-size')}
            onContinue={() => scrollTo('decorate')}
            isLoading={isLoadingFlowers}
            message={flowerMessage}
            minItems={selectedSizeOption?.minItems}
            maxItems={selectedSizeOption?.maxItems}
          />

          {/* Go back / Continue */}
          <div className="flex items-center justify-between mt-15">
            <Button variant='outline'>
              Go back
            </Button>

            <Button variant='primary' onClick={handleContinue} disabled={!canContinue}>
              Continue
            </Button>

          </div>


        </div>
      </div>
    </div>
  )
}
