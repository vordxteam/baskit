"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { inventoryItems, InventoryItem, MovementType } from "../../data";

type FormState = {
  type: MovementType;
  quantity: string;
  reference: string;
  note: string;
};

const initialForm: FormState = {
  type: "Stock In",
  quantity: "",
  reference: "",
  note: "",
};

export default function AdjustInventoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [item, setItem] = useState<InventoryItem | null | undefined>(undefined);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItem(inventoryItems.find((entry) => entry.id === id) ?? null);
  }, [id]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.quantity.trim() || Number(form.quantity) <= 0 || Number.isNaN(Number(form.quantity))) nextErrors.quantity = "Enter a valid quantity";
    if (!form.reference.trim()) nextErrors.reference = "Reference is required";
    if (!form.note.trim()) nextErrors.note = "Add a short reason";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    router.push(`/admin/inventory/${id}/history`);
  };

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
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Inventory item not found</h2>
        <Link href="/admin/inventory" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/inventory" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Inventory</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <Link href={`/admin/inventory/${item.id}`} className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">{item.product.name}</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="font-medium text-gray-800 dark:text-white/90">Adjust</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Adjust Stock</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Record stock movement for {item.product.name} at {item.location}.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]"><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Movement Details</h2></div>
          <div className="grid gap-5 px-6 py-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Movement Type</label>
              <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as MovementType }))} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/90">
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
                <option value="Adjustment">Adjustment</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input type="number" min="1" value={form.quantity} onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))} className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:bg-white/[0.03] dark:text-white/90 ${errors.quantity ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"}`} placeholder="0" />
              {errors.quantity && <p className="mt-1.5 text-xs text-red-500">{errors.quantity}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Reference</label>
              <input type="text" value={form.reference} onChange={(e) => setForm((prev) => ({ ...prev, reference: e.target.value }))} className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:bg-white/[0.03] dark:text-white/90 ${errors.reference ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"}`} placeholder="PO-2041 / SO-8831" />
              {errors.reference && <p className="mt-1.5 text-xs text-red-500">{errors.reference}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
              <input type="text" value={form.note} onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))} className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:bg-white/[0.03] dark:text-white/90 ${errors.note ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"}`} placeholder="Reason for movement" />
              {errors.note && <p className="mt-1.5 text-xs text-red-500">{errors.note}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">Current stock: {item.onHand}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available: {item.available} · Reserved: {item.reserved}</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/inventory/${item.id}`} className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.06]">
                Cancel
              </Link>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "Saving..." : "Save Movement"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}