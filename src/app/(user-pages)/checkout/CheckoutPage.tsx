'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────────────

type GreetingCard = {
  type: string
  to: string
  from: string
  message: string
}

type CartItem = {
  id: number
  image: string
  name: string
  price: string
  quantity: number
  greeting: GreetingCard
}

// ── Hardcoded cart items (replace with real cart state later) ──────────────────

const initialItems: CartItem[] = [
  {
    id: 1,
    image: '/images/product1.png',
    name: 'Sunshine Mix',
    price: 'PKR 3,999',
    quantity: 1,
    greeting: { type: '', to: '', from: '', message: '' },
  },
  {
    id: 2,
    image: '/images/product2.png',
    name: 'Tropical Vibes',
    price: 'PKR 3,999',
    quantity: 1,
    greeting: { type: '', to: '', from: '', message: '' },
  },
]

const greetingTypes = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Get Well Soon',
  'Thank You',
  'Congratulations',
  'Just Because',
]

// ── Breadcrumb ─────────────────────────────────────────────────────────────────

const Breadcrumb = () => (
  <nav className="flex items-center gap-2">
    {[
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/product' },
      { label: 'Baskit', href: null },
    ].map((crumb, i, arr) => (
      <React.Fragment key={i}>
        {crumb.href ? (
          <Link
            href={crumb.href}
            className="text-[14px] font-light leading-5 text-[#25252599] hover:text-[#252525] transition-colors"
          >
            {crumb.label}
          </Link>
        ) : (
          <span className="text-[14px] font-light leading-5 text-[#252525]">
            {crumb.label}
          </span>
        )}
        {i < arr.length - 1 && (
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </React.Fragment>
    ))}
  </nav>
)

// ── Cart Item Card ─────────────────────────────────────────────────────────────

type CartItemCardProps = {
  item: CartItem
  onQuantityChange: (id: number, qty: number) => void
  onDelete: (id: number) => void
  onGreetingChange: (id: number, field: keyof GreetingCard, value: string) => void
}

const CartItemCard = ({ item, onQuantityChange, onDelete, onGreetingChange }: CartItemCardProps) => (
  <div>
    {/* ── Product Row ── */}
    <div className="flex items-start gap-6">

      {/* Image */}
      <div className="relative w-25 h-25  sm:w-[140px] sm:h-[140px] shrink-0">
        <Image
          src={item.image}
          width={220}
          height={140}
          alt={item.name}
          className="object-contain p-2"
        />
      </div>

      {/* Info */}
      <div className="flex-1 pt-1">
        <div>
          <h3 className="text-[18px] sm:text-[20px] font-normal text-[#252525] leading-6">
            {item.name}
          </h3>
          <p className="text-[16px] leading-5  tobia-normal text-[#252525] mt-2">{item.price}</p>
        </div>

        {/* Quantity */}
        <div className="flex items-center border border-[#25252533] w-fit h-8 mt-10">
          <button
            onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
            className="w-9 h-full flex items-center justify-center text-[#252525]  transition-colors text-[16px]"
          >
            −
          </button>
          <span className="w-1.5 tobia-normal text-center text-[16px] text-[#252525]">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="w-9 h-full flex items-center justify-center text-[#252525]  transition-colors text-[16px]"
          >
            +
          </button>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity mt-1"
        aria-label="Remove item"
      >
      <Image src="/images/icons/delete.svg" alt='del' height={20} width={20} />
      </button>
    </div>

    {/* ── Greeting Card Section ── */}
    <div className="mt-8">
      <h4 className="text-[18px] sm:text-[24px] leading-7 tobia-normal text-[#252525]">Greeting card</h4>

      {/* Select type + To + From */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">

        {/* Select Type */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] leading-5 text-[#252525] font-normal">Select type</label>
          <div className="relative">
            <select
              value={item.greeting.type}
              onChange={(e) => onGreetingChange(item.id, 'type', e.target.value)}
              className="w-full appearance-none border border-[#25252533] bg-transparent text-[14px] leading-5 text-[#25252599] p-3 outline-none focus:border-[#252525] transition-colors cursor-pointer"
            >
              <option value="" disabled>Select type</option>
              {greetingTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {/* Dropdown arrow */}
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* To */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] leading-5 text-[#252525] font-normal">To</label>
          <input
            type="text"
            placeholder="e.g Hania"
            value={item.greeting.to}
            onChange={(e) => onGreetingChange(item.id, 'to', e.target.value)}
            className="border border-[#25252533] bg-transparent text-[14px] leading-5 text-[#25252599] placeholder:text-[#25252599] p-3 outline-none focus:border-[#252525] transition-colors"
          />
        </div>

        {/* From */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] leading-5  text-[#252525] font-normal">From</label>
          <input
            type="text"
            placeholder="e.g Atif"
            value={item.greeting.from}
            onChange={(e) => onGreetingChange(item.id, 'from', e.target.value)}
            className="border border-[#25252533] bg-transparent text-[13px] text-[#25252599] placeholder:text-[#25252599] p-3 outline-none focus:border-[#252525] transition-colors"
          />
        </div>
      </div>

      {/* Greeting Message */}
      <div className="flex flex-col gap-2 mt-3">
        <label className="text-[14px] leading-5 text-[#252525] font-normal">Greeting message</label>
        <textarea
          placeholder="Type greeting card message..."
          value={item.greeting.message}
          onChange={(e) => onGreetingChange(item.id, 'message', e.target.value)}
          rows={4}
          className="w-full border border-[#25252533] bg-transparent text-[14px] leading-5 text-[#252525] placeholder:text-[#25252566] p-3 outline-none focus:border-[#252525] transition-colors resize-none"
        />
      </div>
    </div>
  </div>
)

// ── Main Checkout Page ─────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems)

  const handleQuantityChange = (id: number, qty: number) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: qty } : item))
  }

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleGreetingChange = (id: number, field: keyof GreetingCard, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, greeting: { ...item.greeting, [field]: value } } : item
      )
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto sm:px-9 px-6 lg:px-20 py-8">

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Cart Items */}
      <div className="mt-8 space-y-10 sm:px-9   lg:px-30">
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[16px] text-[#25252599] font-light">Your baskit is empty.</p>
          </div>
        ) : (
          items.map((item, i) => (
            <React.Fragment key={item.id}>
              <CartItemCard
                item={item}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
                onGreetingChange={handleGreetingChange}
              />
              {/* Divider between items */}
              {i < items.length - 1 && (
                <div className="border-t border-[#25252520]" />
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* ── Action Buttons ── */}
<div className="flex items-center sm:flex-row flex-col w-full sm:justify-between mt-15 gap-4 sm:px-9 px-6 lg:px-30">
  <Link
    href="/product"
    className="border border-[#252525] text-center text-[18px] w-full sm:w-auto text-[#252525] font-normal leading-6 px-5 py-3 hover:bg-[#f5f0e8] transition-colors"
  >
    Back to Baskit
  </Link>

  <button
    className="bg-[#252525] text-gray-50 text-[18px] w-full sm:w-auto leading-6 font-light px-5 py-3 hover:opacity-90 transition-opacity"
  >
    Proceed to payment
  </button>
</div>

    </div>
  )
}