"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ItemFormData } from "@/lib/types";

type ItemRowProps = {
  item: ItemFormData;
  index: number;
  onChange: (index: number, updates: Partial<ItemFormData>) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
};

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

  return (
    <div className="grid grid-cols-12 gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <div className="col-span-12 md:col-span-4">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Description
        </label>
        <input
          type="text"
          value={item.description}
          onChange={(e) => onChange(index, { description: e.target.value })}
          placeholder="Product description"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        />
      </div>

      <div className="col-span-6 md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Quantity
        </label>
        <input
          type="number"
          min={0}
          value={item.quantity}
          onChange={(e) =>
            onChange(index, { quantity: parseInt(e.target.value) || 0 })
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        />
      </div>

      <div className="col-span-6 md:col-span-2">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          RRP (£)
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={item.rrp}
          onChange={(e) => onChange(index, { rrp: e.target.value })}
          placeholder="0.00"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        />
      </div>

      <div className="col-span-10 md:col-span-3">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Image
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onChange(index, { imageFile: file });
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 text-sm text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
        >
          {previewUrl ? "Change image" : "Upload image"}
        </button>
        {previewUrl && (
          <div className="relative mt-2 h-16 w-16 overflow-hidden rounded-md border border-slate-200">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <div className="col-span-2 flex items-end justify-end md:col-span-1">
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
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
    </div>
  );
}
