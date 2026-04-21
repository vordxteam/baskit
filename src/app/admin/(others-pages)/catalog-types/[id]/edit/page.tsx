"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductInventory } from "@/api/productInventory";
import type { CreateData } from "@/api/productInventory";

interface CatalogTypeListItem {
  id?: string;
  label?: string;
  value?: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

interface CatalogListResponse {
  data?: CatalogTypeListItem[] | { data?: CatalogTypeListItem[] };
}

interface CatalogDetailResponse {
  data?: CatalogTypeListItem | { data?: CatalogTypeListItem };
}

type CatalogTypeFormState = {
  label: string;
  value: string;
  is_active: boolean;
};

const inventoryApi = new ProductInventory();

const resolveCatalogDetailItem = (
  payload?: CatalogDetailResponse["data"]
): CatalogTypeListItem | undefined => {
  if (!payload || Array.isArray(payload) || typeof payload !== "object") return undefined;

  const wrapped = payload as { data?: CatalogTypeListItem };
  if (wrapped.data && typeof wrapped.data === "object") {
    return wrapped.data;
  }

  return payload as CatalogTypeListItem;
};

const mapCatalogTypeToForm = (
  item: CatalogTypeListItem,
  fallbackId: string
): CatalogTypeFormState => ({
  label: item.label || item.name || "",
  value: item.value || item.description || fallbackId,
  is_active: item.is_active ?? true,
});

export default function EditCatalogTypePage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const catalogId = decodeURIComponent(idParam || "");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CatalogTypeFormState>({
    label: "",
    value: "",
    is_active: true,
  });

  useEffect(() => {
    const fetchCatalogType = async () => {
      if (!catalogId) {
        setError("Missing catalog type id");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        try {
          const detailResponse = await inventoryApi.getCatalogById<CatalogDetailResponse>(catalogId);
          const detailItem = resolveCatalogDetailItem(detailResponse?.data);

          if (detailItem) {
            setForm(mapCatalogTypeToForm(detailItem, catalogId));
            return;
          }
        } catch {
          // Fallback to list endpoint when detail endpoint is unavailable.
        }

        const listResponse = await inventoryApi.getCatalog<CatalogListResponse>();
        const listData = listResponse?.data;
        const list = Array.isArray(listData)
          ? listData
          : Array.isArray(listData?.data)
            ? listData.data
            : [];

        const found = list.find((item) => item.value === catalogId || item.id === catalogId);

        if (!found) {
          setError("Catalog type not found");
          return;
        }

        setForm(mapCatalogTypeToForm(found, catalogId));
      } catch (fetchError) {
        console.error("Error fetching catalog type:", fetchError);
        setError("Failed to load catalog type");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogType();
  }, [catalogId]);

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

    if (!catalogId) {
      setError("Missing catalog type id");
      return;
    }

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

      await inventoryApi.updateCatalog(catalogId, payload);
      router.push("/admin/catalog-types");
      router.refresh();
    } catch (submitError) {
      console.error("Error updating catalog type:", submitError);
      setError("Failed to update catalog type");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-44 rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-64 rounded-xl bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Catalog Type</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Update catalog type details</p>
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
              {isSubmitting ? "Updating..." : "Update Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
