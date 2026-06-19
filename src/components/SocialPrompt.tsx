"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SOCIAL_CONFIG, SOCIAL_PROMPT_STORAGE_KEY } from "@/lib/socials";

const SHOW_DELAY_MS = 4000;

export function SocialPrompt() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (sessionStorage.getItem(SOCIAL_PROMPT_STORAGE_KEY)) {
      return;
    }

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    sessionStorage.setItem(SOCIAL_PROMPT_STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!mounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={dismiss}
        aria-hidden={!open}
      />

      <div
        role="dialog"
        aria-labelledby="social-prompt-title"
        aria-modal="true"
        className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-lg rounded-t-2xl border border-slate-200 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Stay connected
              </p>
              <h2
                id="social-prompt-title"
                className="mt-1 text-lg font-semibold text-slate-900"
              >
                Check out our socials
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Follow us for bathroom inspiration, offers, and showroom updates.
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/socials"
              onClick={dismiss}
              className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
            >
              View our socials
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Maybe later
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            {SOCIAL_CONFIG.businessName}
          </p>
        </div>
      </div>
    </>
  );
}
