"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { ProductInventory, type InventoryDetailResponse, type InventoryItem } from "@/api/productInventory";

const inventoryApi = new ProductInventory();

export default function InventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [item, setItem] = useState<InventoryItem | null | undefined>(undefined);
  const [pageError, setPageError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setItem(null);
        return;
      }

      try {
        setPageError("");
        const response = await inventoryApi.getInventoryById<InventoryDetailResponse>(id);
        setItem(response?.data || null);
      } catch (error) {
        console.error("Failed to load inventory item:", error);
        setPageError("Failed to load inventory item details.");
        setItem(null);
      }
    };

    fetchItem();
  }, [id]);

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const handleDelete = async () => {
    if (!id || isDeleting || !window.confirm("Delete this inventory item?")) return;

    try {
      setIsDeleting(true);
      setPageError("");
      await inventoryApi.deleteInventory(id);
      router.push("/admin/inventory");
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      setPageError("Failed to delete inventory item.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (item === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Inventory item not found</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The item you are looking for does not exist.</p>
        </div>
        <Link href="/admin/inventory" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {pageError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {pageError}
        </div>
      )}

      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/inventory" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          Inventory
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-medium text-gray-800 dark:text-white/90">{item.name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.name}</h1>
            <Badge size="sm" color={item.is_active ? "success" : "warning"}>
              {item.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Type: {item.type} · SKU: {item.sku || "-"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/admin/inventory/${item.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/6">
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="h-72 w-full rounded-lg object-cover" />
          ) : (
            <div className="flex h-72 w-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400 dark:border-white/10 dark:bg-white/2">
              No image available
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Item Details</h2>
            </div>
            <dl className="divide-y divide-gray-100 dark:divide-white/5">
              <div className="flex items-center px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">Name</dt>
                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{item.name}</dd>
              </div>
              <div className="flex items-center px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">Type</dt>
                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{item.type}</dd>
              </div>
              <div className="flex items-center px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">Price</dt>
                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{item.price}</dd>
              </div>
              <div className="flex items-center px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">Stock Quantity</dt>
                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{item.stock_quantity}</dd>
              </div>
              <div className="flex items-center px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">Status</dt>
                <dd>
                  <Badge size="sm" color={item.is_active ? "success" : "warning"}>
                    {item.is_active ? "Active" : "Inactive"}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-start px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">Description</dt>
                <dd className="text-sm text-gray-800 dark:text-white/90 leading-relaxed">{item.description}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Metadata</h2>
            </div>
            <dl className="divide-y divide-gray-100 dark:divide-white/5">
              <div className="flex items-center px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">Created At</dt>
                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{formatDate(item.created_at)}</dd>
              </div>
              <div className="flex items-center px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">Updated At</dt>
                <dd className="text-sm font-medium text-gray-800 dark:text-white/90">{formatDate(item.updated_at)}</dd>
              </div>
              <div className="flex items-center px-6 py-4">
                <dt className="w-36 shrink-0 text-sm text-gray-500 dark:text-gray-400">ID</dt>
                <dd className="font-mono text-sm text-gray-800 dark:text-white/90 break-all">{item.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
