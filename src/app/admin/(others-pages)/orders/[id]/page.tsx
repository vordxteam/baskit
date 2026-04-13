"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ordersData, statusColors, paymentColors, Order, OrderStatus } from "../data";
import Badge from "@/components/ui/badge/Badge";

const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

function AvatarCircle({ initials, large }: { initials: string; large?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 font-semibold ${
        large ? "h-12 w-12 text-base" : "h-9 w-9 text-sm"
      }`}
    >
      {initials}
    </div>
  );
}

function StatusTimeline({ current }: { current: OrderStatus }) {
  const flow: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered"];
  const isCancelled = current === "Cancelled" || current === "Refunded";
  const currentIdx = flow.indexOf(current);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{current}</p>
          <p className="text-xs text-red-400 dark:text-red-500">This order has been {current.toLowerCase()}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-start gap-0">
      {flow.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const upcoming = idx > currentIdx;
        return (
          <div key={step} className="flex flex-1 flex-col items-center">
            {/* Connector line */}
            <div className="flex w-full items-center">
              {idx > 0 && (
                <div className={`h-0.5 flex-1 ${done || active ? "bg-brand-500" : "bg-gray-200 dark:bg-white/10"}`} />
              )}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  done
                    ? "border-brand-500 bg-brand-500"
                    : active
                    ? "border-brand-500 bg-white dark:bg-gray-900"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900"
                }`}
              >
                {done ? (
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : active ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                )}
              </div>
              {idx < flow.length - 1 && (
                <div className={`h-0.5 flex-1 ${done ? "bg-brand-500" : "bg-gray-200 dark:bg-white/10"}`} />
              )}
            </div>
            <p
              className={`mt-2 text-center text-xs font-medium ${
                active ? "text-brand-500" : done ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    const found = ordersData.find((o) => o.id === orderId);
    setOrder(found ?? null);
  }, [orderId]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  if (order === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading order...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order not found</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No order with ID "{orderId}" exists.</p>
        </div>
        <Link href="/admin/orders" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          Back to Orders
        </Link>
      </div>
    );
  }

  const itemTotal = order.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/orders" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Orders</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-mono font-medium text-gray-800 dark:text-white/90">{order.id}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{order.id}</h1>
            <Badge size="sm" color={statusColors[order.status]}>{order.status}</Badge>
            <Badge size="sm" color={paymentColors[order.paymentStatus]}>{order.paymentStatus}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatDate(order.date)}</p>
        </div>

        {/* Print / Back */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Order Status</h2>
            </div>
            <div className="px-6 py-6">
              <StatusTimeline current={order.status} />
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Order Items</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {order.items.length} product{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  {/* Icon placeholder */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/[0.05]">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{item.sku}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      ${(item.qty * item.unitPrice).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {item.qty} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order totals */}
            <div className="border-t border-gray-100 dark:border-white/[0.05] px-6 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Shipping ({order.shipping.method})</span>
                <span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/[0.05] pt-2 text-base font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-5 py-4 flex gap-3">
              <svg className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Order Note</p>
                <p className="mt-0.5 text-sm text-amber-600 dark:text-amber-300">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right column — sidebar info */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Customer</h2>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <AvatarCircle initials={order.customer.avatar} large />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90 truncate">{order.customer.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{order.customer.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Shipping Address</h2>
            </div>
            <div className="px-5 py-4 space-y-1">
              <p className="text-sm text-gray-800 dark:text-white/90">{order.shipping.address}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{order.shipping.city}, {order.shipping.zip}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{order.shipping.country}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  {order.shipping.method}
                </span>
              </div>
              {order.shipping.trackingNumber && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Tracking</p>
                  <p className="font-mono text-xs font-semibold text-brand-500">{order.shipping.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Payment</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{order.paymentMethod}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <Badge size="sm" color={paymentColors[order.paymentStatus]}>{order.paymentStatus}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Back */}
          <Link
            href="/admin/orders"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:text-gray-800 dark:hover:text-white/90 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}