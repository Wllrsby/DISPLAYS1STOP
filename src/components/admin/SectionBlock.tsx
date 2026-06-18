"use client";

import { ItemRow } from "@/components/admin/ItemRow";
import type { ItemFormData } from "@/lib/types";

type SectionBlockProps = {
  sectionIndex: number;
  name: string;
  items: ItemFormData[];
  onNameChange: (name: string) => void;
  onItemChange: (itemIndex: number, updates: Partial<ItemFormData>) => void;
  onAddItem: () => void;
  onRemoveItem: (itemIndex: number) => void;
  onRemoveSection: () => void;
  canRemoveSection: boolean;
};

export function SectionBlock({
  sectionIndex,
  name,
  items,
  onNameChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onRemoveSection,
  canRemoveSection,
}: SectionBlockProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Section name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Vanity Units, Taps &amp; Accessories"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
          />
        </div>
        <button
          type="button"
          onClick={onRemoveSection}
          disabled={!canRemoveSection}
          className="mt-6 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Remove section
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Items</h3>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          + Add item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, itemIndex) => (
          <ItemRow
            key={item.id ?? `section-${sectionIndex}-item-${itemIndex}`}
            item={item}
            index={itemIndex}
            onChange={(_, updates) => onItemChange(itemIndex, updates)}
            onRemove={onRemoveItem}
            canRemove={items.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
