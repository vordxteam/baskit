import React from "react";
import type { InventoryItem } from "@/api/productInventory/types";
import { colorOptions, type FormErrors, type ProductForm, type SizeErrors, type SizeForm, type SizeTemplateOption } from "./types";

type SizesSectionProps = {
  form: ProductForm;
  errors: FormErrors;
  sizeErrors: SizeErrors;
  selectedSizeTemplateId: string;
  availableSizeTemplates: SizeTemplateOption[];
  sizeTemplates: SizeTemplateOption[];
  catalogItems: InventoryItem[];
  onSelectedSizeTemplateChange: (value: string) => void;
  onAddSizeConfiguration: () => void;
  onRemoveSizeConfiguration: (sizeIndex: number) => void;
  onAddSizeItemRow: (sizeIndex: number) => void;
  onUpdateSizeItemRow: (
    sizeIndex: number,
    rowIndex: number,
    field: "catalog_item_id" | "quantity",
    value: string,
  ) => void;
  onRemoveSizeItemRow: (sizeIndex: number, rowIndex: number) => void;
  onAddFillerRow: (sizeIndex: number) => void;
  onUpdateFillerRow: (sizeIndex: number, fillerIndex: number, value: string) => void;
  onRemoveFillerRow: (sizeIndex: number, fillerIndex: number) => void;
  onToggleSizeColor: (sizeIndex: number, channel: keyof SizeForm["colors"], color: string) => void;
};

const getSizeTotalQuantity = (size: SizeForm) => {
  return size.items.reduce((total, item) => {
    const quantity = Number(item.quantity);
    if (!item.catalog_item_id || !Number.isFinite(quantity) || quantity <= 0) {
      return total;
    }

    return total + quantity;
  }, 0);
};

