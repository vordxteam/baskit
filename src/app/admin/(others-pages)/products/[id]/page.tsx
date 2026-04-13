"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import ConfirmationModal from "@/components/example/ModalExample/ConfirmationModal";

const allProducts = [
  { id: 1, product: { name: "Wireless Headphones", category: "Electronics" }, sku: "WH-1024", stock: 48, status: "In Stock" as const, price: "$129.00", description: "Premium wireless headphones with noise cancellation and 30-hour battery life. Foldable design for easy portability." },
  { id: 2, product: { name: "Smart Watch Pro", category: "Wearables" }, sku: "SW-2048", stock: 12, status: "Low Stock" as const, price: "$249.00", description: "Advanced smartwatch with health tracking, GPS, and a 5-day battery." },
  { id: 3, product: { name: "Bluetooth Speaker", category: "Audio" }, sku: "BS-3091", stock: 0, status: "Out of Stock" as const, price: "$89.00", description: "" },
  { id: 4, product: { name: "Gaming Mouse", category: "Accessories" }, sku: "GM-4455", stock: 27, status: "In Stock" as const, price: "$59.00", description: "" },
  { id: 5, product: { name: "Mechanical Keyboard", category: "Accessories" }, sku: "MK-7788", stock: 9, status: "Low Stock" as const, price: "$139.00", description: "" },
  { id: 6, product: { name: "4K Monitor", category: "Displays" }, sku: "MN-9001", stock: 16, status: "In Stock" as const, price: "$399.00", description: "" },
  { id: 7, product: { name: "USB-C Hub", category: "Gadgets" }, sku: "UH-2210", stock: 0, status: "Out of Stock" as const, price: "$45.00", description: "" },
  { id: 8, product: { name: "Portable SSD", category: "Storage" }, sku: "PS-6543", stock: 33, status: "In Stock" as const, price: "$179.00", description: "" },
];

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [product, setProduct] = useState<(typeof allProducts)[0] | null | undefined>(undefined);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const found = allProducts.find((p) => p.id === id);
    setProduct(found ?? null);
  }, [id]);

  const handleDelete = () => {
    // In real app: call delete API
    router.push("/admin/products");
  };

  if (product === undefined) {
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

  if (!product) {
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

  const stockColor =
    product.status === "In Stock"
      ? "success"
      : product.status === "Low Stock"
      ? "warning"
      : "error";

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/admin/products" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Products</Link>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-gray-800 dark:text-white/90 font-medium">{product.product.name}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.product.name}</h1>
              <Badge size="sm" color={stockColor}>{product.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.product.category} · SKU: {product.sku}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/admin/products/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={() => setDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Product Details Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Product Details</h2>
            </div>
            <dl className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              <div className="flex items-center px-6 py-4">
                <dt className="w-40 shrink-0 text-sm text-gray-500 dark:text-gray-400">Product Name</dt>
                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{product.product.name}</dd>
              </div>
              <div className="flex items-center px-6 py-4">
                <dt className="w-40 shrink-0 text-sm text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{product.product.category}</dd>
              </div>
              <div className="flex items-center px-6 py-4">
                <dt className="w-40 shrink-0 text-sm text-gray-500 dark:text-gray-400">SKU</dt>
                <dd className="font-mono text-sm text-gray-800 dark:text-white/90">{product.sku}</dd>
              </div>
              {product.description && (
                <div className="flex items-start px-6 py-4">
                  <dt className="w-40 shrink-0 text-sm text-gray-500 dark:text-gray-400">Description</dt>
                  <dd className="text-sm text-gray-800 dark:text-white/90 leading-relaxed">{product.description}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Inventory & Pricing Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/[0.05] px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Inventory & Pricing</h2>
            </div>

            <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-white/[0.05] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {/* Stock */}
              <div className="px-6 py-6 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Stock</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{product.stock}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">units available</p>
              </div>

              {/* Price */}
              <div className="px-6 py-6 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Price</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{product.price}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">per unit</p>
              </div>

              {/* Status */}
              <div className="px-6 py-6 flex flex-col items-center justify-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Status</p>
                <Badge size="sm" color={stockColor}>{product.status}</Badge>
                {product.status === "Low Stock" && (
                  <p className="text-xs text-amber-500 dark:text-amber-400">Consider restocking soon</p>
                )}
                {product.status === "Out of Stock" && (
                  <p className="text-xs text-red-500 dark:text-red-400">Restock required</p>
                )}
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Products
            </Link>

            <p className="text-xs text-gray-400 dark:text-gray-500">Product ID: #{product.id}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.product.name}"? This action is permanent and cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
}