"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProductInventory, type InventoryDetailResponse, type InventoryItem, type CreateInventoryRequest } from "@/api/productInventory";

const inventoryApi = new ProductInventory();

interface InventoryFormState {
  type: string;
  name: string;
  description: string;
  image: string;
  price: string;
  stock_quantity: string;
  is_active: boolean;
}

export default function EditInventoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState<InventoryFormState | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof InventoryFormState, string>>>({});
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
    }
    return "Failed to update inventory item.";
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setPageError("");
        const response = await inventoryApi.getInventoryById<InventoryDetailResponse>(id);
        const item = response?.data;

        if (!item) {
          setNotFound(true);
          return;
        }

        setForm({
          type: item.catalog_item_type_id || item.type || "",
          name: item.name || "",
          description: item.description || "",
          image: item.image_url || "",
          price: String(item.price ?? ""),
          stock_quantity: String(item.stock_quantity ?? ""),
          is_active: Boolean(item.is_active),
        });
      } catch (error) {
        console.error("Failed to load inventory item:", error);
        setPageError("Failed to load inventory item.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const validate = () => {
    if (!form) return {};
    const nextErrors: Partial<Record<keyof InventoryFormState, string>> = {};
    if (!form.type.trim()) nextErrors.type = "Type is required.";
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.image.trim()) nextErrors.image = "Image URL is required.";
    if (!form.price.trim() || Number.isNaN(Number(form.price))) nextErrors.price = "Valid price is required.";
    if (!form.stock_quantity.trim() || Number.isNaN(Number(form.stock_quantity))) {
      nextErrors.stock_quantity = "Valid stock quantity is required.";
    }
    return nextErrors;
  };

  const handleChange = (field: keyof InventoryFormState, value: string | boolean) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (field === "image") {
      setImageLoadError(false);
    }
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const blobLink = URL.createObjectURL(file);
    setForm((prev) => {
      if (!prev) return prev;

      if (prev.image?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.image);
      }

      return { ...prev, image: blobLink };
    });

    setImageLoadError(false);
    setErrors((prev) => {
      if (!prev.image) return prev;
      const next = { ...prev };
      delete next.image;
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPageError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!id || !form) {
      setPageError("Invalid inventory item id.");
      return;
    }

    try {
      setIsSaving(true);
      const payload: CreateInventoryRequest = {
        catalog_item_type_id: form.type.trim(),
        type: form.type.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        is_active: form.is_active,
      };

      const response = await inventoryApi.updateInventory<{ success?: boolean; message?: string }>(id, payload);
      if (response?.success === false) {
        setPageError(response?.message || "Unable to update inventory item.");
        return;
      }

      router.push("/admin/inventory");
    } catch (error) {
      console.error("Update inventory failed:", error);
      setPageError(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading inventory item...
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Inventory item not found</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The item you are trying to edit does not exist.</p>
        </div>
        <Link href="/admin/inventory" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          Back to Inventory
        </Link>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {pageError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {pageError}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/inventory"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:border-white/8 dark:hover:bg-white/5 dark:hover:text-white/80"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Edit Inventory Item</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update the inventory item using the same payload as create.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <form onSubmit={handleSubmit} noValidate>
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            <Field label="Type" required error={errors.type}>
              <input
                type="text"
                value={form.type}
                onChange={(event) => handleChange("type", event.target.value)}
                className={inputClass(errors.type)}
                placeholder="FLOWER"
              />
            </Field>

            <Field label="Name" required error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className={inputClass(errors.name)}
                placeholder="Red Rose"
              />
            </Field>

            <Field label="Description" required error={errors.description}>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => handleChange("description", event.target.value)}
                className={inputClass(errors.description)}
                placeholder="Item description"
              />
            </Field>

            <Field label="Image URL" required error={errors.image}>
              <div className="space-y-3">
                <div className="h-28 w-28 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
                  {form.image && !imageLoadError ? (
                    <img
                      src={form.image}
                      alt={form.name || "Inventory image"}
                      className="h-full w-full object-contain"
                      onError={() => setImageLoadError(true)}
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
                  onChange={handleFileImageChange}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm dark:border-white/[0.1] dark:bg-transparent dark:text-white/90"
                />

                <input
                  type="text"
                  value={form.image}
                  onChange={(event) => handleChange("image", event.target.value)}
                  className={inputClass(errors.image)}
                  placeholder="https://example.com/image.jpg or blob link"
                />
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => handleChange("price", event.target.value)}
                  className={inputClass(errors.price)}
                  placeholder="0.00"
                />
                {errors.price && <p className="mt-1.5 text-xs text-red-500">{errors.price}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(event) => handleChange("stock_quantity", event.target.value)}
                  className={inputClass(errors.stock_quantity)}
                  placeholder="0"
                />
                {errors.stock_quantity && <p className="mt-1.5 text-xs text-red-500">{errors.stock_quantity}</p>}
              </div>
            </div>

            <div className="px-5 py-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">Status</label>
              <div className="flex gap-3">
                {([
                  { label: "Active", value: true },
                  { label: "Inactive", value: false },
                ] as const).map((option) => (
                  <label
                    key={option.label}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                      form.is_active === option.value
                        ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-white/8 dark:text-gray-400 dark:hover:border-white/15"
                    }`}
                  >
                    <input
                      type="radio"
                      name="is_active"
                      checked={form.is_active === option.value}
                      onChange={() => handleChange("is_active", option.value)}
                      className="sr-only"
                    />
                    <span className={`h-2 w-2 rounded-full ${option.value ? "bg-green-500" : "bg-red-400"}`} />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4 dark:border-white/5">
            <Link href="/admin/inventory" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/6">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Update Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-5">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError?: string) {
  return `w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors dark:bg-transparent dark:text-white/90 dark:placeholder-gray-500 ${
    hasError
      ? "border-red-400 focus:border-red-400 dark:border-red-500"
      : "border-gray-300 focus:border-brand-500 dark:border-white/[0.1] dark:focus:border-brand-500"
  }`;
}
