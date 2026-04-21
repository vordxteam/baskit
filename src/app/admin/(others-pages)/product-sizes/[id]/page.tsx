"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProductSize } from "@/api/productSize";
import { ProductSize as ProductSizeModel } from "@/api/productSize/types";
import Badge from "@/components/ui/badge/Badge";

export default function ProductSizeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const sizeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [size, setSize] = useState<ProductSizeModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sizeId) {
      setError("Missing product size id");
      setIsLoading(false);
      return;
    }

    const fetchSize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await new ProductSize().getSizeById(sizeId);
        setSize(response.data);
      } catch (err) {
        console.error("Error fetching size:", err);
        setError("Failed to load product size");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSize();
  }, [sizeId]);

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this product size? This action cannot be undone."
      )
    ) {
      try {
        if (!sizeId) {
          setError("Missing product size id");
          return;
        }

        await new ProductSize().deleteSize(sizeId);
        router.push("/admin/product-sizes");
        router.refresh();
      } catch (err) {
        console.error("Error deleting size:", err);
        setError("Failed to delete product size");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded dark:bg-white/10"></div>
          <div className="h-64 bg-gray-200 rounded-xl dark:bg-white/10"></div>
        </div>
      </div>
    );
  }

  if (error || !size) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <p className="text-red-600 dark:text-red-400">
            {error || "Product size not found"}
          </p>
          <Link
            href="/admin/product-sizes"
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {size.label}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Product Size Details
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        {/* Header with Badge */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {size.label}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {size.product_type_name}
            </p>
          </div>
          <Badge
            variant="light"
            color={size.is_active ? "success" : "light"}
          >
            {size.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Size Code
            </p>
            <p className="mt-2 text-lg font-mono font-medium text-gray-900 dark:text-white">
              {size.size_code}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Product Type
            </p>
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              {size.product_type_name}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Minimum Items
            </p>
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              {size.min_items} items
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Maximum Items
            </p>
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              {size.max_items} items
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              ID
            </p>
            <p className="mt-2 text-sm font-mono text-gray-600 dark:text-gray-400">
              {size.id}
            </p>
          </div>

          {size.stock_quantity !== null && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                Stock Quantity
              </p>
              <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                {size.stock_quantity || "N/A"}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
          <Link
            href="/admin/product-sizes"
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Back to List
          </Link>
          <Link
            href={`/admin/product-sizes/${size.id}/edit`}
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
