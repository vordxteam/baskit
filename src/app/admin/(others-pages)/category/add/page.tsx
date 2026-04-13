"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productApi, type ApiMessageResponse } from "@/api";

// adjust this import path according to your project structure

export default function AddCategoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
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

    return "Something went wrong while creating category.";
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
    }));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};

    if (!form.name.trim()) newErrors.name = "Category name is required.";
    if (!form.slug.trim()) newErrors.slug = "Slug is required.";
    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
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
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        is_active: form.status === "Active",
      };

      const res = await productApi.createCategory<ApiMessageResponse>(payload);

      console.log("Category created successfully:", res);

      if (res.success !== false) {
        router.push("/admin/category");
      } else {
        setApiError(res.message || "Unable to create category.");
      }

    } catch (error: unknown) {
      console.error("Create category failed:", error);
      setApiError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/category"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-white/[0.08] dark:hover:bg-white/[0.05] dark:hover:text-white/80"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>

        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Add Category
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a new product category
          </p>
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
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Electronics"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.name
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="overflow-hidden rounded-lg border border-gray-300 focus-within:border-brand-500 dark:border-white/[0.1] dark:focus-within:border-brand-500 flex items-center">
                <span className="flex-shrink-0 border-r border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-400 dark:border-white/[0.1] dark:bg-white/[0.03]">
                  /categories/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: slugify(e.target.value),
                    }))
                  }
                  placeholder="electronics"
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-sm font-mono text-gray-800 placeholder-gray-400 outline-none dark:text-white/90 dark:placeholder-gray-500"
                />
              </div>
              {errors.slug && (
                <p className="mt-1.5 text-xs text-red-500">{errors.slug}</p>
              )}
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                Auto-generated from the name. Only lowercase letters, numbers
                and hyphens.
              </p>
            </div>

            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of this category..."
                className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.description
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
                }`}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Status
              </label>
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
                      onChange={() =>
                        setForm((prev) => ({ ...prev, status: s }))
                      }
                      className="sr-only"
                    />
                    <span
                      className={`h-2 w-2 rounded-full ${
                        s === "Active" ? "bg-green-500" : "bg-red-400"
                      }`}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
            <Link
              href="/admin/category"
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.04]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}