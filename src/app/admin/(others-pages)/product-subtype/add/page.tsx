"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductSubType } from "@/api/productSubType";
import { ProductInventory } from "@/api/productInventory";
import { ProductApi } from "@/api";

type ProductType = {
  id: string;
  label: string;
};

type CatalogType = {
  id: string;
  name: string;
};

type RawCatalogType = {
  id?: string;
  name?: string;
  label?: string;
  code?: string;
  value?: string;
  is_active?: boolean;
};

type CatalogResponse = {
  data?: RawCatalogType[] | { data?: RawCatalogType[] };
};

interface ProductSubtypeFormData {
  product_type_id: string;
  catalog_item_type_ids: string[];
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export default function AddProductContainerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [catalogTypes, setCatalogTypes] = useState<CatalogType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<ProductSubtypeFormData>({
    product_type_id: "",
    catalog_item_type_ids: [],
    name: "",
    description: "",
    image_url: "",
    is_active: true,
  });

  const normalizeCatalogTypes = (items: RawCatalogType[]): CatalogType[] => {
    return items
      .filter((item) => item.is_active !== false)
      .map((item) => {
        const id = (item.id ?? "").toString().trim();
        const name = (item.name ?? item.label ?? item.code ?? item.value ?? "").toString().trim();

        if (!id || !name) {
          return null;
        }

        return { id, name };
      })
      .filter((item): item is CatalogType => item !== null);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoadingTypes(true);

        const [productTypeResponse, catalogResponse] = await Promise.all([
          new ProductApi().getProductTypes(),
          new ProductInventory().getCatalog<CatalogResponse>(),
        ]);

        const mappedProductTypes =
          (productTypeResponse as { data?: Array<{ id?: string; name?: string; is_active?: boolean }> })?.data
            ?.filter((type) => type.is_active !== false)
            ?.map((type) => ({
              id: (type.id ?? "").toString(),
              label: (type.name ?? "").toString(),
            }))
            ?.filter((type) => type.id && type.label) || [];

        const catalogData = catalogResponse?.data;
        const catalogList = Array.isArray(catalogData)
          ? catalogData
          : Array.isArray(catalogData?.data)
            ? catalogData.data
            : [];

        setProductTypes(mappedProductTypes);
        setCatalogTypes(normalizeCatalogTypes(catalogList));
      } catch (err) {
        console.error("Error fetching form options:", err);
        setError("Failed to load product and catalog types");
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "catalog_item_type_ids") {
      const selectedIds = Array.from((e.target as HTMLSelectElement).selectedOptions).map(
        (option) => option.value
      );
      setForm((prev) => ({ ...prev, catalog_item_type_ids: selectedIds }));
      return;
    }

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
      setForm((prev) => ({ ...prev, image_url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.product_type_id) {
      setError("Please select a product type");
      return;
    }

    if (form.catalog_item_type_ids.length === 0) {
      setError("Please select at least one catalog type");
      return;
    }

    if (!form.name) {
      setError("Please enter a container name");
      return;
    }

    if (!form.image_url) {
      setError("Please upload an image");
      return;
    }
    
    try {
      setIsLoading(true);
      await new ProductSubType().createSubtype({
        product_type_id: form.product_type_id,
        catalog_item_type_ids: form.catalog_item_type_ids,
        name: form.name,
        description: form.description,
        image_url: form.image_url,
        is_active: form.is_active,
      });
      router.push("/admin/product-subtype");
      router.refresh();
    } catch (err) {
      console.error("Error creating product subtype:", err);
      setError("Failed to create product subtype");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add Product Subtype
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create a new product container
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

          {/* Catalog Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/90 mb-2">
              Catalog Types <span className="text-red-500">*</span>
            </label>
            {isLoadingTypes ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 dark:border-white/10 dark:bg-white/3 dark:text-gray-400">
                Loading catalog types...
              </div>
            ) : (
              <>
                <select
                name="catalog_item_type_ids"
                multiple
                value={form.catalog_item_type_ids}
                onChange={handleChange}
                className="h-36 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
              >
                {catalogTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple catalog types.
              </p>
              </>
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
              {isLoading ? "Creating..." : "Create Container"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}