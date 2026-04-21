export const CART_STORAGE_KEY = 'baskit-cart'
export const CART_UPDATED_EVENT = 'baskit-cart-updated'
export const CART_OPEN_EVENT = 'baskit-cart-open'

export type CartItem = {
  id: string
  name: string
  imageUrl: string | null
  priceLabel: string
  unitPrice: number
  quantity: number
  customization?: CartItemCustomization
}

export type CartItemCustomization = {
  // Predefined product flow
  productId?: string
  productSizeId?: string

  // Customized flow
  bouquetTypeId?: string
  productTypeId?: string
  productStyleId?: string

  sizeCode?: string
  sizeLabel?: string

  filler?: string
  selectedFillers?: string[]
  selectedCatalogItems?: Array<{
    catalogItemId: string
    quantity: number
  }>

  productColor?: string
  netColor?: string
  ribbonColor?: string
  decorativeColor?: string
}

export type CartItemInput = {
  id: string
  name: string
  imageUrl?: string | null
  priceLabel: string
  quantity?: number
  customization?: CartItemCustomization
}

export const getCartSelectionEntries = (customization?: CartItemCustomization) => {
  if (!customization) return []

  return [
    {
      label: 'Size',
      value: customization.sizeLabel || customization.sizeCode,
    },
    {
      label: 'Filler',
      value: customization.filler,
    },
    {
      label: 'Baskit color',
      value: customization.productColor,
    },
    {
      label: 'Net color',
      value: customization.netColor,
    },
    {
      label: 'Ribbon color',
      value: customization.ribbonColor,
    },
    {
      label: 'Decorative color',
      value: customization.decorativeColor,
    },
  ].filter((entry): entry is { label: string; value: string } => Boolean(entry.value))
}

export const normalizeImageUrl = (url?: string | null) => {
  if (!url) return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
  return `${apiBase}${url.startsWith('/') ? url : `/${url}`}`
}

export const parsePriceValue = (priceLabel: string) => {
  const numeric = priceLabel.replace(/[^0-9.]/g, '')
  const parsed = Number.parseFloat(numeric)
  return Number.isFinite(parsed) ? parsed : 0
}

export const formatPrice = (value: number) => {
  const formatted = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)

  return `PKR ${formatted}`
}

export const readCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const writeCartItems = (items: CartItem[]) => {
  if (typeof window === 'undefined') return

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}

export const openCartDrawer = () => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event(CART_OPEN_EVENT))
}

export const addItemToCart = (input: CartItemInput) => {
  const currentItems = readCartItems()
  const quantityToAdd = input.quantity ?? 1
  const existingItem = currentItems.find((item) => item.id === input.id)
  const unitPrice = parsePriceValue(input.priceLabel)

  const nextItems = existingItem
    ? currentItems.map((item) =>
        item.id === input.id
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      )
    : [
        ...currentItems,
        {
          id: input.id,
          name: input.name,
          imageUrl: normalizeImageUrl(input.imageUrl),
          priceLabel: input.priceLabel,
          unitPrice,
          quantity: quantityToAdd,
          customization: input.customization,
        },
      ]

  writeCartItems(nextItems)
  return nextItems
}

export const updateCartItemQuantity = (id: string, quantity: number) => {
  const nextItems = readCartItems()
    .map((item) => (item.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0)

  writeCartItems(nextItems)
  return nextItems
}

export const removeCartItem = (id: string) => {
  const nextItems = readCartItems().filter((item) => item.id !== id)
  writeCartItems(nextItems)
  return nextItems
}

export const clearCartItems = () => {
  writeCartItems([])
}

export const getCartSubtotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)

export const getCartItemCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0)