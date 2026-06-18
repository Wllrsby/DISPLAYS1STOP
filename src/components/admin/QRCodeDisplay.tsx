"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

type QRCodeDisplayProps = {
  displayId: string;
  displayName: string;
};

export function getDisplayUrl(displayId: string) {
  const appUrl =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "";
  return `${appUrl}/display/${displayId}`;
}

export function QRCodeDisplay({ displayId, displayName }: QRCodeDisplayProps) {
  const displayUrl = getDisplayUrl(displayId);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 print:border-none print:p-0">
      <div className="mb-6 text-center print:mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{displayName}</h2>
        <p className="mt-1 text-sm text-slate-500">Scan to view display details</p>
        <p className="mt-1 text-xs text-slate-400">
          This link never changes — safe to print and keep on the display
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 print:shadow-none print:ring-0">
          <QRCodeSVG value={displayUrl} size={200} level="H" includeMargin />
        </div>

        <div className="flex w-full max-w-md flex-col items-center gap-2">
          <p className="w-full break-all text-center text-sm text-slate-600">
            {displayUrl}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              type="button"
              onClick={copyLink}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Print QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
