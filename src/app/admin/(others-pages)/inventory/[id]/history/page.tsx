"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { inventoryColors, inventoryItems, InventoryItem, movementColors, MovementType } from "../../data";

const FILTERS: Array<MovementType | "All"> = ["All", "Stock In", "Stock Out", "Adjustment", "Transfer"];

export default function InventoryHistoryPage() {
  const params = useParams();
  const id = Number(params.id);
  const [item, setItem] = useState<InventoryItem | null | undefined>(undefined);
  const [filter, setFilter] = useState<MovementType | "All">("All");

  useEffect(() => {
    setItem(inventoryItems.find((entry) => entry.id === id) ?? null);
  }, [id]);

  const movements = useMemo(() => {
    if (!item) return [];
    return item.movements.filter((movement) => filter === "All" || movement.type === filter);
  }, [item, filter]);

  if (item === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading history...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Inventory item not found</h2>
        <Link href="/admin/inventory" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/inventory" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Inventory</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <Link href={`/admin/inventory/${item.id}`} className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">{item.product.name}</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="font-medium text-gray-800 dark:text-white/90">History</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Movement History</h1>
            <Badge size="sm" color={inventoryColors[item.status]}>{item.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.product.name} · {item.sku} · {item.location}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/inventory/${item.id}/adjust`} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            New Movement
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((entry) => {
          const active = filter === entry;
          return (
            <button
              key={entry}
              onClick={() => setFilter(entry)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${active ? "border-brand-500 bg-brand-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/10 dark:bg-white/3 dark:text-gray-400"}`}
            >
              {entry}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Recent Activity</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{movements.length} movement{movements.length === 1 ? "" : "s"} shown</p>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {movements.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400 dark:text-gray-500">No movements match the selected filter.</div>
          ) : (
            movements.map((movement) => (
              <div key={movement.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge size="sm" color={movementColors[movement.type]}>{movement.type}</Badge>
                    <span className="font-medium text-gray-800 dark:text-white/90">{movement.quantity} units</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{movement.note}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{movement.reference} · {movement.actor} · {movement.location}</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(movement.date).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link href={`/admin/inventory/${item.id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          Back to Item
        </Link>
        <p className="text-xs text-gray-400 dark:text-gray-500">Inventory ID: #{item.id}</p>
      </div>
    </div>
  );
}