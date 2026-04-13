"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Badge from "@/components/ui/badge/Badge";
import { productApi } from "@/api";

interface CategoryDetails {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CategoryDetailsResponse {
  success?: boolean;
  message?: string;
  data?: CategoryDetails;
}

export default function ViewCategoryPage() {
  const params = useParams();
  const categoryId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [data, setData] = useState<CategoryDetails | null>(null);

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const fetchCategoryById = async () => {
      try {
        const res = await productApi.getCategoryById<CategoryDetailsResponse>(categoryId);
        setData(res.data ?? null);
      } catch (error) {
        console.error("Fetch category by id failed:", error);
      }
    };

    fetchCategoryById();
  }, [categoryId]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
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
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">{data?.name || "Category"}</h1>
              <Badge size="sm" color={data?.is_active ? "success" : "error"}>
                {data?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Category ID #{categoryId}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <Link
          href={`/admin/category/${categoryId}/edit`}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/[0.08] dark:text-gray-400 dark:hover:bg-white/[0.05] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Edit
        </Link>
      </div>

      {/* Details Card */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-white/80">Category Details</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          <div className="grid grid-cols-3 px-5 py-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
            <span className="col-span-2 text-sm font-medium text-gray-800 dark:text-white/90">{data?.name || "-"}</span>
          </div>
          <div className="grid grid-cols-3 px-5 py-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Slug</span>
            <span className="col-span-2">
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600 dark:bg-white/[0.05] dark:text-gray-400">
                {data?.slug || "-"}
              </span>
            </span>
          </div>
          <div className="grid grid-cols-3 px-5 py-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Description</span>
            <span className="col-span-2 text-sm text-gray-700 dark:text-white/70">{data?.description || "-"}</span>
          </div>
          <div className="grid grid-cols-3 px-5 py-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
            <span className="col-span-2">
              <Badge size="sm" color={data?.is_active ? "success" : "error"}>
                {data?.is_active ? "Active" : "Inactive"}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-3 px-5 py-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Created</span>
            <span className="col-span-2 text-sm text-gray-700 dark:text-white/70">{data?.created_at || "-"}</span>
          </div>
          <div className="grid grid-cols-3 px-5 py-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
            <span className="col-span-2 text-sm text-gray-700 dark:text-white/70">{data?.updated_at || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}