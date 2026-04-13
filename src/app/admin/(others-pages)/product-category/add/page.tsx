"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productApi, type ApiMessageResponse } from "@/api";

export default function AddProductCategoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    sortOrder: "0",
    status: "Active" as "Active" | "Inactive",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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

    return "Something went wrong while creating product category.";
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};

    if (!form.code.trim()) newErrors.code = "Code is required.";
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    if (!form.sortOrder.trim() || Number.isNaN(Number(form.sortOrder))) {
      newErrors.sortOrder = "Valid sort order is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        is_active: form.status === "Active",
        sort_order: Number(form.sortOrder),
      };

      const res = await productApi.createProductType<ApiMessageResponse>(payload);

      if (res.success !== false) {
        router.push("/admin/product-category");
      } else {
        setApiError(res.message || "Unable to create product category.");
      }
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/product-category"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-white/[0.08] dark:hover:bg-white/[0.05] dark:hover:text-white/80"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Add Product Category</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create a new product type/category.</p>
        </div>
      </div>

      {apiError && (
        <div className="mb-4">
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {apiError}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} noValidate>
          <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="e.g. BASKET"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.code
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
                }`}
              />
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
                placeholder="e.g. Basket"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.name
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
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
                placeholder="Brief description of this product category..."
                className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.description
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
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
                  placeholder="0"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                    errors.sortOrder
                      ? "border-red-400 focus:border-red-400 dark:border-red-500"
                      : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
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
                          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-white/[0.08] dark:text-gray-400 dark:hover:border-white/[0.15]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={form.status === s}
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

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
            <Link
              href="/admin/product-category"
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.04]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
            >
              {loading ? "Creating..." : "Create Product Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
