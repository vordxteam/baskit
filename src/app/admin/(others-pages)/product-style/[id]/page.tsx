"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminProductStyle } from "@/api/adminProductStyle";
import type { ProductStyleDetailResponse, ProductStyleItem } from "@/api/adminProductStyle/types";

const adminProductStyle = new AdminProductStyle();

const resolveStyleDetail = (payload?: ProductStyleDetailResponse["data"]): ProductStyleItem | null => {
  if (!payload) return null;
  return payload;
};

export default function ProductStyleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const styleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [style, setStyle] = useState<ProductStyleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!styleId) {
      setError("Missing product style id");
      setIsLoading(false);
      return;
    }

    const fetchStyle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await adminProductStyle.getProductStyle<ProductStyleDetailResponse>(styleId);
        const data = resolveStyleDetail(response?.data);
        if (!data) {
          setError("Product style not found");
          return;
        }
        setStyle(data);
      } catch (fetchError) {
        console.error("Error fetching product style:", fetchError);
        setError("Failed to load product style");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStyle();
  }, [styleId]);

  const handleDelete = async () => {
    if (!styleId) {
      setError("Missing product style id");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product style?")) {
      return;
    }

    try {
      await adminProductStyle.deleteProductStyle(styleId);
      router.push("/admin/product-style");
      router.refresh();
    } catch (deleteError) {
      console.error("Error deleting product style:", deleteError);
      setError("Failed to delete product style");
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-64 rounded-xl bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  if (error || !style) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <p className="text-red-600 dark:text-red-400">{error || "Product style not found"}</p>
          <Link
            href="/admin/product-style"
            className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{style.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Product Style Details</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{style.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{style.product_type_name || "-"}</p>
          </div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              style.is_active
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300"
            }`}
          >
            {style.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Slug</p>
            <p className="mt-2 text-lg font-mono font-medium text-gray-900 dark:text-white">{style.slug}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Product Type</p>
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">{style.product_type_name || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Sort Order</p>
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">{style.sort_order ?? "-"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">ID</p>
            <p className="mt-2 text-sm font-mono text-gray-600 dark:text-gray-400">{style.id}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Description</p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{style.description || "No description"}</p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 pt-6 dark:border-white/5">
          <Link
            href="/admin/product-style"
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Back to List
          </Link>
          <Link
            href={`/admin/product-style/${style.id}/edit`}
            className="flex-1 rounded-lg bg-brand-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
