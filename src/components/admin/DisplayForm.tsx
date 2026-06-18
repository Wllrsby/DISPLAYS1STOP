"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveDisplay, uploadItemImage } from "@/app/admin/actions";
import { ItemRow } from "@/components/admin/ItemRow";
import { QRCodeDisplay } from "@/components/admin/QRCodeDisplay";
import type { DisplayWithItems, ItemFormData } from "@/lib/types";

function emptyItem(): ItemFormData {
  return {
    description: "",
    quantity: 1,
    rrp: "",
    image_url: null,
    imageFile: null,
  };
}

type DisplayFormProps = {
  display?: DisplayWithItems;
};

export function DisplayForm({ display }: DisplayFormProps) {
  const router = useRouter();
  const [name, setName] = useState(display?.name ?? "");
  const [items, setItems] = useState<ItemFormData[]>(
    display?.items.length
      ? display.items.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          rrp: item.rrp.toString(),
          image_url: item.image_url,
          imageFile: null,
        }))
      : [emptyItem()]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(display?.id ?? null);

  const qrDisplayId = display?.id ?? savedId;

  function updateItem(index: number, updates: Partial<ItemFormData>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const preparedItems = await Promise.all(
        items.map(async (item) => {
          let imageUrl = item.image_url;
          if (item.imageFile) {
            const formData = new FormData();
            formData.append("file", item.imageFile);
            const upload = await uploadItemImage(formData);
            if ("error" in upload) {
              throw new Error(upload.error);
            }
            imageUrl = upload.url;
          }
          return {
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            rrp: parseFloat(item.rrp) || 0,
            image_url: imageUrl,
          };
        })
      );

      const result = await saveDisplay(
        display?.id ?? savedId,
        name,
        preparedItems
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      setSavedId(result.id!);

      if (!display?.id) {
        router.replace(`/admin/${result.id}/edit`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save display");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="display-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Display Name
          </label>
          <input
            id="display-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kitchen Showroom – Spring Collection"
            className="w-full max-w-xl rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-700">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <ItemRow
                key={item.id ?? `new-${index}`}
                item={item}
                index={index}
                onChange={updateItem}
                onRemove={removeItem}
                canRemove={items.length > 1}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Display"}
          </button>
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </Link>
        </div>
      </form>

      {qrDisplayId && (
        <div className="border-t border-slate-200 pt-8">
          <QRCodeDisplay displayId={qrDisplayId} displayName={name} />
        </div>
      )}
    </div>
  );
}
