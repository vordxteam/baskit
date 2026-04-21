"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductInventory } from "@/api/productInventory";
import type { CreateData } from "@/api/productInventory";

const inventoryApi = new ProductInventory();

type CatalogTypeFormState = {
  label: string;
  value: string;
  is_active: boolean;
};

export default function AddCatalogTypePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CatalogTypeFormState>({
    label: "",
    value: "",
    is_active: true,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.label.trim()) {
      setError("Label is required");
      return;
    }

    if (!form.value.trim()) {
      setError("Value is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateData = {
        name: form.label.trim(),
        description: form.value.trim(),
        is_active: form.is_active,
      };

      await inventoryApi.createCatalog(payload);
      router.push("/admin/catalog-types");
      router.refresh();
    } catch (submitError) {
      console.error("Error creating catalog type:", submitError);
      setError("Failed to create catalog type");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Catalog Type</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Create a new catalog type for inventory mapping</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white/90">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="e.g., Fresh Flowers"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white/90">
              Value <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="value"
              value={form.value}
              onChange={handleChange}
              placeholder="e.g., FRESH_FLOWERS"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-mono text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-white/90">
              Active
            </label>
          </div>

          <div className="flex gap-3 border-t border-gray-100 pt-4 dark:border-white/5">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
