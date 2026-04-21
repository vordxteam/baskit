"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { CreateConfiguredProductPayload, productApi, type UpdateProductFullPayload } from "@/api";
import { ProductSize } from "@/api/productSize";
import { ProductInventory } from "@/api/productInventory";
import type { InventoryItem, InventoryListResponse } from "@/api/productInventory/types";
import { MediaSection } from "../../add/components/MediaSection";
import { ProductBasicsSection } from "../../add/components/ProductBasicsSection";
import { SizesSection } from "../../add/components/SizesSection";
import { StylesAndOccasionsSection } from "../../add/components/StylesAndOccasionsSection";
import {
  createEmptySizeForm,
  initialForm,
  type CategoryOption,
  type FormErrors,
  type ProductForm,
  type ProductStyleOption,
  type ProductTypeOption,
  type SizeErrors,
  type SizeForm,
  type SizeItemForm,
  type SizeTemplateOption,
} from "../../add/components/types";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const normalizeArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (isRecord(value)) {
    const data = value.data;

    if (Array.isArray(data)) {
      return data as T[];
    }

    if (isRecord(data) && Array.isArray(data.data)) {
      return data.data as T[];
    }
  }

  return [];
};

const normalizeSizeTemplates = (value: unknown): SizeTemplateOption[] => {
  if (isRecord(value) && isRecord(value.data) && Array.isArray(value.data.sizes)) {
    return value.data.sizes as SizeTemplateOption[];
  }

  return [];
};

const normalizeInventoryItems = (value: unknown): InventoryItem[] => {
  if (isRecord(value) && isRecord(value.data) && Array.isArray(value.data.data)) {
    return value.data.data as InventoryItem[];
  }

  if (isRecord(value) && Array.isArray(value.data)) {
    return value.data as InventoryItem[];
  }

  return [];
};

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
};

interface ApiMediaItem {
  id: string;
  image: string;
  alt_text?: string;
  is_primary?: boolean;
}

interface ApiSizeItem {
  id: string;
  catalog_item_id: string;
  name: string;
  quantity: number;
}

interface ApiSize {
  id: string;
  size_code: string;
  label: string;
  items: ApiSizeItem[];
  colors: {
    net: string[];
    ribbon: string[];
    product_color: string[];
  };
  fillers: string[];
}

interface ApiProductStyle {
  id: string;
  name: string;
}

