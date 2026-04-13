"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

// In a real app, this would come from an API/store. Using mock data here.
const allProducts = [
  { id: 1, product: { name: "Wireless Headphones", category: "Electronics" }, sku: "WH-1024", stock: 48, status: "In Stock" as const, price: "129.00", description: "Premium wireless headphones with noise cancellation." },
  { id: 2, product: { name: "Smart Watch Pro", category: "Wearables" }, sku: "SW-2048", stock: 12, status: "Low Stock" as const, price: "249.00", description: "Advanced smartwatch with health tracking." },
  { id: 3, product: { name: "Bluetooth Speaker", category: "Audio" }, sku: "BS-3091", stock: 0, status: "Out of Stock" as const, price: "89.00", description: "" },
  { id: 4, product: { name: "Gaming Mouse", category: "Accessories" }, sku: "GM-4455", stock: 27, status: "In Stock" as const, price: "59.00", description: "" },
  { id: 5, product: { name: "Mechanical Keyboard", category: "Accessories" }, sku: "MK-7788", stock: 9, status: "Low Stock" as const, price: "139.00", description: "" },
  { id: 6, product: { name: "4K Monitor", category: "Displays" }, sku: "MN-9001", stock: 16, status: "In Stock" as const, price: "399.00", description: "" },
  { id: 7, product: { name: "USB-C Hub", category: "Gadgets" }, sku: "UH-2210", stock: 0, status: "Out of Stock" as const, price: "45.00", description: "" },
  { id: 8, product: { name: "Portable SSD", category: "Storage" }, sku: "PS-6543", stock: 33, status: "In Stock" as const, price: "179.00", description: "" },
];

const categories = ["Electronics", "Wearables", "Audio", "Accessories", "Displays", "Gadgets", "Storage"];
const statusOptions = ["In Stock", "Low Stock", "Out of Stock"] as const;

interface FormData {
  name: string;
  category: string;
  sku: string;
  stock: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: string;
  description: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [form, setForm] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const product = allProducts.find((p) => p.id === id);
    if (!product) {
      setNotFound(true);
      return;
    }
    setForm({
      name: product.product.name,
      category: product.product.category,
      sku: product.sku,
      stock: String(product.stock),
      status: product.status,
      price: product.price,
      description: product.description,
    });
  }, [id]);

  const validate = (): boolean => {
    if (!form) return false;
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.sku.trim()) newErrors.sku = "SKU is required";
    if (!form.stock.trim() || isNaN(Number(form.stock))) newErrors.stock = "Valid stock quantity is required";
    if (!form.price.trim()) newErrors.price = "Price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmitting(false);
    router.push("/admin/products");
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Product not found</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The product you're looking for doesn't exist.</p>
        </div>
        <Link href="/admin/products" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/products" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Products</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <Link href={`/admin/products/${id}`} className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">{form.name}</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-800 dark:text-white/90 font-medium">Edit</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update the details for <span className="font-medium text-gray-700 dark:text-gray-300">{form.name}</span></p>
        </div>
        <Link
          href={`/admin/products/${id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Basic Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Core product details and identification</p>
            </div>
            <div className="px-6 py-5 grid gap-5 sm:grid-cols-2">
              {/* Product Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Wireless Headphones"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-white/[0.03] outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                    errors.name ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
                  }`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/[0.03] outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                    errors.category ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="e.g. WH-1024"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-white/[0.03] outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                    errors.sku ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
                  }`}
                />
                {errors.sku && <p className="mt-1.5 text-xs text-red-500">{errors.sku}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  placeholder="Optional product description..."
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-white/[0.03] outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Inventory & Pricing Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Inventory & Pricing</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Stock quantity, availability and pricing details</p>
            </div>
            <div className="px-6 py-5 grid gap-5 sm:grid-cols-3">
              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Stock Qty <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  placeholder="0"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/[0.03] outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                    errors.stock ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
                  }`}
                />
                {errors.stock && <p className="mt-1.5 text-xs text-red-500">{errors.stock}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/[0.03] outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none">$</span>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0.00"
                    className={`w-full rounded-xl border pl-8 pr-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/[0.03] outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                      errors.price ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
                    }`}
                  />
                </div>
                {errors.price && <p className="mt-1.5 text-xs text-red-500">{errors.price}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}