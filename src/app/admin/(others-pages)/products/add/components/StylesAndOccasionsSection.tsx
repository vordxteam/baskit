import React from "react";
import type { CategoryOption, FormErrors, ProductForm, ProductStyleOption } from "./types";

type StylesAndOccasionsSectionProps = {
  form: ProductForm;
  errors: FormErrors;
  productStyles: ProductStyleOption[];
  categories: CategoryOption[];
  isLoadingStyles: boolean;
  onToggle: (field: "product_style_ids" | "category_ids", value: string) => void;
};

export function StylesAndOccasionsSection({
  form,
  errors,
  productStyles,
  categories,
  isLoadingStyles,
  onToggle,
}: StylesAndOccasionsSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/5 dark:bg-white/3">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Styles and Occasions</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Choose one or more styles and occasions.
        </p>
      </div>

      <div className="grid gap-6 px-6 py-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Styles <span className="text-red-500">*</span>
            </label>
            {isLoadingStyles && <span className="text-xs text-gray-500 dark:text-gray-400">Loading styles...</span>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {productStyles.map((style) => {
              const selected = form.product_style_ids.includes(style.id);
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onToggle("product_style_ids", style.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    selected
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-white/10 dark:bg-white/3 dark:text-gray-300"
                  }`}
                >
                  <span className="block font-medium">{style.name}</span>
                  <span className="block text-xs opacity-75">{selected ? "Selected" : "Click to select"}</span>
                </button>
              );
            })}
          </div>
          {!form.product_type_id && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Choose a product type first to load styles.</p>
          )}
          {errors.product_style_ids && <p className="mt-1.5 text-xs text-red-500">{errors.product_style_ids}</p>}
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Occasions / Categories <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => {
              const selected = form.category_ids.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onToggle("category_ids", category.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                    selected
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-white/10 dark:bg-white/3 dark:text-gray-300"
                  }`}
                >
                  <span className="block font-medium">{category.name}</span>
                  <span className="block text-xs opacity-75">{selected ? "Selected" : "Click to select"}</span>
                </button>
              );
            })}
          </div>
          {errors.category_ids && <p className="mt-1.5 text-xs text-red-500">{errors.category_ids}</p>}
        </div>
      </div>
    </section>
  );
}