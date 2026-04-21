"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminProductStyle } from "@/api/adminProductStyle";
import type {
  ProductStyleDetailResponse,
  ProductStyleItem,
  ProductTypeOption,
  ProductTypeOptionsResponse,
  UpdateProductStyleRequest,
} from "@/api/adminProductStyle/types";
import { ProductApi } from "@/api/products";

const adminProductStyle = new AdminProductStyle();
const productApi = new ProductApi();

type StyleFormState = {
  product_type_id: string;
  name: string;
  description: string;
  image: string;
  is_active: boolean;
};

const resolveStyleDetail = (payload?: ProductStyleDetailResponse["data"]): ProductStyleItem | null => {
  if (!payload) return null;
  return payload;
};

const resolveProductTypes = (payload?: ProductTypeOptionsResponse["data"]): ProductTypeOption[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function EditProductStylePage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const styleId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<ProductTypeOption[]>([]);
  const [imageError, setImageError] = useState(false);
  const [form, setForm] = useState<StyleFormState>({
    product_type_id: "",
    name: "",
    description: "",
    image: "",
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!styleId) {
          setError("Missing product style id");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        const [typesResponse, styleResponse] = await Promise.all([
          productApi.getProductTypes<ProductTypeOptionsResponse>(),
          adminProductStyle.getProductStyle<ProductStyleDetailResponse>(styleId),
        ]);

        const types = resolveProductTypes(typesResponse?.data).filter((type) => type.is_active !== false);
        setProductTypes(types);

        const style = resolveStyleDetail(styleResponse?.data);
        if (!style) {
          setError("Product style not found");
          return;
        }

        setForm({
          product_type_id: style.product_type_id || "",
          name: style.name || "",
          description: style.description || "",
          image: style.image_url || "",
          is_active: Boolean(style.is_active),
        });
      } catch (fetchError) {
        console.error("Error fetching product style:", fetchError);
        setError("Failed to load product style");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [styleId]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));

    if (name === "image") {
      setImageError(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const blobLink = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: blobLink }));
    setImageError(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!styleId) {
      setError("Missing product style id");
      return;
    }

    if (!form.product_type_id) {
      setError("Please select a product type");
      return;
    }

    if (!form.name.trim()) {
      setError("Style name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: UpdateProductStyleRequest = {
        product_type_id: form.product_type_id,
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image || "",
        is_active: form.is_active,
      };

      await adminProductStyle.updateProductStyle(styleId, payload);
      router.push(`/admin/product-style/${styleId}`);
      router.refresh();
    } catch (submitError) {
      console.error("Error updating product style:", submitError);
      setError("Failed to update product style");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product Style</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Update product style details</p>
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
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              name="product_type_id"
              value={form.product_type_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
            >
              <option value="">Select a product type</option>
              {productTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white/90">
              Style Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
              placeholder="e.g., Wrapped"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white/90">Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white/90">Image</label>
            <div className="mb-3 h-28 w-28 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
              {form.image && !imageError ? (
                <img
                  src={form.image}
                  alt={form.name || "Product style image"}
                  className="h-full w-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  Image preview not available
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
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
              {isSubmitting ? "Updating..." : "Update Style"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
