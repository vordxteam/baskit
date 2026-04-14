"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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

interface ApiProductItem {
  name?: string;
  quantity?: number;
}

interface ApiProductMedia {
  id: string;
  media_url?: string;
  alt_text?: string | null;
  is_primary?: boolean;
}

interface ApiProductDetails {
  id: string;
  name?: string;
  short_description?: string;
  description?: string;
  status?: string;
  price?: string | number;
  compare_at_price?: string | number;
  tier?: string;
  product_type_id?: string;
  categories?: { id: string; name: string }[] | string[];
  items?: ApiProductItem[];
  media?: ApiProductMedia[];
}

interface ProductDetailsResponse {
  data?: ApiProductDetails;
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const isSubmittingRef = useRef(false);
  const [form, setForm] = useState<ProductFormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductTypeOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [productName, setProductName] = useState("");
  const [existingImages, setExistingImages] = useState<ApiProductMedia[]>([]);
  const [replacementImagePreviews, setReplacementImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      try {
        setIsLoadingOptions(true);
        setPageError("");

        const [productRes, typesRes, categoryRes] = await Promise.all([
          productApi.getAdminProductById<ProductDetailsResponse>(id),
          productApi.getProductTypes<ProductTypeApiResponse>({ is_active: true }),
          productApi.getCategory<CategoryApiResponse>({ is_active: true }),
        ]);

        const product = productRes?.data;
        if (!product) {
          setNotFound(true);
          return;
        }

        setProductTypes(typesRes.data || []);
        setCategories(categoryRes.data || []);
        setProductName(product.name || "");
        setExistingImages(product.media || []);

        // Resolve category_id — API may return objects or plain strings
        const firstCategory = product.categories?.[0];
        const categoryId =
          firstCategory && typeof firstCategory === "object"
            ? (firstCategory as { id: string }).id
            : (firstCategory as string) ?? "";

        const tier = tierOptions.includes(product.tier as (typeof tierOptions)[number])
          ? (product.tier as (typeof tierOptions)[number])
          : "BASIC";

        const status: (typeof statusOptions)[number] =
          product.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";

        const price = Number(product.price ?? 0);
        const compareAtPrice = Number(product.compare_at_price ?? 0);

        const items =
          product.items && product.items.length > 0
            ? product.items.map((item) => ({
                name: item.name || "",
                quantity: String(item.quantity ?? ""),
              }))
            : [{ name: "", quantity: "" }];

        setForm({
          product_type_id: product.product_type_id || "",
          category_id: categoryId,
          name: product.name || "",
          short_description: product.short_description || "",
          description: product.description || "",
          tier,
          price: Number.isFinite(price) ? String(price) : "",
          compare_at_price: Number.isFinite(compareAtPrice) ? String(compareAtPrice) : "",
          status,
          items,
          images: [],
        });
      } catch (error) {
        console.error("Failed to load product:", error);
        setPageError("Failed to load product details.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    return () => {
      replacementImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [replacementImagePreviews]);

  const validate = (): Record<string, string> => {
    if (!form) return {};
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

    return newErrors;
  };

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleItemChange = (index: number, field: "name" | "quantity", value: string) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
          }
        : prev
    );
  };

  const addItemRow = () => {
    setForm((prev) => (prev ? { ...prev, items: [...prev.items, { name: "", quantity: "" }] } : prev));
  };

  const removeItemRow = (index: number) => {
    setForm((prev) => {
      if (!prev || prev.items.length === 1) return prev;
      return { ...prev, items: prev.items.filter((_, i) => i !== index) };
    });
  };

  const handleImageSelection = (files: File[]) => {
    setForm((prev) => (prev ? { ...prev, images: files } : prev));

    setReplacementImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return files.map((file) => URL.createObjectURL(file));
    });

    setErrors((prev) => {
      if (!prev.images) return prev;
      const next = { ...prev };
      delete next.images;
      return next;
    });
  };

  const clearReplacementImages = () => {
    setForm((prev) => (prev ? { ...prev, images: [] } : prev));
    setReplacementImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setPageError("");
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      isSubmittingRef.current = false;
      return;
    }

    setIsSubmitting(true);

    try {
      const media = form.images.map((file) => ({ image: file }));

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

      await productApi.updateProduct(id, payload);
      router.push(`/admin/products/${id}`);
    } catch (error) {
      console.error("Update product failed:", error);
      setPageError("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!form && !notFound) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading product...
        </div>
      </div>
    );
  }

  // ── Not found state ────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Product not found</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The product you're looking for doesn't exist.</p>
        </div>
        <Link href="/admin/products" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/products" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Products</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <Link href={`/admin/products/${id}`} className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          {productName || "Product"}
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-800 dark:text-white/90 font-medium">Edit</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update the details for{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">{form!.name}</span>
          </p>
        </div>
        <Link
          href={`/admin/products/${id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/6 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View
        </Link>
      </div>

      {pageError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {pageError}
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
              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form!.product_type_id}
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
                    <option key={type.id} value={type.id}>{type.name}</option>
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
                  value={form!.name}
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

              {/* Occasions / Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Occasions <span className="text-red-500">*</span>
                </label>
                <select
                  value={form!.category_id}
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

              {/* Short Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form!.short_description}
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
                  value={form!.description}
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

              {/* Tier */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tier <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {tierOptions.map((tier) => (
                    <label
                      key={tier}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                        form!.tier === tier
                          ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-white/8 dark:text-gray-400 dark:hover:border-white/15"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tier"
                        checked={form!.tier === tier}
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
                    type="number"
                    step="0.01"
                    value={form!.price}
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
                  value={form!.status}
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
                    type="number"
                    step="0.01"
                    value={form!.compare_at_price}
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
              {form!.items.map((item, index) => (
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Upload new images to replace existing ones (optional)
              </p>
            </div>
            <div className="px-6 py-5">
              {replacementImagePreviews.length > 0 ? (
                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Replacement Images</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {replacementImagePreviews.map((previewUrl, index) => (
                      <div
                        key={`replacement-${index}`}
                        className="overflow-hidden rounded-lg border border-brand-200 bg-brand-50/40 dark:border-brand-500/20 dark:bg-brand-500/10"
                      >
                        <img
                          src={previewUrl}
                          alt={`Replacement preview ${index + 1}`}
                          className="h-36 w-full object-cover"
                        />
                        <div className="px-3 py-2 text-xs text-brand-700 dark:text-brand-300">
                          Will replace image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={clearReplacementImages}
                    className="mt-3 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/6"
                  >
                    Keep Existing Images
                  </button>
                </div>
              ) : existingImages.length > 0 ? (
                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Current Images</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {existingImages.map((mediaItem, index) => (
                      <div
                        key={mediaItem.id}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/4"
                      >
                        {mediaItem.media_url ? (
                          <img
                            src={mediaItem.media_url}
                            alt={mediaItem.alt_text || `${form!.name || "Product"} image ${index + 1}`}
                            className="h-36 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-36 items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                            Image unavailable
                          </div>
                        )}
                        <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="truncate">{mediaItem.alt_text || `Image ${index + 1}`}</span>
                          {mediaItem.is_primary && (
                            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                              Primary
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">No existing images found.</p>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleImageSelection(files);
                }}
                className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-600 hover:file:bg-brand-100"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {form!.images.length > 0
                  ? `${form!.images.length} replacement image(s) selected`
                  : "No new images selected — existing images will be kept"}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}