import React from "react";
import { statusOptions, type FormErrors, type ProductForm, type ProductTypeOption } from "./types";

type ProductBasicsSectionProps = {
  form: ProductForm;
  errors: FormErrors;
  isLoadingOptions: boolean;
  productTypes: ProductTypeOption[];
  onProductTypeChange: (productTypeId: string) => void;
  onNameChange: (value: string) => void;
  onShortDescriptionChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStatusChange: (value: ProductForm["status"]) => void;
};

export function ProductBasicsSection({
  form,
  errors,
  isLoadingOptions,
  productTypes,
  onProductTypeChange,
  onNameChange,
  onShortDescriptionChange,
  onDescriptionChange,
  onStatusChange,
}: ProductBasicsSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/5 dark:bg-white/3">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Product Basics</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Start with the shared product information.
        </p>
      </div>

      <div className="grid gap-5 px-6 py-5 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.product_type_id}
            disabled={isLoadingOptions}
            onChange={(event) => onProductTypeChange(event.target.value)}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:bg-white/3 dark:text-white/90 dark:focus:ring-brand-400 ${
              errors.product_type_id ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Anniversary Rose Bouquet"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:ring-brand-400 ${
              errors.name ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
            }`}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.short_description}
            onChange={(event) => onShortDescriptionChange(event.target.value)}
            placeholder="Beautiful roses for anniversary"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:ring-brand-400 ${
              errors.short_description ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
            }`}
          />
          {errors.short_description && <p className="mt-1.5 text-xs text-red-500">{errors.short_description}</p>}
        </div>

        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={4}
            placeholder="A stunning bouquet of red roses..."
            className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:ring-brand-400 ${
              errors.description ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"
            }`}
          />
          {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            value={form.status}
            onChange={(event) => onStatusChange(event.target.value as ProductForm["status"])}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90 dark:focus:ring-brand-400"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}