export function SizesSection({
  form,
  errors,
  sizeErrors,
  selectedSizeTemplateId,
  availableSizeTemplates,
  sizeTemplates,
  catalogItems,
  onSelectedSizeTemplateChange,
  onAddSizeConfiguration,
  onRemoveSizeConfiguration,
  onAddSizeItemRow,
  onUpdateSizeItemRow,
  onRemoveSizeItemRow,
  onAddFillerRow,
  onUpdateFillerRow,
  onRemoveFillerRow,
  onToggleSizeColor,
}: SizesSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/5 dark:bg-white/3">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Sizes</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Add each size template and configure its items, colors, and fillers.
        </p>
      </div>

      <div className="space-y-6 px-6 py-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size Template
            </label>
            <select
              value={selectedSizeTemplateId}
              onChange={(event) => onSelectedSizeTemplateChange(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
            >
              <option value="">Select a size template</option>
              {availableSizeTemplates.map((sizeTemplate) => (
                <option key={sizeTemplate.id} value={sizeTemplate.id}>
                  {sizeTemplate.label} ({sizeTemplate.size_code}) - {sizeTemplate.product_type_name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onAddSizeConfiguration}
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Add Size
          </button>
        </div>

        {errors.sizes && <p className="text-xs text-red-500">{errors.sizes}</p>}

        <div className="grid gap-5">
          {form.sizes.map((size, sizeIndex) => {
            const sizeTemplate = sizeTemplates.find((template) => template.id === size.size_template_id);
            const minItems = sizeTemplate?.min_items ?? null;
            const maxItems = sizeTemplate?.max_items ?? null;
            const totalQuantity = getSizeTotalQuantity(size);
            const isBelowMin = minItems !== null && totalQuantity < minItems;
            const isAboveMax = maxItems !== null && totalQuantity > maxItems;

            return (
              <div key={size.size_template_id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="mb-4 flex flex-col gap-2 border-b border-gray-200 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                      {sizeTemplate?.label || "Selected size"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sizeTemplate?.product_type_name || ""}{sizeTemplate ? ` • ${sizeTemplate.size_code}` : ""}
                    </p>
                    {(minItems !== null || maxItems !== null) && (
                      <p className={`mt-1 text-xs ${isBelowMin || isAboveMax ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
                        Total quantity: {totalQuantity}
                        {minItems !== null ? `, min ${minItems}` : ""}
                        {maxItems !== null ? `, max ${maxItems}` : ""}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveSizeConfiguration(sizeIndex)}
                    className="self-start rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    Remove size
                  </button>
                </div>

                {sizeErrors[size.size_template_id] && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                    {sizeErrors[size.size_template_id]}
                  </div>
                )}

                <div className="grid gap-6 xl:grid-cols-3">
                  <div className="xl:col-span-2 space-y-4">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Items</h4>
                        <button
                          type="button"
                          onClick={() => onAddSizeItemRow(sizeIndex)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                        >
                          Add item
                        </button>
                      </div>

                      <div className="space-y-3">
                        {size.items.map((item, itemIndex) => (
                          <div key={`${size.size_template_id}-item-${itemIndex}`} className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
                            <select
                              value={item.catalog_item_id}
                              onChange={(event) => onUpdateSizeItemRow(sizeIndex, itemIndex, "catalog_item_id", event.target.value)}
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
                            >
                              <option value="">Select catalog item</option>
                              {catalogItems.map((catalogItem) => (
                                <option key={catalogItem.id} value={catalogItem.id}>
                                  {catalogItem.name}
                                </option>
                              ))}
                            </select>

                            <input
                              type="number"
                              min="1"
                              step="1"
                              max={maxItems ?? undefined}
                              value={item.quantity}
                              onChange={(event) => onUpdateSizeItemRow(sizeIndex, itemIndex, "quantity", event.target.value)}
                              placeholder="Quantity"
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
                            />

                            <button
                              type="button"
                              onClick={() => onRemoveSizeItemRow(sizeIndex, itemIndex)}
                              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Fillers</h4>
                        <button
                          type="button"
                          onClick={() => onAddFillerRow(sizeIndex)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                        >
                          Add filler
                        </button>
                      </div>

                      <div className="space-y-3">
                        {size.fillers.map((filler, fillerIndex) => (
                          <div key={`${size.size_template_id}-filler-${fillerIndex}`} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                            <input
                              type="text"
                              value={filler}
                              onChange={(event) => onUpdateFillerRow(sizeIndex, fillerIndex, event.target.value)}
                              placeholder='e.g. "shredded paper"'
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
                            />
                            <button
                              type="button"
                              onClick={() => onRemoveFillerRow(sizeIndex, fillerIndex)}
                              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/3">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Ribbon colors</h4>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {colorOptions.ribbon.map((color) => {
                          const selected = size.colors.ribbon.includes(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => onToggleSizeColor(sizeIndex, "ribbon", color)}
                              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                                selected
                                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300"
                                  : "border-gray-200 text-gray-700 dark:border-white/10 dark:text-gray-300"
                              }`}
                            >
                              <span className="mx-auto mb-1 block h-5 w-5 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/3">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Net colors</h4>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {colorOptions.net.map((color) => {
                          const selected = size.colors.net.includes(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => onToggleSizeColor(sizeIndex, "net", color)}
                              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                                selected
                                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300"
                                  : "border-gray-200 text-gray-700 dark:border-white/10 dark:text-gray-300"
                              }`}
                            >
                              <span className="mx-auto mb-1 block h-5 w-5 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/3">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">Product colors</h4>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {colorOptions.product_color.map((color) => {
                          const selected = size.colors.product_color.includes(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => onToggleSizeColor(sizeIndex, "product_color", color)}
                              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                                selected
                                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300"
                                  : "border-gray-200 text-gray-700 dark:border-white/10 dark:text-gray-300"
                              }`}
                            >
                              <span className="mx-auto mb-1 block h-5 w-5 rounded-full border border-gray-200" style={{ backgroundColor: color }} />
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}