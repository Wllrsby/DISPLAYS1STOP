"use client";

import { IBM_Plex_Sans } from "next/font/google";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { DISPLAY_ID_CARD_STYLES } from "@/components/admin/displayIdCardStyles";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function printCard() {
    const card = cardRef.current;
    if (!card) return;

    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) return;

    const clone = card.cloneNode(true) as HTMLElement;
    const img = clone.querySelector("img");
    if (img) {
      img.src = `${window.location.origin}/1stop-logo.png`;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${displayName} – Display Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>${DISPLAY_ID_CARD_STYLES}</style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }

  return (
    <div className={`display-id-card-wrap ${ibmPlexSans.className}`}>
      <p className="mb-4 text-center text-sm text-slate-500">
        Print this card and place it on the display. The link never changes.
      </p>

      <div ref={cardRef} className="display-id-card">
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

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
          onClick={printCard}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Print card
        </button>
      </div>
    </div>
  );
}
