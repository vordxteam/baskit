"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { productApi } from "@/api";

interface CategoryDetailsApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    is_active: boolean;
    product_count?: number;
    created_at?: string;
  };
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [categoryMeta, setCategoryMeta] = useState<{ productCount: number; createdAt: string }>({
    productCount: 0,
    createdAt: "-",
  });
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

    return "Failed to update category.";
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = "Category name is required.";
    if (!form.slug.trim()) newErrors.slug = "Slug is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    return newErrors;
  };

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setApiError("Invalid category id.");
        setIsLoading(false);
        return;
      }

      setApiError("");

      try {
        setIsLoading(true);
        const res = await productApi.getCategoryById<CategoryDetailsApiResponse>(categoryId);
        const category = res?.data;

        if (!category) {
          setApiError("Category not found.");
          return;
        }

        setForm({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          status: category.is_active ? "Active" : "Inactive",
        });

        setCategoryMeta({
          productCount: category.product_count || 0,
          createdAt: category.created_at
            ? new Date(category.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "-",
        });
      } catch (error: unknown) {
        setApiError(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    if (!categoryId) {
      setApiError("Invalid category id.");
      return;
    }

    try {
      setIsSaving(true);
      await productApi.editCategory(categoryId, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        is_active: form.status === "Active",
      });
      router.push("/admin/category");
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

      {/* Page Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/category"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:border-white/[0.08] dark:hover:bg-white/[0.05] dark:hover:text-white/80 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Edit Category</h1>
            <Badge size="sm" color={form.status === "Active" ? "success" : "error"}>
              {form.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID #{categoryId} · {categoryMeta.productCount} products · Created {categoryMeta.createdAt}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit} noValidate>
          <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {/* Category Name */}
            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                disabled={isLoading || isSaving}
                placeholder="e.g. Electronics"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.name
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
                }`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Slug */}
            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-lg border border-gray-300 focus-within:border-brand-500 dark:border-white/[0.1] dark:focus-within:border-brand-500 overflow-hidden">
                <span className="flex-shrink-0 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-400 border-r border-gray-300 dark:bg-white/[0.03] dark:border-white/[0.1]">
                  /categories/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  disabled={isLoading || isSaving}
                  placeholder="electronics"
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-sm font-mono text-gray-800 placeholder-gray-400 outline-none dark:text-white/90 dark:placeholder-gray-500"
                />
              </div>
              {errors.slug && <p className="mt-1.5 text-xs text-red-500">{errors.slug}</p>}
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                Changing the slug may break existing links to this category.
              </p>
            </div>

            {/* Description */}
            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                disabled={isLoading || isSaving}
                placeholder="Brief description of this category..."
                className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
                  errors.description
                    ? "border-red-400 focus:border-red-400 dark:border-red-500"
                    : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
                }`}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Status */}
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
                      disabled={isLoading || isSaving}
                      onChange={() => setForm((prev) => ({ ...prev, status: s }))}
                      className="sr-only"
                    />
                    <span
                      className={`h-2 w-2 rounded-full ${s === "Active" ? "bg-green-500" : "bg-red-400"}`}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
            <Link
              href={`/admin/category/${categoryId}`}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white/80 transition-colors"
            >
              View category →
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/category"
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.04] transition-colors"
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