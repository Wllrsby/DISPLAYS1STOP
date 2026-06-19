"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ColorSwatchFormData } from "@/lib/types";

type ColorSwatchesFieldProps = {
  swatches: ColorSwatchFormData[];
  onChange: (swatches: ColorSwatchFormData[]) => void;
};

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500";

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20";

function imageFromClipboard(event: React.ClipboardEvent): File | null {
  for (const entry of event.clipboardData.items) {
    if (entry.type.startsWith("image/")) {
      return entry.getAsFile();
    }
  }
  return null;
}

function SwatchRow({
  swatch,
  index,
  onNameChange,
  onImageUpdate,
  onRemove,
}: {
  swatch: ColorSwatchFormData;
  index: number;
  onNameChange: (index: number, name: string) => void;
  onImageUpdate: (index: number, file: File) => void;
  onRemove: (index: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl =
    swatch.imageFile ? URL.createObjectURL(swatch.imageFile) : swatch.image_url;

  function handlePaste(event: React.ClipboardEvent) {
    const file = imageFromClipboard(event);
    if (!file) return;
    event.preventDefault();
    onImageUpdate(index, file);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Colour name
          </label>
          <input
            type="text"
            value={swatch.name}
            onChange={(e) => onNameChange(index, e.target.value)}
            placeholder="e.g. Matt Black"
            className={fieldClass}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-6 shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageUpdate(index, file);
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onPaste={handlePaste}
          title={previewUrl ? "Change swatch" : "Upload or paste swatch"}
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-300 bg-slate-50 transition hover:border-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={swatch.name || `Colour ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-lg text-slate-400">
              +
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-xs text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Upload
        </button>
        <div
          tabIndex={0}
          onPaste={handlePaste}
          className="flex h-[34px] min-w-[140px] flex-1 cursor-text items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-3 text-xs text-slate-500 transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        >
          Paste swatch (Ctrl+V)
        </div>
      </div>
    </div>
  );
}

export function ColorSwatchesField({
  swatches,
  onChange,
}: ColorSwatchesFieldProps) {
  const pasteRef = useRef<HTMLDivElement>(null);

  function updateName(index: number, name: string) {
    onChange(
      swatches.map((swatch, i) => (i === index ? { ...swatch, name } : swatch))
    );
  }

  function updateImage(index: number, file: File) {
    onChange(
      swatches.map((swatch, i) =>
        i === index ? { ...swatch, imageFile: file, image_url: null } : swatch
      )
    );
  }

  function removeSwatch(index: number) {
    onChange(swatches.filter((_, i) => i !== index));
  }

  function addSwatch() {
    onChange([
      ...swatches,
      { name: "", image_url: null, imageFile: null },
    ]);
  }

  function handlePasteArea(event: React.ClipboardEvent) {
    const file = imageFromClipboard(event);
    if (!file) return;
    event.preventDefault();

    const emptyIndex = swatches.findIndex(
      (swatch) => !swatch.image_url && !swatch.imageFile
    );
    if (emptyIndex >= 0) {
      updateImage(emptyIndex, file);
      return;
    }

    onChange([
      ...swatches,
      { name: "", image_url: null, imageFile: file },
    ]);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className={labelClass}>Also available in</label>
        <button
          type="button"
          onClick={addSwatch}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          + Add colour
        </button>
      </div>

      {swatches.length > 0 ? (
        <div className="space-y-2">
          {swatches.map((swatch, index) => (
            <SwatchRow
              key={index}
              swatch={swatch}
              index={index}
              onNameChange={updateName}
              onImageUpdate={updateImage}
              onRemove={removeSwatch}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No colours added yet. Click &ldquo;Add colour&rdquo; to add options.
        </p>
      )}

      <div
        ref={pasteRef}
        tabIndex={0}
        onPaste={handlePasteArea}
        className="mt-2 flex h-[34px] w-full max-w-md cursor-text items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-3 text-xs text-slate-500 transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
      >
        Click here &amp; paste colour swatch (Ctrl+V)
      </div>
    </div>
  );
}
