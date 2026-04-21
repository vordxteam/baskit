import React from "react";
import type { FormErrors, ProductForm } from "./types";

type MediaSectionProps = {
  form: ProductForm;
  errors: FormErrors;
  onMediaFiles: (files: File[]) => void;
  onRemoveMedia: (index: number) => void;
  onUpdateAltText: (index: number, value: string) => void;
  onSetPrimaryMedia: (index: number) => void;
};

export function MediaSection({
  form,
  errors,
  onMediaFiles,
  onRemoveMedia,
  onUpdateAltText,
  onSetPrimaryMedia,
}: MediaSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/5 dark:bg-white/3">
      <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Media</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Upload product images and set alt text, primary image, and sort order.
        </p>
      </div>

      <div className="px-6 py-5">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => onMediaFiles(Array.from(event.target.files || []))}
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-600 hover:file:bg-brand-100 dark:text-gray-300"
        />
        {errors.media && <p className="mt-2 text-xs text-red-500">{errors.media}</p>}

        <div className="mt-5 grid gap-4">
          {form.media.map((mediaItem, index) => (
            <div key={`${mediaItem?.file?.name}-${index}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="grid gap-4 lg:grid-cols-[180px,1fr]">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
                  <img src={mediaItem.previewUrl} alt={mediaItem.alt_text || mediaItem?.file?.name} className="h-40 w-full object-cover" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{mediaItem.file?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round(mediaItem.file?.size / 1024)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveMedia(index)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">Alt text</label>
                      <input
                        type="text"
                        value={mediaItem.alt_text}
                        onChange={(event) => onUpdateAltText(index, event.target.value)}
                        placeholder="Anniversary bouquet"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90"
                      />
                    </div>

                    <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 dark:border-white/10 dark:bg-white/3 dark:text-gray-300">
                      <input
                        type="radio"
                        name="primaryMedia"
                        checked={mediaItem.is_primary}
                        onChange={() => onSetPrimaryMedia(index)}
                        className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                      />
                      Primary image
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}