interface ApiProductResponse {
  success: boolean;
  data: {
    id: string;
    product_type_id: string;
    sku: string;
    name: string;
    slug: string;
    short_description: string;
    description: string;
    status: string;
    categories: string[];
    media: ApiMediaItem[];
    product_styles: ApiProductStyle[];
    sizes: ApiSize[];
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const submitGuardRef = useRef(false);

  const [form, setForm] = useState<ProductForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sizeErrors, setSizeErrors] = useState<SizeErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingStyles, setIsLoadingStyles] = useState(false);
  const [apiError, setApiError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [productTypes, setProductTypes] = useState<ProductTypeOption[]>([]);
  const [productStyles, setProductStyles] = useState<ProductStyleOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [sizeTemplates, setSizeTemplates] = useState<SizeTemplateOption[]>([]);
  const [catalogItems, setCatalogItems] = useState<InventoryItem[]>([]);
  const [selectedSizeTemplateId, setSelectedSizeTemplateId] = useState("");

  const availableSizeTemplates = useMemo(() => {
    const activeTemplates = sizeTemplates.filter((template) => template.is_active !== false);
    if (!form.product_type_id) {
      return activeTemplates;
    }

    return activeTemplates.filter((template) => template.product_type_id === form.product_type_id);
  }, [form.product_type_id, sizeTemplates]);

  // Load product data on mount
  useEffect(() => {
    const loadProductData = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      try {
        setIsLoadingData(true);
        const response = await productApi.getAdminProductById<ApiProductResponse>(id);
        const apiProduct = response.data;

        if (!apiProduct) {
          setNotFound(true);
          return;
        }

        // Transform API response to form structure
        const transformedForm: ProductForm = {
          product_type_id: apiProduct.product_type_id,
          product_style_ids: apiProduct.product_styles.map((style) => style.id),
          category_ids: apiProduct.categories,
          name: apiProduct.name,
          short_description: apiProduct.short_description,
          description: apiProduct.description,
          status: apiProduct.status as "ACTIVE" | "INACTIVE",
          media: apiProduct.media.map((mediaItem) => ({
            previewUrl: mediaItem.image,
            alt_text: mediaItem.alt_text || "",
            is_primary: mediaItem.is_primary || false,
            file: undefined as unknown as File,
          })),
          sizes: apiProduct.sizes.map((apiSize) => ({
            size_template_id: apiSize.id,
            items: apiSize.items.map((item) => ({
              catalog_item_id: item.catalog_item_id,
              quantity: String(item.quantity),
            })),
            colors: {
              net: apiSize.colors.net,
              ribbon: apiSize.colors.ribbon,
              product_color: apiSize.colors.product_color,
            },
            fillers: apiSize.fillers,
          })),
        };

        setForm(transformedForm);
      } catch (error) {
        console.error("Failed to load product:", error);
        setApiError("Failed to load product details.");
        setNotFound(true);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadProductData();
  }, [id]);

  // Load static options on mount
  useEffect(() => {
    const loadStaticOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const [typesRes, categoriesRes, sizesRes, inventoryRes] = await Promise.all([
          productApi.getProductTypes<unknown>({ is_active: true }),
          productApi.getCategory<unknown>({ is_active: true }),
          new ProductSize().getSizes(),
          new ProductInventory().getInventory<InventoryListResponse>(),
        ]);

        setProductTypes(normalizeArray<ProductTypeOption>(typesRes));
        setCategories(normalizeArray<CategoryOption>(categoriesRes));
        setSizeTemplates(normalizeSizeTemplates(sizesRes));
        setCatalogItems(normalizeInventoryItems(inventoryRes));
      } catch (error) {
        console.error("Failed to load product options:", error);
        setApiError("Failed to load product types, categories, sizes, or inventory items.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadStaticOptions();
  }, []);

  // Load styles when product type changes
  useEffect(() => {
    const loadStyles = async () => {
      if (!form.product_type_id) {
        setProductStyles([]);
        return;
      }

      try {
        setIsLoadingStyles(true);
        const response = await productApi.getProductStyles<unknown>(form.product_type_id);
        const styles = normalizeArray<ProductStyleOption>(response);
        setProductStyles(styles);
        setForm((previous: ProductForm) => ({
          ...previous,
          product_style_ids: previous.product_style_ids.filter((styleId) =>
            styles.some((style) => style.id === styleId)
          ),
        }));
      } catch (error) {
        console.error("Failed to load product styles:", error);
        setProductStyles([]);
        setForm((previous: ProductForm) => ({ ...previous, product_style_ids: [] }));
      } finally {
        setIsLoadingStyles(false);
      }
    };

    loadStyles();
  }, [form.product_type_id]);

  useEffect(() => {
    return () => {
      form.media.forEach((mediaItem) => URL.revokeObjectURL(mediaItem.previewUrl));
    };
  }, [form.media]);

  const setToggleArray = (
    field: "product_style_ids" | "category_ids",
    value: string,
  ) => {
    setForm((previous: ProductForm) => {
      const list = previous[field];
      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

      return { ...previous, [field]: next };
    });
    clearFormError(field);
  };

  const updateFormField = <K extends keyof ProductForm>(field: K, value: ProductForm[K]) => {
    setForm((previous: ProductForm) => ({ ...previous, [field]: value }));
  };

  const clearFormError = (field: keyof FormErrors) => {
    setErrors((previous: FormErrors) => {
      if (!previous[field]) {
        return previous;
      }

      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const handleProductTypeChange = (productTypeId: string) => {
    setForm((previous: ProductForm) => ({
      ...previous,
      product_type_id: productTypeId,
      product_style_ids: [],
      sizes: [],
    }));
    setSelectedSizeTemplateId("");
    clearFormError("product_type_id");
    clearFormError("product_style_ids");
    clearFormError("sizes");
    setSizeErrors({});
  };

  const handleMediaFiles = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setForm((previous: ProductForm) => {
      const nextMedia = [...previous.media];
      const hasPrimary = nextMedia.some((item) => item.is_primary);

      files.forEach((file, index) => {
        nextMedia.push({
          file,
          previewUrl: URL.createObjectURL(file),
          alt_text: "",
          is_primary: !hasPrimary && nextMedia.length === index,
        });
      });

      if (nextMedia.length > 0 && !nextMedia.some((item) => item.is_primary)) {
        nextMedia[0] = { ...nextMedia[0], is_primary: true };
      }

      return { ...previous, media: nextMedia };
    });

    setErrors((previous: FormErrors) => {
      if (!previous.media) {
        return previous;
      }

      const next = { ...previous };
      delete next.media;
      return next;
    });
  };

  const removeMedia = (index: number) => {
    setForm((previous: ProductForm) => {
      const target = previous.media[index];
      if (target && target.file) {
        URL.revokeObjectURL(target.previewUrl);
      }

      const nextMedia = previous.media.filter((_, currentIndex) => currentIndex !== index);
      if (nextMedia.length > 0 && !nextMedia.some((item) => item.is_primary)) {
        nextMedia[0] = { ...nextMedia[0], is_primary: true };
      }

      return { ...previous, media: nextMedia };
    });
  };

  const updateMediaAltText = (index: number, value: string) => {
    setForm((previous: ProductForm) => ({
      ...previous,
      media: previous.media.map((mediaItem, currentIndex) =>
        currentIndex === index ? { ...mediaItem, alt_text: value } : mediaItem
      ),
    }));
  };

  const setPrimaryMedia = (index: number) => {
    setForm((previous: ProductForm) => ({
      ...previous,
      media: previous.media.map((mediaItem, currentIndex) => ({
        ...mediaItem,
        is_primary: currentIndex === index,
      })),
    }));
  };

  const addSizeConfiguration = () => {
    if (!selectedSizeTemplateId) {
      setErrors((previous: FormErrors) => ({
        ...previous,
        sizes: "Select a size template before adding a configuration.",
      }));
      return;
    }

    if (form.sizes.some((size) => size.size_template_id === selectedSizeTemplateId)) {
      setErrors((previous: FormErrors) => ({
        ...previous,
        sizes: "This size template is already added.",
      }));
      return;
    }

    setForm((previous: ProductForm) => ({
      ...previous,
      sizes: [...previous.sizes, createEmptySizeForm(selectedSizeTemplateId)],
    }));
    setSelectedSizeTemplateId("");
    setSizeErrors({});
    setErrors((previous: FormErrors) => {
      const next = { ...previous };
      delete next.sizes;
      return next;
    });
  };

  const removeSizeConfiguration = (sizeIndex: number) => {
    setForm((previous: ProductForm) => ({
      ...previous,
      sizes: previous.sizes.filter((_, currentIndex) => currentIndex !== sizeIndex),
    }));
    setSizeErrors((previous: SizeErrors) => {
      const next = { ...previous };
      const removedSize = form.sizes[sizeIndex];
      if (removedSize) {
        delete next[removedSize.size_template_id];
      }
      return next;
    });
  };

  const updateSizeField = (sizeIndex: number, updater: (size: SizeForm) => SizeForm) => {
    setForm((previous: ProductForm) => ({
      ...previous,
      sizes: previous.sizes.map((size, currentIndex) =>
        currentIndex === sizeIndex ? updater(size) : size
      ),
    }));
  };

  const addSizeItemRow = (sizeIndex: number) => {
    updateSizeField(sizeIndex, (size) => ({
      ...size,
      items: [...size.items, { catalog_item_id: "", quantity: "" }],
    }));
  };

  const updateSizeItemRow = (
    sizeIndex: number,
    rowIndex: number,
    field: keyof SizeItemForm,
    value: string,
  ) => {
    if (field === "quantity" && !/^\d*$/.test(value)) {
      return;
    }

    updateSizeField(sizeIndex, (size) => ({
      ...size,
      items: size.items.map((item, currentIndex) =>
        currentIndex === rowIndex ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeSizeItemRow = (sizeIndex: number, rowIndex: number) => {
    updateSizeField(sizeIndex, (size) => {
      if (size.items.length === 1) {
        return size;
      }

      return {
        ...size,
        items: size.items.filter((_, currentIndex) => currentIndex !== rowIndex),
      };
    });
  };

  const toggleSizeColor = (
    sizeIndex: number,
    channel: keyof SizeForm["colors"],
    color: string,
  ) => {
    updateSizeField(sizeIndex, (size) => {
      const current = size.colors[channel];
      return {
        ...size,
        colors: {
          ...size.colors,
          [channel]: current.includes(color)
            ? current.filter((item) => item !== color)
            : [...current, color],
        },
      };
    });
  };

  const addFillerRow = (sizeIndex: number) => {
    updateSizeField(sizeIndex, (size) => ({
      ...size,
      fillers: [...size.fillers, ""],
    }));
  };

  const updateFillerRow = (sizeIndex: number, fillerIndex: number, value: string) => {
    updateSizeField(sizeIndex, (size) => ({
      ...size,
      fillers: size.fillers.map((filler, currentIndex) =>
        currentIndex === fillerIndex ? value : filler
      ),
    }));
  };

  const removeFillerRow = (sizeIndex: number, fillerIndex: number) => {
    updateSizeField(sizeIndex, (size) => {
      if (size.fillers.length === 1) {
        return size;
      }

      return {
        ...size,
        fillers: size.fillers.filter((_, currentIndex) => currentIndex !== fillerIndex),
      };
    });
  };

  const appendSizeError = (
    nextSizeErrors: SizeErrors,
    sizeTemplateId: string,
    message: string,
  ) => {
    nextSizeErrors[sizeTemplateId] = nextSizeErrors[sizeTemplateId]
      ? `${nextSizeErrors[sizeTemplateId]} ${message}`
      : message;
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    const nextSizeErrors: SizeErrors = {};

    if (!form.product_type_id) nextErrors.product_type_id = "Product type is required";
    if (form.product_style_ids.length === 0) nextErrors.product_style_ids = "Select at least one product style";
    if (form.category_ids.length === 0) nextErrors.category_ids = "Select at least one occasion";
    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (!form.short_description.trim()) nextErrors.short_description = "Short description is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (form.media.length === 0) nextErrors.media = "Upload at least one image";
    if (form.sizes.length === 0) nextErrors.sizes = "Add at least one size configuration";

    form.sizes.forEach((size) => {
      const validItems = size.items.filter(
        (item) => item.catalog_item_id && item.quantity.trim() && Number(item.quantity) > 0
      );
      const validFillerValues = size.fillers.map((filler) => filler.trim()).filter(Boolean);
      const sizeTemplate = sizeTemplates.find((template) => template.id === size.size_template_id);
      const totalQuantity = validItems.reduce((total, item) => total + Number(item.quantity), 0);

      if (validItems.length === 0) {
        appendSizeError(nextSizeErrors, size.size_template_id, "Add at least one catalog item and quantity.");
      }

      if (sizeTemplate?.min_items !== null && sizeTemplate?.min_items !== undefined && totalQuantity < sizeTemplate.min_items) {
        appendSizeError(
          nextSizeErrors,
          size.size_template_id,
          `Total quantity must be at least ${sizeTemplate.min_items}.`,
        );
      }

      if (sizeTemplate?.max_items !== null && sizeTemplate?.max_items !== undefined && totalQuantity > sizeTemplate.max_items) {
        appendSizeError(
          nextSizeErrors,
          size.size_template_id,
          `Total quantity cannot exceed ${sizeTemplate.max_items}.`,
        );
      }

      if (
        size.colors.ribbon.length === 0 ||
        size.colors.net.length === 0 ||
        size.colors.product_color.length === 0
      ) {
        appendSizeError(nextSizeErrors, size.size_template_id, "Select at least one color in each group.");
      }

      if (validFillerValues.length === 0) {
        appendSizeError(nextSizeErrors, size.size_template_id, "Add at least one filler.");
      }
    });

    setErrors(nextErrors);
    setSizeErrors(nextSizeErrors);

    return Object.keys(nextErrors).length === 0 && Object.keys(nextSizeErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (submitGuardRef.current) {
      return;
    }

    submitGuardRef.current = true;
    setApiError("");

    if (!validate()) {
      submitGuardRef.current = false;
      return;
    }

    try {
      setIsSubmitting(true);

      // Process media: new files get converted to base64, existing URLs are kept as-is
      const media = await Promise.all(
        form.media.map(async (mediaItem, index) => {
          const image = mediaItem.file
            ? await fileToDataUrl(mediaItem.file)
            : mediaItem.previewUrl;

          return {
            image,
            alt_text: mediaItem.alt_text.trim() || `${form.name.trim() || "Product"} image ${index + 1}`,
            is_primary: mediaItem.is_primary,
            sort_order: index,
          };
        })
      );

   const payload: CreateConfiguredProductPayload = {
           product: {
             product_type_id: form.product_type_id,
             name: form.name.trim(),
             short_description: form.short_description.trim(),
             description: form.description.trim(),
             status: form.status,
           },
           product_style_ids: form.product_style_ids,
           category_ids: form.category_ids,
           media: media as CreateConfiguredProductPayload["media"],
           sizes: form.sizes.map((size) => ({
             size_template_id: size.size_template_id,
             items: size.items
               .filter((item) => item.catalog_item_id && item.quantity.trim() && Number(item.quantity) > 0)
               .map((item) => ({
                 catalog_item_id: item.catalog_item_id,
                 quantity: Number(item.quantity),
               })),
             colors: {
               ribbon: size.colors.ribbon,
               net: size.colors.net,
               product_color: size.colors.product_color,
             },
             fillers: size.fillers.map((filler) => filler.trim()).filter(Boolean),
           })) as CreateConfiguredProductPayload["sizes"],
         };

      console.log("Submitting product update with payload:", payload);

      await productApi.updateProductFull(id!, payload);
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Update product failed:", error);
      setApiError("Failed to update product.");
    } finally {
      setIsSubmitting(false);
      submitGuardRef.current = false;
    }
  };

  // Loading state
  if (isLoadingData) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading product...
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
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
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/products" className="transition-colors hover:text-gray-700 dark:hover:text-gray-200">
          Products
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <Link href={`/admin/products/${id}`} className="transition-colors hover:text-gray-700 dark:hover:text-gray-200">
          {form.name || "Product"}
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-medium text-gray-800 dark:text-white/90">Edit</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Modify the product details, styles, sizes, and media.
        </p>
      </div>

      {apiError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProductBasicsSection
          form={form}
          errors={errors}
          isLoadingOptions={isLoadingOptions}
          productTypes={productTypes}
          onProductTypeChange={handleProductTypeChange}
          onNameChange={(value) => updateFormField("name", value)}
          onShortDescriptionChange={(value) => updateFormField("short_description", value)}
          onDescriptionChange={(value) => updateFormField("description", value)}
          onStatusChange={(value) => updateFormField("status", value)}
        />

        <StylesAndOccasionsSection
          form={form}
          errors={errors}
          productStyles={productStyles}
          categories={categories}
          isLoadingStyles={isLoadingStyles}
          onToggle={setToggleArray}
        />

        <MediaSection
          form={form}
          errors={errors}
          onMediaFiles={handleMediaFiles}
          onRemoveMedia={removeMedia}
          onUpdateAltText={updateMediaAltText}
          onSetPrimaryMedia={setPrimaryMedia}
        />

        <SizesSection
          form={form}
          errors={errors}
          sizeErrors={sizeErrors}
          selectedSizeTemplateId={selectedSizeTemplateId}
          availableSizeTemplates={availableSizeTemplates}
          sizeTemplates={sizeTemplates}
          catalogItems={catalogItems}
          onSelectedSizeTemplateChange={setSelectedSizeTemplateId}
          onAddSizeConfiguration={addSizeConfiguration}
          onRemoveSizeConfiguration={removeSizeConfiguration}
          onAddSizeItemRow={addSizeItemRow}
          onUpdateSizeItemRow={updateSizeItemRow}
          onRemoveSizeItemRow={removeSizeItemRow}
          onAddFillerRow={addFillerRow}
          onUpdateFillerRow={updateFillerRow}
          onRemoveFillerRow={removeFillerRow}
          onToggleSizeColor={toggleSizeColor}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingOptions}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
