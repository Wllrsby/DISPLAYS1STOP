"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveDisplay, uploadItemImage } from "@/app/admin/actions";
import { DisplayIdCard } from "@/components/admin/DisplayIdCard";
import { SectionBlock } from "@/components/admin/SectionBlock";
import type {
  DisplayWithSections,
  ItemFormData,
  SectionFormData,
} from "@/lib/types";
import { parseColorSwatches } from "@/lib/types";

function emptyItem(): ItemFormData {
  return {
    description: "",
    finish: "",
    code: "",
    size: "",
    quantity: 1,
    rrp: "",
    image_url: null,
    imageFile: null,
    also_available_in: [],
  };
}

function emptySection(): SectionFormData {
  return {
    name: "",
    items: [emptyItem()],
  };
}

function mapDisplayToSections(display?: DisplayWithSections): SectionFormData[] {
  if (display?.sections.length) {
    return display.sections.map((section) => ({
      id: section.id,
      name: section.name,
      items: section.items.length
        ? section.items.map((item) => ({
            id: item.id,
            description: item.description ?? "",
            finish: item.finish ?? "",
            code: item.code ?? "",
            size: item.size ?? "",
            quantity: Number(item.quantity) || 0,
            rrp: item.rrp != null ? String(item.rrp) : "",
            image_url: item.image_url,
            imageFile: null,
            also_available_in: parseColorSwatches(item.also_available_in).map(
              (swatch) => ({
                name: swatch.name,
                image_url: swatch.image_url,
                imageFile: null,
              })
            ),
          }))
        : [emptyItem()],
    }));
  }
  return [emptySection()];
}

type DisplayFormProps = {
  display?: DisplayWithSections;
};

export function DisplayForm({ display }: DisplayFormProps) {
  const router = useRouter();
  const [name, setName] = useState(display?.name ?? "");
  const [sections, setSections] = useState<SectionFormData[]>(
    mapDisplayToSections(display)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(display?.id ?? null);

  const qrDisplayId = display?.id ?? savedId;

  function updateSection(
    sectionIndex: number,
    updates: Partial<SectionFormData>
  ) {
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex ? { ...section, ...updates } : section
      )
    );
  }

  function updateItem(
    sectionIndex: number,
    itemIndex: number,
    updates: Partial<ItemFormData>
  ) {
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, j) =>
                j === itemIndex ? { ...item, ...updates } : item
              ),
            }
          : section
      )
    );
  }

  function addSection() {
    setSections((prev) => [...prev, emptySection()]);
  }

  function removeSection(sectionIndex: number) {
    setSections((prev) => prev.filter((_, i) => i !== sectionIndex));
  }

  function addItem(sectionIndex: number) {
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? { ...section, items: [...section.items, emptyItem()] }
          : section
      )
    );
  }

  function removeItem(sectionIndex: number, itemIndex: number) {
    setSections((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              items: section.items.filter((_, j) => j !== itemIndex),
            }
          : section
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const preparedSections = [];

    for (const section of sections) {
      const preparedItems = [];

      for (const item of section.items) {
        let imageUrl = item.image_url;

        if (item.imageFile) {
          const formData = new FormData();
          formData.append("file", item.imageFile);
          const upload = await uploadItemImage(formData);
          if ("error" in upload) {
            setError(upload.error);
            setSaving(false);
            return;
          }
          imageUrl = upload.url;
        }

        const alsoAvailableIn = [];

        for (const swatch of item.also_available_in.filter(
          (entry) => entry.image_url || entry.imageFile
        )) {
          if (swatch.imageFile) {
            const formData = new FormData();
            formData.append("file", swatch.imageFile);
            const upload = await uploadItemImage(formData);
            if ("error" in upload) {
              setError(upload.error);
              setSaving(false);
              return;
            }
            alsoAvailableIn.push({
              name: swatch.name.trim(),
              image_url: upload.url,
            });
            continue;
          }

          alsoAvailableIn.push({
            name: swatch.name.trim(),
            image_url: swatch.image_url!,
          });
        }

        preparedItems.push({
          id: item.id,
          description: item.description,
          quantity: Number(item.quantity) || 0,
          rrp: parseFloat(item.rrp) || 0,
          finish: item.finish || null,
          code: item.code || null,
          size: item.size || null,
          image_url: imageUrl,
          also_available_in: alsoAvailableIn,
        });
      }

      preparedSections.push({
        id: section.id && section.id !== "legacy" ? section.id : undefined,
        name: section.name,
        items: preparedItems,
      });
    }

    const result = await saveDisplay(
      display?.id ?? savedId,
      name,
      preparedSections
    );

    setSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    if (!result?.id) {
      setError("Save failed — no display id returned.");
      return;
    }

    setSavedId(result.id);
    setSuccess("Display saved successfully.");

    if (!display?.id) {
      router.replace(`/admin/${result.id}/edit`);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 print:hidden">
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
            placeholder="e.g. Front Window – Spring Collection"
            className="w-full max-w-xl rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-700">Sections</h2>
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              + Add section
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <SectionBlock
                key={section.id ?? `section-${sectionIndex}`}
                sectionIndex={sectionIndex}
                name={section.name}
                items={section.items}
                onNameChange={(sectionName) =>
                  updateSection(sectionIndex, { name: sectionName })
                }
                onItemChange={(itemIndex, updates) =>
                  updateItem(sectionIndex, itemIndex, updates)
                }
                onAddItem={() => addItem(sectionIndex)}
                onRemoveItem={(itemIndex) =>
                  removeItem(sectionIndex, itemIndex)
                }
                onRemoveSection={() => removeSection(sectionIndex)}
                canRemoveSection={sections.length > 1}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
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
        <div className="border-t border-slate-200 pt-8 print:hidden">
          <DisplayIdCard displayId={qrDisplayId} displayName={name} />
        </div>
      )}
    </div>
  );
}
