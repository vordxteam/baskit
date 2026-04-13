"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productApi, type CreateProductPayload } from "@/api";

const tierOptions = ["BASIC", "STANDARD", "PREMIUM"] as const;
const statusOptions = ["ACTIVE", "INACTIVE"] as const;

interface ProductTypeOption {
  id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductTypeApiResponse {
  data?: ProductTypeOption[];
}

interface CategoryApiResponse {
  data?: CategoryOption[];
}

interface ProductFormState {
  product_type_id: string;
  category_id: string;
  name: string;
  short_description: string;
  description: string;
  tier: (typeof tierOptions)[number];
  price: string;
  compare_at_price: string;
  status: (typeof statusOptions)[number];
  items: Array<{ name: string; quantity: string }>;
  images: File[];
}

const initialForm: ProductFormState = {
  product_type_id: "",
  category_id: "",
  name: "",
  short_description: "",
  description: "",
  tier: "BASIC",
  price: "",
  compare_at_price: "",
  status: "ACTIVE",
  items: [{ name: "", quantity: "" }],
  images: [],
};

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [apiError, setApiError] = useState("");
  const [productTypes, setProductTypes] = useState<ProductTypeOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const [typesRes, categoryRes] = await Promise.all([
          productApi.getProductTypes<ProductTypeApiResponse>(),
          productApi.getCategory<CategoryApiResponse>(),
        ]);

        setProductTypes(typesRes.data || []);
        setCategories(categoryRes.data || []);
      } catch (error) {
        console.error("Failed to load product options:", error);
        setApiError("Failed to load categories and product types.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!form.product_type_id) newErrors.product_type_id = "Product type is required";
    if (!form.category_id) newErrors.category_id = "Category is required";
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.short_description.trim()) newErrors.short_description = "Short description is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price.trim() || Number.isNaN(Number(form.price))) newErrors.price = "Valid price is required";
    if (!form.compare_at_price.trim() || Number.isNaN(Number(form.compare_at_price))) {
      newErrors.compare_at_price = "Valid compare at price is required";
    }

    const validItems = form.items.filter((item) => item.name.trim() && item.quantity.trim());
    if (validItems.length === 0) newErrors.items = "Add at least one item with quantity";
    if (form.images.length === 0) newErrors.images = "Upload at least one image";

    return newErrors;
  };

  const fileToBase64DataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          resolve(result);
          return;
        }
        reject(new Error("Failed to convert image file"));
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const media = await Promise.all(form.images.map(async (file) => ({ image: await fileToBase64DataUrl(file) })));

      const items = form.items
        .filter((item) => item.name.trim() && item.quantity.trim())
        .map((item) => ({
          name: item.name.trim(),
          quantity: Number(item.quantity),
        }));

      const payload: CreateProductPayload = {
        product: {
          product_type_id: form.product_type_id,
          name: form.name.trim(),
          short_description: form.short_description.trim(),
          description: form.description.trim(),
          tier: form.tier,
          price: Number(form.price),
          compare_at_price: Number(form.compare_at_price),
          status: form.status,
        },
        category_ids: [form.category_id],
        media,
        items,
      };

      await productApi.createProduct(payload);
      router.push("/admin/products");
    } catch (error) {
      console.error("Create product failed:", error);
      setApiError("Failed to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemChange = (index: number, field: "name" | "quantity", value: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { name: "", quantity: "" }] }));
  };

  const removeItemRow = (index: number) => {
    setForm((prev) => {
      if (prev.items.length === 1) return prev;
      return { ...prev, items: prev.items.filter((_, i) => i !== index) };
    });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/products" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Products</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-800 dark:text-white/90 font-medium">Add Product</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in the details below to add a new product to your inventory.</p>
      </div>

      {apiError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/5 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Basic Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Core product details and identification</p>
            </div>
            <div className="px-6 py-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.product_type_id}
                  disabled={isLoadingOptions}
                  onChange={(e) => handleChange("product_type_id", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                    errors.product_type_id
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                >
                  <option value="">Select product type</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.product_type_id && <p className="mt-1.5 text-xs text-red-500">{errors.product_type_id}</p>}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g. Wireless Headphones"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                    errors.name
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Category ID <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category_id}
                  disabled={isLoadingOptions}
                  onChange={(e) => handleChange("category_id", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                    errors.category_id
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="mt-1.5 text-xs text-red-500">{errors.category_id}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={(e) => handleChange("short_description", e.target.value)}
                  placeholder="Fresh tulip bouquet for spring celebrations"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                    errors.short_description
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                />
                {errors.short_description && <p className="mt-1.5 text-xs text-red-500">{errors.short_description}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  placeholder="Full product description"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 resize-none ${
                    errors.description
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                />
                {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tier <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {tierOptions.map((tier) => (
                    <label
                      key={tier}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                        form.tier === tier
                          ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-white/8 dark:text-gray-400 dark:hover:border-white/15"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tier"
                        checked={form.tier === tier}
                        value={tier}
                        onChange={(e) => handleChange("tier", e.target.value)}
                        className="sr-only"
                      />
                      {tier}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inventory & Pricing Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/5 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Inventory & Pricing</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Status and pricing details</p>
            </div>
            <div className="px-6 py-5 grid gap-5 sm:grid-cols-3">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none">$</span>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="24.99"
                    className={`w-full rounded-xl border pl-8 pr-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                      errors.price
                        ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                        : "border-gray-200 dark:border-white/10"
                    }`}
                  />
                </div>
                {errors.price && <p className="mt-1.5 text-xs text-red-500">{errors.price}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Compare At Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Compare At Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none">$</span>
                  <input
                    type="text"
                    value={form.compare_at_price}
                    onChange={(e) => handleChange("compare_at_price", e.target.value)}
                    placeholder="29.99"
                    className={`w-full rounded-xl border pl-8 pr-4 py-2.5 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 ${
                      errors.compare_at_price
                        ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                        : "border-gray-200 dark:border-white/10"
                    }`}
                  />
                </div>
                {errors.compare_at_price && <p className="mt-1.5 text-xs text-red-500">{errors.compare_at_price}</p>}
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/5 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Items</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Each item needs a name and quantity</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              {form.items.map((item, index) => (
                <div key={`item-${index}`} className="grid grid-cols-12 gap-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    placeholder="Item name"
                    className="col-span-7 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    placeholder="Qty"
                    className="col-span-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 bg-white dark:bg-white/3 outline-none transition-all focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    className="col-span-2 rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/6"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
              <button
                type="button"
                onClick={addItemRow}
                className="rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/6"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Media Card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-white/5 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Media</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Upload one or more images (binary files)</p>
            </div>
            <div className="px-6 py-5">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setForm((prev) => ({ ...prev, images: files }));
                  setErrors((prev) => {
                    if (!prev.images) return prev;
                    const next = { ...prev };
                    delete next.images;
                    return next;
                  });
                }}
                className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-600 hover:file:bg-brand-100"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {form.images.length > 0 ? `${form.images.length} image(s) selected` : "No images selected"}
              </p>
              {errors.images && <p className="mt-1.5 text-xs text-red-500">{errors.images}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/6 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}