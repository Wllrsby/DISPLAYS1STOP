"use client";

import { IBM_Plex_Sans } from "next/font/google";
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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

const SCAN_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5fb949" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"></rect><rect width="5" height="5" x="16" y="3" rx="1"></rect><rect width="5" height="5" x="3" y="16" rx="1"></rect><path d="M21 16h-3a2 2 0 0 0-2 2v3"></path><path d="M21 21v.01"></path><path d="M12 7v3a2 2 0 0 1-2 2H7"></path><path d="M3 12h.01"></path><path d="M12 3h.01"></path><path d="M12 16v.01"></path><path d="M16 12h1"></path><path d="M21 12v.01"></path><path d="M12 21v-1"></path></svg>`;

export function DisplayIdCard({ displayId, displayName }: DisplayIdCardProps) {
  const displayUrl = getDisplayUrl(displayId);
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function printCard() {
    const qrSvg =
      qrRef.current?.querySelector("svg")?.outerHTML ??
      `<div style="font-size:12px;color:#666">QR unavailable</div>`;

    const logoUrl = `${window.location.origin}/1stop-logo.png`;
    const safeName = escapeHtml(displayName);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the display card.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${safeName} – Display Card</title>
  <style>${DISPLAY_ID_CARD_STYLES}</style>
</head>
<body>
  <div class="display-id-card">
    <div class="display-id-card__brand">
      <img src="${logoUrl}" alt="1 Stop Plumbing and Green Energy Centre" />
    </div>
    <div class="display-id-card__message">
      <div class="display-id-card__title">${safeName}</div>
      <p class="display-id-card__subtitle">See full specs, pricing &amp; finish options for the suite in front of you.</p>
    </div>
    <div class="display-id-card__qr">
      <div class="display-id-card__qr-box">${qrSvg}</div>
      <div class="display-id-card__scan">${SCAN_ICON_SVG}<span>Scan Me!</span></div>
    </div>
  </div>
  <script>
    function runPrint() {
      window.focus();
      window.print();
    }
    const img = document.querySelector("img");
    if (img && !img.complete) {
      img.addEventListener("load", function () { setTimeout(runPrint, 100); });
      img.addEventListener("error", function () { setTimeout(runPrint, 100); });
    } else {
      setTimeout(runPrint, 100);
    }
  </script>
</body>
</html>`);
    printWindow.document.close();
  }

  return (
    <div className={`display-id-card-wrap ${ibmPlexSans.className}`}>
      <p className="mb-4 text-center text-sm text-slate-500">
        Print this card and place it on the display. The link never changes.
      </p>

      <div className="display-id-card">
        <div className="display-id-card__brand">
          <img
            src="/1stop-logo.png"
            alt="1 Stop Plumbing and Green Energy Centre"
            className="h-full w-full object-contain"
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
          <div ref={qrRef} className="display-id-card__qr-box">
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
