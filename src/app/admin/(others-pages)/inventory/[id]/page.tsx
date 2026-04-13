"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { inventoryColors, inventoryItems, InventoryItem, movementColors } from "../data";

export default function InventoryDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [item, setItem] = useState<InventoryItem | null | undefined>(undefined);

  useEffect(() => {
    setItem(inventoryItems.find((entry) => entry.id === id) ?? null);
  }, [id]);

  if (item === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading inventory item...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Inventory item not found</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The inventory record you are looking for does not exist.</p>
        </div>
        <Link href="/admin/inventory" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          Back to Inventory
        </Link>
      </div>
    );
  }

  const lastMovement = item.movements[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/inventory" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Inventory</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="font-medium text-gray-800 dark:text-white/90">{item.product.name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.product.name}</h1>
            <Badge size="sm" color={inventoryColors[item.status]}>{item.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.product.category} · {item.sku} · {item.location}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/inventory/${item.id}/adjust`} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            Adjust Stock
          </Link>
          <Link href={`/admin/inventory/${item.id}/history`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.06]">
            View History
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]"><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Inventory Overview</h2></div>
            <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/[0.05]">
              {[
                { label: "On Hand", value: item.onHand, note: "physical stock" },
                { label: "Reserved", value: item.reserved, note: "allocated to orders" },
                { label: "Available", value: item.available, note: "ready to sell" },
              ].map((stat) => (
                <div key={stat.label} className="px-6 py-6 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]"><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Item Details</h2></div>
            <dl className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {[
                ["SKU", item.sku],
                ["Product", item.product.name],
                ["Category", item.product.category],
                ["Location", item.location],
                ["Cost", item.cost],
                ["Reorder Point", String(item.reorderPoint)],
                ["Last Updated", new Date(item.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center px-6 py-4">
                  <dt className="w-40 shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</dt>
                  <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]"><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Replenishment</h2></div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">Status</p>
                <div className="mt-2"><Badge size="sm" color={inventoryColors[item.status]}>{item.status}</Badge></div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">Reorder point</p>
                <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">{item.reorderPoint} units</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">Suggested action</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {item.status === "Healthy"
                    ? "No immediate action needed."
                    : item.status === "Low"
                    ? "Create a stock-in request soon."
                    : "Restock immediately to avoid sales interruption."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]"><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Latest Movement</h2></div>
            <div className="px-6 py-5">
              {lastMovement ? (
                <div>
                  <div className="flex items-center gap-2">
                    <Badge size="sm" color={movementColors[lastMovement.type]}>{lastMovement.type}</Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(lastMovement.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-800 dark:text-white/90">{lastMovement.quantity} units</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{lastMovement.note}</p>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{lastMovement.reference} · {lastMovement.actor}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No movement history recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}