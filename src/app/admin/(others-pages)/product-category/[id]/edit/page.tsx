"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { productApi } from "@/api";

const PRODUCT_TYPE_CODE_OPTIONS = ["BOUQUET", "BASKET"] as const;

interface ProductTypeDetailsApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    id: string;
    code?: string;
    name: string;
    description?: string | null;
    is_active: boolean;
    sort_order?: number;
    created_at?: string;
  };
}

export default function EditProductCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const typeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    sortOrder: "0",
    status: "Active" as "Active" | "Inactive",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [createdAt, setCreatedAt] = useState("-");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) {
        return response.data.message;
      }
    }

    return "Failed to update product category.";
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!PRODUCT_TYPE_CODE_OPTIONS.includes(form.code as (typeof PRODUCT_TYPE_CODE_OPTIONS)[number])) {
      newErrors.code = "Code must be BOUQUET or BASKET.";
    }
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    if (!form.sortOrder.trim() || Number.isNaN(Number(form.sortOrder))) {
      newErrors.sortOrder = "Valid sort order is required.";
    }
    return newErrors;
  };

  useEffect(() => {
    const fetchType = async () => {
      if (!typeId) {
        setApiError("Invalid product category id.");
        setIsLoading(false);
        return;
      }

      setApiError("");

      try {
        setIsLoading(true);
        const res = await productApi.getProductTypeById<ProductTypeDetailsApiResponse>(typeId);
        const type = res?.data;

        if (!type) {
          setApiError("Product category not found.");
          return;
        }

        const normalizedCode = (type.code || "").toUpperCase();
        setForm({
          code: PRODUCT_TYPE_CODE_OPTIONS.includes(normalizedCode as (typeof PRODUCT_TYPE_CODE_OPTIONS)[number])
            ? normalizedCode
            : "",
          name: type.name || "",
          description: type.description || "",
          sortOrder: String(type.sort_order ?? 0),
          status: type.is_active ? "Active" : "Inactive",
        });

        setCreatedAt(
          type.created_at
            ? new Date(type.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "-"
        );
      } catch (error: unknown) {
        setApiError(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchType();
  }, [typeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    if (!typeId) {
      setApiError("Invalid product category id.");
      return;
    }

    try {
      setIsSaving(true);
      await productApi.updateProductType(typeId, {
        code: form.code,
        name: form.name.trim(),
        description: form.description.trim(),
        is_active: form.status === "Active",
        sort_order: Number(form.sortOrder),
      });
      router.push("/admin/product-category");
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {apiError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {apiError}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/product-category"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:border-white/8 dark:hover:bg-white/5 dark:hover:text-white/80 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Edit Product Category</h1>
            <Badge size="sm" color={form.status === "Active" ? "success" : "error"}>
              {form.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID #{typeId} · Created {createdAt}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <form onSubmit={handleSubmit} noValidate>
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Code <span className="text-red-500">*</span>
              </label>
              <select
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                disabled={isLoading || isSaving}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors dark:bg-transparent dark:text-white/90 ${
                  errors.code
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/10 dark:focus:border-brand-500"
                }`}
              >
                <option value="" disabled>
                  Select code
                </option>
                {PRODUCT_TYPE_CODE_OPTIONS.map((codeOption) => (
                  <option key={codeOption} value={codeOption}>
                    {codeOption}
                  </option>
                ))}
              </select>
              {errors.code && <p className="mt-1.5 text-xs text-red-500">{errors.code}</p>}
            </div>

            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                disabled={isLoading || isSaving}
                placeholder="e.g. Basket"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.name
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/10 dark:focus:border-brand-500"
                }`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                disabled={isLoading || isSaving}
                placeholder="Brief description of this product category..."
                className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.description
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/10 dark:focus:border-brand-500"
                }`}
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                  Sort Order <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                  disabled={isLoading || isSaving}
                  placeholder="0"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                    errors.sortOrder
                      ? "border-red-400 focus:border-red-400 dark:border-red-500"
                      : "border-gray-300 focus:border-brand-500 dark:border-white/10 dark:focus:border-brand-500"
                  }`}
                />
                {errors.sortOrder && <p className="mt-1.5 text-xs text-red-500">{errors.sortOrder}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">Status</label>
                <div className="flex gap-3">
                  {(["Active", "Inactive"] as const).map((s) => (
                    <label
                      key={s}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                        form.status === s
                          ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-white/8 dark:text-gray-400 dark:hover:border-white/15"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={form.status === s}
                        disabled={isLoading || isSaving}
                        onChange={() => setForm((prev) => ({ ...prev, status: s }))}
                        className="sr-only"
                      />
                      <span className={`h-2 w-2 rounded-full ${s === "Active" ? "bg-green-500" : "bg-red-400"}`} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-white/5">
            <Link
              href={`/admin/product-category/${typeId}`}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white/80 transition-colors"
            >
              View product category →
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/product-category"
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/8 dark:text-gray-400 dark:hover:bg-white/4 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || isSaving}
                className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                {isLoading ? "Loading..." : isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
