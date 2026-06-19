"use client";

import Image from "next/image";
import { useRef } from "react";
import { ColorSwatchesField } from "@/components/admin/ColorSwatchesField";
import type { ColorSwatchFormData, ItemFormData } from "@/lib/types";

type ItemRowProps = {
  item: ItemFormData;
  index: number;
  onChange: (index: number, updates: Partial<ItemFormData>) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
};

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20";

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500";

function imageFromClipboard(event: React.ClipboardEvent): File | null {
  for (const entry of event.clipboardData.items) {
    if (entry.type.startsWith("image/")) {
      return entry.getAsFile();
    }
  }
  return null;
}

export function ItemRow({
  item,
  index,
  onChange,
  onRemove,
  canRemove,
}: ItemRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl =
    item.imageFile ? URL.createObjectURL(item.imageFile) : item.image_url;

  function setImageFile(file: File | null) {
    onChange(index, { imageFile: file });
  }

  function handlePaste(event: React.ClipboardEvent) {
    const file = imageFromClipboard(event);
    if (!file) return;
    event.preventDefault();
    setImageFile(file);
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className={labelClass}>Description</label>
          <input
            type="text"
            value={item.description}
            onChange={(e) => onChange(index, { description: e.target.value })}
            placeholder="Product description"
            className={fieldClass}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="mt-6 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
          title="Remove item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <label className={labelClass}>Finish</label>
          <input
            type="text"
            value={item.finish ?? ""}
            onChange={(e) => onChange(index, { finish: e.target.value })}
            placeholder="e.g. Matt White"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Code</label>
          <input
            type="text"
            value={item.code ?? ""}
            onChange={(e) => onChange(index, { code: e.target.value })}
            placeholder="Product code"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Size</label>
          <input
            type="text"
            value={item.size ?? ""}
            onChange={(e) => onChange(index, { size: e.target.value })}
            placeholder="e.g. 800mm"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Quantity</label>
          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) =>
              onChange(index, { quantity: parseInt(e.target.value) || 0 })
            }
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>RRP (£)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={item.rrp}
            onChange={(e) => onChange(index, { rrp: e.target.value })}
            placeholder="0.00"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex flex-1 flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[38px] w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-3 text-sm text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
            >
              {previewUrl ? "Change image" : "Upload image"}
            </button>
            <div
              tabIndex={0}
              onPaste={handlePaste}
              className="flex h-[38px] w-full cursor-text items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-3 text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            >
              Click here &amp; paste image (Ctrl+V)
            </div>
          </div>
          {previewUrl && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>

      <ColorSwatchesField
        swatches={item.also_available_in ?? []}
        onChange={(also_available_in: ColorSwatchFormData[]) =>
          onChange(index, { also_available_in })
        }
      />
    </div>
  );
}
