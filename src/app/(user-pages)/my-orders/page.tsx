'use client'

import { OrderApi } from '@/api/order'
import { GetUserOrdersResponse, UserOrder } from '@/api/order/types'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const orderApi = new OrderApi()

type OrderStatus = 'DELIVERED' | 'OUT_FOR_DELIVERY' | 'ORDER_CONFIRMED' | 'BEING_PROCESSED' | 'CANCELLED'

interface OrderItem {
  id: string
  orderNumber: string
  date: string
  itemCount: number
  price: string
  image: string
  status: OrderStatus
}

// Map backend status to frontend OrderStatus
const mapBackendStatus = (backendStatus: string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    DELIVERED: 'DELIVERED',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    CONFIRMED: 'ORDER_CONFIRMED',
    PENDING: 'BEING_PROCESSED',
    IN_PREPARATION: 'BEING_PROCESSED',
    CANCELLED: 'CANCELLED',
  }
  return statusMap[backendStatus] || 'BEING_PROCESSED'
}

// Format date from ISO string
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Convert backend UserOrder to frontend OrderItem
const convertUserOrderToOrderItem = (order: UserOrder): OrderItem => {
  return {
    id: order.order_id,
    orderNumber: order.order_number,
    date: formatDate(order.placed_at),
    itemCount: order.total_products,
    price: `PKR ${parseFloat(order.total_amount).toLocaleString()}`,
    image: order.first_product_image || '',
    status: mapBackendStatus(order.status),
  }
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string
    textClass: string
    dotClass: string
    action?: { label: string; variant?: 'default' }
  }
> = {
  DELIVERED: {
    label: 'Delivered',
    textClass: 'text-[#5FA43A]',
    dotClass: 'bg-[#5FA43A]',
    action: { label: 'Re - order' },
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for delivery',
    textClass: 'text-[#E7A11D]',
    dotClass: 'bg-[#E7A11D]',
  },
  ORDER_CONFIRMED: {
    label: 'Order confirmed',
    textClass: 'text-[#3B82F6]',
    dotClass: 'bg-[#3B82F6]',
    action: { label: 'Cancel order' },
  },
  BEING_PROCESSED: {
    label: 'Being processed',
    textClass: 'text-[#8B5CF6]',
    dotClass: 'bg-[#8B5CF6]',
  },
  CANCELLED: {
    label: 'Cancelled',
    textClass: 'text-[#DC2626]',
    dotClass: 'bg-[#DC2626]',
  },
}

interface OrderRowProps {
  order: OrderItem
  orderId: string
  onReorder: (orderId: string) => void
  onCancel: (orderId: string) => void
  isLoading: boolean
}

const OrderRow = ({ order, orderId, onReorder, onCancel, isLoading }: OrderRowProps) => {
  const [imageError, setImageError] = useState(false)
  const status = statusConfig[order.status]
  const hasImage = order.image && !imageError

  const handleActionClick = () => {
    if (isLoading) return
    if (order.status === 'DELIVERED') {
      onReorder(orderId)
    } else if (order.status === 'ORDER_CONFIRMED') {
      onCancel(orderId)
    }
  }

  return (
    <div className="grid grid-cols-12 items-start gap-y-6 py-10 md:py-12 border-b border-[#D9D3C8] last:border-b-0">
      <div className="col-span-12 md:col-span-8 flex flex-col sm:flex-row sm:items-start gap-5 md:gap-7">
        <div className="w-[92px] h-[92px] shrink-0 bg-[#E8E2D7] rounded-sm flex items-center justify-center overflow-hidden">
          {hasImage ? (
            <img
              src={order.image}
              alt={`Order ${order.orderNumber}`}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-center px-2">
              <p className="text-[#8E8A83] text-[12px] leading-[1.2]">Image preview not available</p>
            </div>
          )}
        </div>

        <div className="pt-1">
          <h3 className="text-[26px] leading-[1.2] text-[#252525] font-normal">
            <Link href={`/my-orders/${orderId}`} className="hover:underline">
              Order# {order.orderNumber}
            </Link>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[16px] leading-6 text-[#8E8A83]">
            <span>{order.date}</span>
            <span className="text-[#B8B2A8]">•</span>
            <span>{order.itemCount} items</span>
          </div>

          <p className="mt-7 text-[34px] leading-[1.1] text-[#252525] font-normal">
            {order.price}
          </p>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 flex flex-col items-start md:items-end gap-8">
        <div className={`flex items-center gap-2 text-[16px] leading-5 ${status.textClass}`}>
          <span className={`w-[7px] h-[7px] rounded-full ${status.dotClass}`} />
          <span>{status.label}</span>
        </div>

        {status.action && (
          <button
            onClick={handleActionClick}
            disabled={isLoading}
            className="min-w-[130px] h-[50px] px-5 border border-[#6F695F] text-[#3A342C] text-[16px] leading-5 hover:bg-[#E8E2D7] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : status.action.label}
          </button>
        )}
      </div>
    </div>
  )
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [userOrders, setUserOrders] = useState<UserOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch orders function
  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const res = await orderApi.getUserOrders<GetUserOrdersResponse>()
      
      if (res.data?.data) {
        setUserOrders(res.data.data)
        const convertedOrders = res.data.data.map(convertUserOrderToOrderItem)
        setOrders(convertedOrders)
        setError(null)
      }
    } catch (err) {
      console.error('Failed to fetch user orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(true)
  }, [])

  const handleReorder = async (orderId: string) => {
    try {
      setActionLoading(orderId)
      const result = await orderApi.reorder(orderId)
      console.log('Reorder successful:', result)
      // Refresh orders immediately after reorder
      await fetchOrders(false)
    } catch (err) {
      console.error('Failed to reorder:', err)
      setError(err instanceof Error ? err.message : 'Failed to reorder')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      setActionLoading(orderId)
      const result = await orderApi.cancelOrder(orderId)
      console.log('Order cancelled successfully:', result)
      // Refresh orders immediately after cancel
      await fetchOrders(false)
    } catch (err) {
      console.error('Failed to cancel order:', err)
      setError(err instanceof Error ? err.message : 'Failed to cancel order')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-[#F6F2E8] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 pt-8 md:pt-10 pb-14 md:pb-20">
          <h1 className="text-[34px] md:text-[40px] leading-[1.1] text-[#252525] font-normal">
            My orders
          </h1>
          <div className="mt-8 text-center text-[#8E8A83]">Loading your orders...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full bg-[#F6F2E8] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 pt-8 md:pt-10 pb-14 md:pb-20">
          <h1 className="text-[34px] md:text-[40px] leading-[1.1] text-[#252525] font-normal">
            My orders
          </h1>
          <div className="mt-8 text-center text-red-600">Error: {error}</div>
        </div>
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className="w-full bg-[#F6F2E8] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 pt-8 md:pt-10 pb-14 md:pb-20">
          <h1 className="text-[34px] md:text-[40px] leading-[1.1] text-[#252525] font-normal">
            My orders
          </h1>
          <div className="mt-8 text-center text-[#8E8A83]">No orders found</div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-[#F6F2E8] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 pt-8 md:pt-10 pb-14 md:pb-20">
        <h1 className="text-[34px] md:text-[40px] leading-[1.1] text-[#252525] font-normal">
          My orders
        </h1>

        <div className="mt-8 md:mt-10">
          {orders.map((order, index) => (
            <OrderRow
              key={order.id}
              order={order}
              orderId={userOrders[index]?.order_id || order.id}
              onReorder={handleReorder}
              onCancel={handleCancelOrder}
              isLoading={actionLoading === (userOrders[index]?.order_id || order.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}