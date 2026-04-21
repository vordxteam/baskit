'use client'

import { useEffect, useState } from 'react'
import {
  CART_UPDATED_EVENT,
  addItemToCart,
  clearCartItems,
  getCartItemCount,
  getCartSubtotal,
  readCartItems,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
  type CartItemInput,
} from '@/utils/cart'

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const syncItems = () => setItems(readCartItems())

    syncItems()
    window.addEventListener('storage', syncItems)
    window.addEventListener(CART_UPDATED_EVENT, syncItems)

    return () => {
      window.removeEventListener('storage', syncItems)
      window.removeEventListener(CART_UPDATED_EVENT, syncItems)
    }
  }, [])

  const addItem = (input: CartItemInput) => {
    const nextItems = addItemToCart(input)
    setItems(nextItems)
  }

  const updateQuantity = (id: string, quantity: number) => {
    const nextItems = updateCartItemQuantity(id, quantity)
    setItems(nextItems)
  }

  const removeItem = (id: string) => {
    const nextItems = removeCartItem(id)
    setItems(nextItems)
  }

  const clearCart = () => {
    clearCartItems()
    setItems([])
  }

  return {
    items,
    totalItems: getCartItemCount(items),
    subtotal: getCartSubtotal(items),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
}