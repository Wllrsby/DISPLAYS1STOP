"use client";

import { IBM_Plex_Sans } from "next/font/google";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

type DisplayIdCardProps = {
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

function QrScanIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5fb949"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  );
}

export function DisplayIdCard({ displayId, displayName }: DisplayIdCardProps) {
  const displayUrl = getDisplayUrl(displayId);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`display-id-card-wrap ${ibmPlexSans.className}`}>
      <p className="mb-4 text-center text-sm text-slate-500 print:hidden">
        Print this card and place it on the display. The link never changes.
      </p>

      <div className="display-id-card">
        <div className="display-id-card__brand">
          <Image
            src="/1stop-logo.png"
            alt="1 Stop Plumbing and Green Energy Centre"
            width={206}
            height={356}
            className="h-full w-full object-contain"
            priority
          />
        </div>

        <div className="display-id-card__message">
          <div className="display-id-card__title">{displayName}</div>
          <p className="display-id-card__subtitle">
            See full specs, pricing &amp; finish options for the suite in front
            of you.
          </p>
        </div>

        <div className="display-id-card__qr">
          <div className="display-id-card__qr-box">
            <QRCodeSVG value={displayUrl} size={160} level="H" includeMargin />
          </div>
          <div className="display-id-card__scan">
            <QrScanIcon />
            <span>Scan Me!</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <p className="w-full break-all text-center text-sm text-slate-600">
          {displayUrl}
        </p>
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
          Print card
        </button>
      </div>
    </div>
  );
}
