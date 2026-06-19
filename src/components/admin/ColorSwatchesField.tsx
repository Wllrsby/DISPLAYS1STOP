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

function imageFromClipboard(event: React.ClipboardEvent): File | null {
  for (const entry of event.clipboardData.items) {
    if (entry.type.startsWith("image/")) {
      return entry.getAsFile();
    }
  }
  return null;
}

function SwatchBox({
  swatch,
  index,
  onUpdate,
  onRemove,
}: {
  swatch: ColorSwatchFormData;
  index: number;
  onUpdate: (index: number, file: File) => void;
  onRemove: (index: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl =
    swatch.imageFile ? URL.createObjectURL(swatch.imageFile) : swatch.image_url;

  function handlePaste(event: React.ClipboardEvent) {
    const file = imageFromClipboard(event);
    if (!file) return;
    event.preventDefault();
    onUpdate(index, file);
  }

  return (
    <div className="group relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpdate(index, file);
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onPaste={handlePaste}
        title={previewUrl ? "Change colour" : "Upload or paste colour"}
        className="relative h-12 w-12 overflow-hidden rounded-md border border-slate-300 bg-white transition hover:border-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={`Colour ${index + 1}`}
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
      {previewUrl && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
          title="Remove colour"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function ColorSwatchesField({
  swatches,
  onChange,
}: ColorSwatchesFieldProps) {
  const pasteRef = useRef<HTMLDivElement>(null);

  function updateSwatch(index: number, file: File) {
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
    onChange([...swatches, { image_url: null, imageFile: null }]);
  }

  function handlePasteArea(event: React.ClipboardEvent) {
    const file = imageFromClipboard(event);
    if (!file) return;
    event.preventDefault();

    const emptyIndex = swatches.findIndex(
      (swatch) => !swatch.image_url && !swatch.imageFile
    );
    if (emptyIndex >= 0) {
      updateSwatch(emptyIndex, file);
      return;
    }

    onChange([
      ...swatches,
      { image_url: null, imageFile: file },
    ]);
  }

  return (
    <div>
      <label className={labelClass}>Also available in</label>
      <div className="flex flex-wrap items-center gap-2">
        {swatches.map((swatch, index) => (
          <SwatchBox
            key={index}
            swatch={swatch}
            index={index}
            onUpdate={updateSwatch}
            onRemove={removeSwatch}
          />
        ))}
        <button
          type="button"
          onClick={addSwatch}
          className="flex h-12 w-12 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-50"
          title="Add colour"
        >
          +
        </button>
      </div>
      <div
        ref={pasteRef}
        tabIndex={0}
        onPaste={handlePasteArea}
        className="mt-2 flex h-[34px] w-full max-w-xs cursor-text items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-3 text-xs text-slate-500 transition hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
      >
        Click here &amp; paste colour (Ctrl+V)
      </div>
    </div>
  );
}
