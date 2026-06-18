"use client";

import { QRCodeSVG } from "qrcode.react";

type QRCodeDisplayProps = {
  displayId: string;
  displayName: string;
};

export function QRCodeDisplay({ displayId, displayName }: QRCodeDisplayProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  const displayUrl = `${appUrl}/display/${displayId}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 print:border-none print:p-0">
      <div className="mb-6 text-center print:mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{displayName}</h2>
        <p className="mt-1 text-sm text-slate-500">Scan to view display details</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 print:shadow-none print:ring-0">
          <QRCodeSVG value={displayUrl} size={200} level="H" includeMargin />
        </div>

        <p className="max-w-xs break-all text-center text-sm text-slate-600">
          {displayUrl}
        </p>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 print:hidden"
        >
          Print QR Code
        </button>
      </div>
    </div>
  );
}
