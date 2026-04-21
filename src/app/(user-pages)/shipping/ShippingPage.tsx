'use client'

import { Fragment, useMemo, useState } from 'react'
import Link from 'next/link'
import ImageWithEmptyState from '@/components/ui/ImageWithEmptyState'
import { formatPrice, getCartSelectionEntries } from '@/utils/cart'
import { useCart } from '@/hooks/useCart'
import { OrderApi } from '@/api/order'
import type { PaymentMethod, PlaceOrderData, PlaceOrderPayload, PlaceOrderResponse } from '@/api/order/types'
import { clearGreetingDraft, readGreetingDraft, type GreetingCardDraft } from '@/utils/orderDraft'
import { ApiError, ValidationError } from '@/api/core/errors'
import { useRouter } from 'next/navigation'

type ShippingForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  postalCode: string
  deliveryType: 'instant' | 'scheduled'
  deliveryDate: string
  deliveryTime: string
  paymentMethod: PaymentMethod
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cvc: string
  discountCode: string
  agreeTerms: boolean
  billingSame: boolean
}

const DELIVERY_CHARGE = 150

const parseMoney = (value?: string) => {
  if (!value) return 0
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const extractOrderErrorMessage = (error: unknown) => {
  if (error instanceof ValidationError) {
    const firstFieldError = Object.values(error.errors || {})
      .find((messages) => Array.isArray(messages) && messages.length > 0)?.[0]
    return firstFieldError || error.message || error.getUserMessage()
  }

  if (error instanceof ApiError) {
    const detailedMessage =
      typeof error.details === 'string'
        ? error.details
        : typeof error.details?.message === 'string'
          ? error.details.message
          : ''

    return detailedMessage || error.message || error.getUserMessage()
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Failed to place order. Please try again.'
}

const initialForm: ShippingForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  postalCode: '',
  deliveryType: 'instant',
  deliveryDate: '',
  deliveryTime: '',
  paymentMethod: 'CARD',
  cardNumber: '',
  cardholderName: '',
  expiryDate: '',
  cvc: '',
  discountCode: '',
  agreeTerms: false,
  billingSame: false,
}

const ShippingPage = () => {
  const orderApi = useMemo(() => new OrderApi(), [])
  const { items, subtotal, totalItems, clearCart } = useCart()
  const [form, setForm] = useState<ShippingForm>(initialForm)
  const [greetingDraftByLineId] = useState<Record<string, GreetingCardDraft>>(() => readGreetingDraft())
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<PlaceOrderData | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const orderTotal = useMemo(() => subtotal + DELIVERY_CHARGE, [subtotal])

  const getCustomizedProductTypeId = (item: (typeof items)[number]) => {
    return item.customization?.bouquetTypeId || item.customization?.productTypeId || ''
  }

  const isCustomizedItem = (item: (typeof items)[number]) => {
    const customization = item.customization
    return Boolean(
      getCustomizedProductTypeId(item) &&
      customization?.productStyleId &&
      customization?.sizeCode
    )
  }

  const isPredefinedItem = (item: (typeof items)[number]) => {
    const customization = item.customization
    return Boolean(
      customization?.productId || item.id.split('__')[0]
    )
  }

  const setField = <K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    if (!form.email.trim()) nextErrors.email = 'Required'
    if (!form.phone.trim()) nextErrors.phone = 'Required'
    if (!form.country) nextErrors.country = 'Required'
    if (!form.city) nextErrors.city = 'Required'
    if (!form.address.trim()) nextErrors.address = 'Required'
    if (!form.postalCode.trim()) nextErrors.postalCode = 'Required'
    if (form.deliveryType === 'scheduled' && !form.deliveryDate.trim()) nextErrors.deliveryDate = 'Required'
    if (form.deliveryType === 'scheduled' && !form.deliveryTime.trim()) nextErrors.deliveryTime = 'Required'
    if (!form.agreeTerms) nextErrors.agreeTerms = 'Required'



    const hasCustomizedItems = items.some((item) => isCustomizedItem(item))
    const hasPredefinedItems = items.some((item) => !isCustomizedItem(item) && isPredefinedItem(item))

    if (hasCustomizedItems && hasPredefinedItems) {
      nextErrors.mixedCart = 'Customized and predefined products cannot be ordered together.'
    }

    items.forEach((item) => {
      const greeting = greetingDraftByLineId[item.id]
      const isCustomized = isCustomizedItem(item)

      if (isCustomized) {
        const selectedCatalogItems = item.customization?.selectedCatalogItems || []
        const productTypeId = getCustomizedProductTypeId(item)

        if (!productTypeId) {
          nextErrors[`item-type-${item.id}`] = `Missing product type for ${item.name}`
        }

        if (!item.customization?.productStyleId) {
          nextErrors[`item-style-${item.id}`] = `Missing product style for ${item.name}`
        }

        if (!item.customization?.sizeCode) {
          nextErrors[`item-size-code-${item.id}`] = `Missing selected size for ${item.name}`
        }

        if (selectedCatalogItems.length === 0) {
          nextErrors[`item-catalog-${item.id}`] = `No selected catalog items for ${item.name}`
        }

        selectedCatalogItems.forEach((catalogItem, index) => {
          if (!catalogItem.catalogItemId) {
            nextErrors[`item-catalog-id-${item.id}-${index}`] = `Missing catalog item in ${item.name}`
          }

          if (!Number.isFinite(catalogItem.quantity) || catalogItem.quantity <= 0) {
            nextErrors[`item-catalog-qty-${item.id}-${index}`] = `Invalid catalog item quantity in ${item.name}`
          }
        })
      } else {
        const productId = item.customization?.productId || item.id.split('__')[0]
        const productSizeId = item.customization?.productSizeId

        if (!productId) {
          nextErrors[`item-product-${item.id}`] = 'Missing product id'
        }

        if (!productSizeId) {
          nextErrors[`item-size-${item.id}`] = `Missing selected size for ${item.name}`
        }
      }

      if (greeting?.enabled) {
        if (!greeting.type.trim()) {
          nextErrors[`item-greeting-type-${item.id}`] = `Greeting type is required for ${item.name}`
        }
        if (!greeting.to.trim()) {
          nextErrors[`item-greeting-to-${item.id}`] = `Greeting recipient is required for ${item.name}`
        }
        if (!greeting.from.trim()) {
          nextErrors[`item-greeting-from-${item.id}`] = `Greeting sender is required for ${item.name}`
        }
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      return
    }

    if (!validate()) {
      return
    }

    const fullNameValue = `${form.firstName} ${form.lastName}`.trim()
    const buyerDisplayName = fullNameValue
    const preferredDate = form.deliveryType === 'scheduled' ? form.deliveryDate : null
    const preferredTime = form.deliveryType === 'scheduled' ? form.deliveryTime : null
    const deliveryTypeValue = form.deliveryType === 'scheduled' ? 'SCHEDULED' : 'INSTANT'

    const payload: PlaceOrderPayload = {
      payment_method: form.paymentMethod,
      currency: 'PKR',
      buyer_first_name: buyerDisplayName,
      buyer_phone: form.phone.trim(),
      buyer_email: form.email.trim(),
      discount_code: form.discountCode.trim() || undefined,
      // terms_accepted: form.agreeTerms,
      addresses: [
        {
          type: 'RECIPIENT',
          delivery_type: deliveryTypeValue,
          full_name: fullNameValue,
          phone: form.phone.trim(),
          address_line_1: form.address.trim(),
          city: form.city,
          postal_code: form.postalCode.trim(),
          country: form.country,
          preferred_delivery_date: preferredDate,
          preferred_delivery_time: preferredTime,
        },
      ],
      items: items.map((item) => {
        const greeting = greetingDraftByLineId[item.id]
        const isCustomized = isCustomizedItem(item)
        const selectedColors = {
          ribbon: item.customization?.ribbonColor || undefined,
          net: item.customization?.netColor || undefined,
          product_color: item.customization?.productColor || undefined,
          decorative: item.customization?.decorativeColor || undefined,
        }
        const hasSelectedColors = Boolean(
          selectedColors.ribbon ||
          selectedColors.net ||
          selectedColors.product_color ||
          selectedColors.decorative
        )

        if (isCustomized) {
          return {
            product_type_id: getCustomizedProductTypeId(item),
            product_style_id: item.customization?.productStyleId || '',
            size_code: item.customization?.sizeCode || '',
            quantity: item.quantity,
            selected_colors: hasSelectedColors ? selectedColors : undefined,
            selected_fillers: item.customization?.selectedFillers || [],
            selected_catalog_items: (item.customization?.selectedCatalogItems || []).map((catalogItem) => ({
              catalog_item_id: catalogItem.catalogItemId,
              quantity: catalogItem.quantity,
            })),
          }
        }

        return {
          product_id: item.customization?.productId || item.id.split('__')[0],
          product_size_id: item.customization?.productSizeId || '',
          quantity: item.quantity,
          selected_colors: hasSelectedColors ? selectedColors : undefined,
          greeting_card: greeting?.enabled
            ? {
              greeting_type: greeting.type.trim(),
              greeting_to: greeting.to.trim(),
              greeting_from: greeting.from.trim(),
              custom_text: greeting.message.trim() || undefined,
            }
            : undefined,
        }
      }),
    }

    try {
      setIsPlacingOrder(true)
      setSubmitError('')
      const response = await orderApi.placeOrder<PlaceOrderResponse<PlaceOrderData>>(payload)
      const responseData = response?.data ?? null
      setPlacedOrder(responseData)
      clearCart()
      clearGreetingDraft()

      // Redirect to Stripe checkout if URL is provided
      if (responseData && (responseData as any).stripe_checkout_url) {
        window.location.href = (responseData as any).stripe_checkout_url
      } else {
        setShowSuccessModal(true)
      }
    } catch (error) {
      setSubmitError(extractOrderErrorMessage(error))
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const fullName = `${form.firstName} ${form.lastName}`.trim() || 'Receiver'
  const receiverName = placedOrder?.address?.full_name || fullName
  const receiverAddress = placedOrder?.address?.address_line_1 || form.address || 'Address not provided'
  const orderIdentifier = placedOrder?.order_number || placedOrder?.id || `#${Date.now().toString().slice(-5)}`
  const orderTotalDisplay = placedOrder?.total_amount
    ? formatPrice(parseMoney(placedOrder.total_amount))
    : formatPrice(orderTotal)
  const deliveryTypeDisplay = placedOrder?.address?.delivery_type || 'INSTANT'
  const preferredDateDisplay = placedOrder?.address?.preferred_delivery_date || 'N/A'
  const preferredTimeDisplay = placedOrder?.address?.preferred_delivery_time || 'N/A'

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-9 lg:px-20 py-8">
      <nav className="flex items-center gap-2">
        {[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/product' },
          { label: 'Baskit', href: null },
        ].map((crumb, i, arr) => (
          <Fragment key={crumb.label}>
            {crumb.href ? (
              <Link href={crumb.href} className="text-[14px] font-light leading-5 text-[#25252599] hover:text-[#252525] transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[14px] font-light leading-5 text-[#252525]">{crumb.label}</span>
            )}
            {i < arr.length - 1 && (
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M1 1L5 5L1 9" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </Fragment>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        <div>
          <h1 className="text-[36px] leading-[42px] text-[#252525] tobia-normal">Shipping details</h1>

          <section className="mt-8">
            <h2 className="text-[32px] leading-none tobia-normal text-[#252525]">Contact</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} placeholder="First name" className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none" />
              <input value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} placeholder="Last name" className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none" />
              <input value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="Email" className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none" />
              <input value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+92 -" className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none" />
            </div>
            <label className="mt-3 flex items-center gap-2 text-[14px] text-[#25252599]">
              <input type="checkbox" checked={form.agreeTerms} onChange={(e) => setField('agreeTerms', e.target.checked)} className="h-4 w-4" />
              I agree with the terms and conditions.
            </label>
            {errors.agreeTerms && <p className="mt-2 text-[12px] text-[#D35565]">Please accept terms and conditions.</p>}
          </section>

          <section className="mt-10">
            <h2 className="text-[32px] leading-none tobia-normal text-[#252525]">Delivery</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select value={form.country} onChange={(e) => setField('country', e.target.value)} className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none">
                <option value="">Select country</option>
                <option value="Pakistan">Pakistan</option>
              </select>
              <select value={form.city} onChange={(e) => setField('city', e.target.value)} className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none">
                <option value="">Select city</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
              <input value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="Town name, house#, street#..." className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none" />
              <input value={form.postalCode} onChange={(e) => setField('postalCode', e.target.value)} placeholder="Enter code" className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none" />
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`border p-3 text-[14px] cursor-pointer ${form.deliveryType === 'instant' ? 'border-[#252525]' : 'border-[#25252533]'}`}>
                <input type="radio" className="mr-2" checked={form.deliveryType === 'instant'} onChange={() => setField('deliveryType', 'instant')} />
                Instant delivery
              </label>
              <label className={`border p-3 text-[14px] cursor-pointer ${form.deliveryType === 'scheduled' ? 'border-[#252525]' : 'border-[#25252533]'}`}>
                <input type="radio" className="mr-2" checked={form.deliveryType === 'scheduled'} onChange={() => setField('deliveryType', 'scheduled')} />
                Schedule delivery
              </label>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="date"
                value={form.deliveryDate}
                disabled={form.deliveryType !== 'scheduled'}
                onChange={(e) => setField('deliveryDate', e.target.value)}
                className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none disabled:opacity-60"
              />
              <input
                type="time"
                value={form.deliveryTime}
                disabled={form.deliveryType !== 'scheduled'}
                onChange={(e) => setField('deliveryTime', e.target.value)}
                className="border border-[#25252533] bg-transparent p-3 text-[14px] outline-none disabled:opacity-60"
              />
            </div>
            {errors.deliveryDate && <p className="mt-2 text-[12px] text-[#D35565]">Preferred delivery date is required for scheduled delivery.</p>}
            {errors.deliveryTime && <p className="mt-1 text-[12px] text-[#D35565]">Preferred delivery time is required for scheduled delivery.</p>}
          </section>

          <section className="mt-10">
            <h2 className="text-[32px] leading-none tobia-normal text-[#252525]">Payment</h2>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className={`border p-3 text-[14px] cursor-pointer ${form.paymentMethod === 'COD' ? 'border-[#252525]' : 'border-[#25252533]'}`}>
                <input type="radio" className="mr-2" checked={form.paymentMethod === 'COD'} onChange={() => setField('paymentMethod', 'COD')} />
                Cash on delivery
              </label>
              <label className={`border p-3 text-[14px] cursor-pointer ${form.paymentMethod === 'EASYPAISA' ? 'border-[#252525]' : 'border-[#25252533]'}`}>
                <input type="radio" className="mr-2" checked={form.paymentMethod === 'EASYPAISA'} onChange={() => setField('paymentMethod', 'EASYPAISA')} />
                EasyPaisa
              </label>
              <label className={`border p-3 text-[14px] cursor-pointer ${form.paymentMethod === 'JAZZCASH' ? 'border-[#252525]' : 'border-[#25252533]'}`}>
                <input type="radio" className="mr-2" checked={form.paymentMethod === 'JAZZCASH'} onChange={() => setField('paymentMethod', 'JAZZCASH')} />
                JazzCash
              </label>
              <label className={`border p-3 text-[14px] cursor-pointer ${form.paymentMethod === 'CARD' ? 'border-[#252525]' : 'border-[#25252533]'}`}>
                <input type="radio" className="mr-2" checked={form.paymentMethod === 'CARD'} onChange={() => setField('paymentMethod', 'CARD')} />
                Debit/Credit card
              </label>
              <label className={`border p-3 text-[14px] cursor-pointer ${form.paymentMethod === 'ONLINE_PAYMENT' ? 'border-[#252525]' : 'border-[#25252533]'}`}>
                <input type="radio" className="mr-2" checked={form.paymentMethod === 'ONLINE_PAYMENT'} onChange={() => setField('paymentMethod', 'ONLINE_PAYMENT')} />
                Online payment
              </label>
            </div>



            <label className="mt-3 flex items-center gap-2 text-[14px] text-[#25252599]">
              <input type="checkbox" checked={form.billingSame} onChange={(e) => setField('billingSame', e.target.checked)} className="h-4 w-4" />
              Billing address is the same as delivery address.
            </label>
          </section>

          <div className="mt-10 flex items-center gap-3">
            <Link href="/checkout" className="border border-[#252525] px-6 py-3 text-[18px] leading-6 text-[#252525] hover:bg-[#f5f0e8] transition-colors">
              Back to Baskit
            </Link>
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="bg-[#252525] text-white px-6 py-3 text-[18px] leading-6 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isPlacingOrder ? 'Placing order...' : 'Place order'}
            </button>
          </div>
          {submitError && <p className="mt-3 text-[13px] text-[#D35565]">{submitError}</p>}
          {errors.mixedCart && (
            <p className="mt-2 text-[13px] text-[#D35565]">
              Please place your customized order first, then place predefined products in a separate order.
            </p>
          )}
          {Object.values(errors).filter((value) => value.startsWith('Missing selected size')).length > 0 && (
            <p className="mt-2 text-[13px] text-[#D35565]">Please go back and select a size for all items before placing the order.</p>
          )}
        </div>

        <aside>
          <h2 className="text-[32px] leading-none tobia-normal text-[#252525]">Order summary</h2>
          <div className="mt-5 space-y-5">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#252525] text-white text-[12px] flex items-center justify-center">
                  {item.quantity}
                </div>
                <div className="relative h-[66px] w-14 overflow-hidden bg-[#F5F1E8] shrink-0">
                  <ImageWithEmptyState src={item.imageUrl} alt={item.name} className="object-contain" sizes="56px" />
                </div>
                <div className="flex-1">
                  <p className="text-[18px] leading-6 text-[#252525]">{item.name}</p>

                  {getCartSelectionEntries(item.customization).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                      {getCartSelectionEntries(item.customization).map((entry) => {
                        const isColorValue =
                          typeof entry.value === "string" &&
                          /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(entry.value.trim());

                        return (
                          <div key={entry.label} className="flex items-center gap-1">
                            <p className="text-[12px] leading-4 text-[#25252599]">
                              {entry.label}:
                            </p>

                            {isColorValue ? (
                              <span
                                className="inline-block h-4 w-4 rounded-full border border-[#25252533]"
                                style={{ backgroundColor: entry.value }}
                                title={entry.label}
                              />
                            ) : (
                              <p className="text-[12px] leading-4 text-[#252525]">
                                {entry.value}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="text-[14px] text-[#25252599]">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8  pt-4 space-y-2">
            <div className="flex items-center justify-between text-[16px] text-[#25252599]">
              <span>Subtotal - {totalItems} items</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[16px] text-[#25252599]">
              <span>Delivery charges</span>
              <span>{formatPrice(DELIVERY_CHARGE)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#2525251F] pt-3 text-[26px] tobia-normal text-[#252525]">
              <span>Total</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center">
            <input value={form.discountCode} onChange={(e) => setField('discountCode', e.target.value)} placeholder="Add code" className="flex-1 border border-[#25252533] bg-transparent p-3 text-[14px] outline-none" />
            <button className="bg-[#252525] text-white px-5 py-3 text-[16px]">Apply</button>
          </div>
        </aside>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[640px] bg-[#FFFEF6] border-4 border-white shadow-2xl">
            <div className="relative h-[150px] w-full overflow-hidden bg-[#E0D8C4]" />
            <div className="px-5 py-6 text-center border-b border-[#25252533]">
              <h3 className="text-[40px] leading-none tobia-normal text-[#252525]">Order placed successfully!</h3>
            </div>
            <div className="px-5 py-4 space-y-0">
              <div className="flex items-center justify-between border border-[#2525251F] border-b-0 px-4 py-3 text-[14px]">
                <span className="text-[#25252599]">Order ID</span>
                <span className="text-[#252525]">{orderIdentifier}</span>
              </div>
              <div className="flex items-center justify-between border border-[#2525251F] border-b-0 px-4 py-3 text-[14px]">
                <span className="text-[#25252599]">Status</span>
                <span className="text-[#252525]">{placedOrder?.status || 'CONFIRMED'}</span>
              </div>
              <div className="flex items-center justify-between border border-[#2525251F] border-b-0 px-4 py-3 text-[14px]">
                <span className="text-[#25252599]">Payment method</span>
                <span className="text-[#252525]">{placedOrder?.payment_method || form.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between border border-[#2525251F] border-b-0 px-4 py-3 text-[14px]">
                <span className="text-[#25252599]">Receiver</span>
                <span className="text-[#252525]">{receiverName}</span>
              </div>
              <div className="flex items-center justify-between border border-[#2525251F] border-b-0 px-4 py-3 text-[14px]">
                <span className="text-[#25252599]">Address</span>
                <span className="text-[#252525]">{receiverAddress}</span>
              </div>
              <div className="flex items-center justify-between border border-[#2525251F] border-b-0 px-4 py-3 text-[14px]">
                <span className="text-[#25252599]">Delivery type</span>
                <span className="text-[#252525]">{deliveryTypeDisplay}</span>
              </div>
              {deliveryTypeDisplay === 'SCHEDULED' && (
                <div className="flex items-center justify-between border border-[#2525251F] border-b-0 px-4 py-3 text-[14px]">
                  <span className="text-[#25252599]">Preferred date/time</span>
                  <span className="text-[#252525]">{preferredDateDisplay} {preferredTimeDisplay !== 'N/A' ? `at ${preferredTimeDisplay}` : ''}</span>
                </div>
              )}
              <div className="flex items-center justify-between border border-[#2525251F] px-4 py-3 text-[14px]">
                <span className="text-[#25252599]">Total Payment</span>
                <span className="text-[#252525]">{orderTotalDisplay}</span>
              </div>
            </div>
            <div className="px-5 pb-5 flex items-center gap-3">
              <Link href="/product" className="flex-1 border border-[#25252566] text-center py-3 text-[16px] text-[#252525] hover:bg-[#f5f0e8] transition-colors">
                Continue shopping
              </Link>
              <button onClick={() => {
                router.push(`/track-order`)
                setShowSuccessModal(false)}} className="flex-1 bg-[#252525] text-white py-3 text-[16px] hover:opacity-90 transition-opacity">
                Track order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShippingPage