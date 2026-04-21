'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageWithEmptyState from '@/components/ui/ImageWithEmptyState'
import { formatPrice, getCartSelectionEntries } from '@/utils/cart'
import { readGreetingDraft, writeGreetingDraft } from '@/utils/orderDraft'
import { useCart } from '@/hooks/useCart'
import Image from 'next/image'

type GreetingCardState = {
    enabled: boolean
    type: string
    to: string
    from: string
    message: string
}

type CheckoutItemState = ReturnType<typeof useCart>['items'][number] & {
    greeting: GreetingCardState
}

const greetingTypes = [
    'Birthday',
    'Anniversary',
    'Wedding',
    'Get Well Soon',
    'Thank You',
    'Congratulations',
    'Just Because',
]

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

type CartRowProps = {
    item: CheckoutItemState
    onQuantityChange: (id: string, quantity: number) => void
    onRemove: (id: string) => void
    onGreetingChange: (
        id: string,
        field: keyof GreetingCardState,
        value: string | boolean
    ) => void
}

const CartRow = ({ item, onQuantityChange, onRemove, onGreetingChange }: CartRowProps) => (
    <div className="">
        <div className="flex items-start gap-5 sm:gap-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-[#F5F1E8] sm:h-[140px] sm:w-[140px]">
                <ImageWithEmptyState
                    src={item.imageUrl}
                    alt={item.name}
                    className="object-contain p-2"
                    sizes="140px"
                />
            </div>

            <div className="flex-1 pt-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-[18px] sm:text-[20px] font-normal text-[#252525] leading-6">
                            {item.name}
                        </h3>
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
                        <p className="text-[16px] leading-5 tobia-normal text-[#252525] mt-2">
                            {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                    </div>

                    <button
                        onClick={() => onRemove(item.id)}
                        className="self-start text-[14px] text-[#D35565] hover:opacity-80 transition-opacity"
                        aria-label={`Remove ${item.name}`}
                    >
                        <Image src="/images/icons/delete.svg" alt="del" height={20} width={20} />
                    </button>
                </div>

                <div className="mt-5 flex items-center gap-4">
                    <div className="flex items-center border border-[#25252533] w-fit h-8">
                        <button
                            onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                            className="w-9 h-full flex items-center justify-center text-[#252525] transition-colors text-[16px]"
                        >
                            −
                        </button>
                        <span className="w-10 tobia-normal text-center text-[16px] text-[#252525]">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                            className="w-9 h-full flex items-center justify-center text-[#252525] transition-colors text-[16px]"
                        >
                            +
                        </button>
                    </div>
                    <span className="text-[13px] text-[#25252566]">Optional greeting card below</span>
                </div>
            </div>
        </div>

        <div className="pt-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h4 className="text-[18px] sm:text-[24px] leading-7 tobia-normal text-[#252525]">
                        Greeting card
                    </h4>
                </div>

                <label className="flex items-center gap-2 text-[13px] text-[#252525] cursor-pointer">
                    <input
                        type="checkbox"
                        checked={item.greeting.enabled}
                        onChange={(e) => onGreetingChange(item.id, 'enabled', e.target.checked)}
                        className="h-4 w-4 border-[#25252533]"
                    />
                    Include greeting card
                </label>
            </div>

            <div className={`mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 ${!item.greeting.enabled ? 'opacity-60' : ''}`}>
                <div className="flex flex-col gap-2">
                    <label className="text-[14px] leading-5 text-[#252525] font-normal">Select type</label>
                    <div className="relative">
                        <select
                            value={item.greeting.type}
                            disabled={!item.greeting.enabled}
                            onChange={(e) => onGreetingChange(item.id, 'type', e.target.value)}
                            className="w-full appearance-none border border-[#25252533] bg-transparent text-[14px] leading-5 text-[#25252599] p-3 outline-none focus:border-[#252525] transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            <option value="" disabled>Select type</option>
                            {greetingTypes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="#25252599" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[14px] leading-5 text-[#252525] font-normal">To</label>
                    <input
                        type="text"
                        placeholder="e.g Hania"
                        value={item.greeting.to}
                        disabled={!item.greeting.enabled}
                        onChange={(e) => onGreetingChange(item.id, 'to', e.target.value)}
                        className="border border-[#25252533] bg-transparent text-[14px] leading-5 text-[#25252599] placeholder:text-[#25252599] p-3 outline-none focus:border-[#252525] transition-colors disabled:cursor-not-allowed"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[14px] leading-5 text-[#252525] font-normal">From</label>
                    <input
                        type="text"
                        placeholder="e.g Atif"
                        value={item.greeting.from}
                        disabled={!item.greeting.enabled}
                        onChange={(e) => onGreetingChange(item.id, 'from', e.target.value)}
                        className="border border-[#25252533] bg-transparent text-[13px] text-[#25252599] placeholder:text-[#25252599] p-3 outline-none focus:border-[#252525] transition-colors disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
                <label className="text-[14px] leading-5 text-[#252525] font-normal">Greeting message</label>
                <textarea
                    placeholder="Type greeting card message..."
                    value={item.greeting.message}
                    disabled={!item.greeting.enabled}
                    onChange={(e) => onGreetingChange(item.id, 'message', e.target.value)}
                    rows={4}
                    className="w-full border border-[#25252533] bg-transparent text-[14px] leading-5 text-[#252525] placeholder:text-[#25252566] p-3 outline-none focus:border-[#252525] transition-colors resize-none disabled:cursor-not-allowed"
                />
            </div>
        </div>
    </div>
)

export default function CheckoutPage() {
    const router = useRouter()
    const { items, subtotal, updateQuantity, removeItem } = useCart()
    const [greetingState, setGreetingState] = useState<Record<string, GreetingCardState>>(() => readGreetingDraft())

    useEffect(() => {
        setGreetingState((prev) => {
            const nextState: Record<string, GreetingCardState> = {}

            items.forEach((item) => {
                nextState[item.id] = prev[item.id] ?? {
                    enabled: false,
                    type: '',
                    to: '',
                    from: '',
                    message: '',
                }
            })

            return nextState
        })
    }, [items])

    useEffect(() => {
        writeGreetingDraft(greetingState)
    }, [greetingState])

    const checkoutItems = useMemo<CheckoutItemState[]>(() => {
        return items.map((item) => ({
            ...item,
            greeting: greetingState[item.id] ?? {
                enabled: false,
                type: '',
                to: '',
                from: '',
                message: '',
            },
        }))
    }, [items, greetingState])

    const handleGreetingChange = (
        id: string,
        field: keyof GreetingCardState,
        value: string | boolean
    ) => {
        setGreetingState((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] ?? {
                    enabled: false,
                    type: '',
                    to: '',
                    from: '',
                    message: '',
                }),
                [field]: value,
            },
        }))
    }

    const handleProceedToShipping = () => {
        writeGreetingDraft(greetingState)
        router.push('/shipping')
    }

    return (
        <div className="max-w-[1440px] mx-auto sm:px-9 px-6 lg:px-20 py-8">
            <Breadcrumb />

            <div className="mt-8 space-y-15 sm:px-9 lg:px-30">
                {items.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-[16px] text-[#25252599] font-light">Your baskit is empty.</p>
                    </div>
                ) : (
                    checkoutItems.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <CartRow
                                item={item}
                                onQuantityChange={updateQuantity}
                                onRemove={removeItem}
                                onGreetingChange={handleGreetingChange}
                            />
                            {/* {index < items.length - 1 && <div className="border-t border-[#25252520]" />} */}
                        </React.Fragment>
                    ))
                )}
            </div>

            <div className="mt-10 flex items-center sm:flex-row flex-col w-full sm:justify-between gap-4 sm:px-9 px-6 lg:px-30">
                <Link
                    href="/product"
                    className="border border-[#252525] text-center text-[18px] w-full sm:w-auto text-[#252525] font-normal leading-6 px-5 py-3 hover:bg-[#f5f0e8] transition-colors"
                >
                    Back to Baskit
                </Link>

                <div className="flex w-full sm:w-auto items-center justify-between gap-4 border border-[#25252533] px-5 py-3 sm:min-w-[280px]">
                    <span className="text-[16px] text-[#25252599]">Subtotal</span>
                    <span className="text-[18px] text-[#252525] tobia-normal">{formatPrice(subtotal)}</span>
                </div>

                <button
                    onClick={handleProceedToShipping}
                    className="bg-[#252525] text-gray-50 text-[18px] w-full sm:w-auto leading-6 font-light px-5 py-3 hover:opacity-90 transition-opacity text-center"
                >
                    Proceed to payment
                </button>
            </div>
        </div>
    )
}