"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductContainer, ProductContainerData } from "@/api/productContainer";
import { ProductApi } from "@/api";
import { ProductSubType } from "@/api/productSubType";

export default function EditProductContainerPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<Array<{ id: string; label: string }>>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<ProductContainerData>({
    product_type_id: "",
    name: "",
    description: "",
    image: "",
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoadingData(true);

        // Fetch container data
        const productContainerApi = new ProductSubType();
        const containerData = await productContainerApi.getSubtype(id);

        if (containerData) {
          setForm({
            id: containerData.id,
            product_type_id: containerData.product_type_id || "",
            name: containerData.name || "",
            description: containerData.description || "",
            image: containerData.image || containerData.image_url || "",
            is_active: containerData.is_active ?? true,
          });
          setImagePreview(containerData.image || containerData.image_url || null);
        }

        // Fetch product types
        const response = await new ProductApi().getProductTypes();
        const types =
          (response as any)?.data
            ?.filter((type: any) => type.is_active !== false)
            ?.map((type: any) => ({
              id: type.id,
              label: type.name,
            })) || [];

        setProductTypes(types);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load container data");
      } finally {
        setIsLoadingData(false);
        setIsLoadingTypes(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setForm((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!id) {
      setError("Container ID is missing");
      return;
    }

    if (!form.product_type_id) {
      setError("Please select a product type");
      return;
    }

    if (!form.name) {
      setError("Please enter a container name");
      return;
    }

    if (!form.image) {
      setError("Please upload an image");
      return;
    }


    try {
      setIsLoading(true);
      const productSubApi = new ProductSubType();
      await productSubApi.updateSubtype(id, form);
      router.push("/admin/baskit-container");
    } catch (err) {
      console.error("Error updating product subtype:", err);
      setError("Failed to update product subtype");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading container...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Product Subtype
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update subtype details
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
              Product Type <span className="text-red-500">*</span>
            </label>
            {isLoadingTypes ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 dark:border-white/10 dark:bg-white/3 dark:text-gray-400">
                Loading product types...
              </div>
            ) : (
              <select
                name="product_type_id"
                value={form.product_type_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
              >
                <option value="">Select a product type</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Glass Vase"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description for this container"
              rows={3}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
              Image <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-600 hover:file:bg-brand-100 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
              />
              {imagePreview && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Active Status */}
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

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingTypes}
              className="flex-1 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Container"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}