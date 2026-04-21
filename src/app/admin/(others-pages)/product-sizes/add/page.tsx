"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductSize } from "@/api/productSize";
import { CreateProductSizeRequest } from "@/api/productSize/types";
import { ProductApi } from "@/api";

export default function AddProductSizePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<Array<{ id: string; label: string }>>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [form, setForm] = useState<CreateProductSizeRequest>({
    product_type_id: "",
    size_code: "",
    label: "",
    min_items: 0,
    max_items: 0,
    is_active: true,
  });

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        setIsLoadingTypes(true);

        const response = await new ProductApi().getProductTypes();

        const types =
          (response as any)?.data
            ?.filter((type: any) => type.is_active !== false)
            ?.map((type: any) => ({
              id: type.id,            // for payload
              label: type.name,       // for UI display
            })) || [];

        setProductTypes(types);

        console.log("Mapped product types:", types);
      } catch (err) {
        console.error("Error fetching product types:", err);
        setError("Failed to load product types");
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchProductTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "min_items" || name === "max_items"
            ? parseInt(value) || 0
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.product_type_id) {
      setError("Please select a product type");
      return;
    }

    if (!form.size_code || !form.label) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.min_items >= form.max_items) {
      setError("Maximum items must be greater than minimum items");
      return;
    }

    try {
      setIsLoading(true);
      await new ProductSize().createSize(form);
      router.push("/admin/product-sizes");
      router.refresh();
    } catch (err) {
      console.error("Error creating product size:", err);
      setError("Failed to create product size");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add Product Size
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create a new product size template
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
              Product Type <span className="text-red-500">*</span>
            </label>
            {isLoadingTypes ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 dark:border-white/10 dark:bg-white/3 dark:text-gray-400">
                Loading product types...
              </div>
            ) : (
              <select
                name="product_type_id"
                value={form.product_type_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
              >
                <option value="">Select a product type</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Size Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
              Size Code <span className="text-red-500">*</span>
            </label>

            <select
              name="size_code"
              value={form.size_code}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
            >
              <option value="">Select size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="e.g., Small Bouquet"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Min & Max Items */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
                Minimum Items <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="min_items"
                value={form.min_items}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
                Maximum Items <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="max_items"
                value={form.max_items}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Active Status */}
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

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingTypes}
              className="flex-1 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Size"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}