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
        <div className="mx-auto max-w-lg rounded-t-2xl border border-slate-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:px-5 sm:pt-4">
          <div className="mb-2.5 flex items-start justify-between gap-2 sm:mb-3 sm:gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-700 sm:text-xs">
                Stay connected
              </p>
              <h2
                id="social-prompt-title"
                className="mt-0.5 text-base font-semibold text-slate-900 sm:mt-1 sm:text-lg"
              >
                Check out our socials
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 sm:mt-1 sm:text-sm">
                Inspiration, offers &amp; showroom updates.
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

          <div className="flex gap-2">
            <Link
              href="/socials"
              onClick={dismiss}
              className="flex-1 rounded-lg bg-slate-900 px-3 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-800 sm:rounded-xl sm:px-4 sm:py-3"
            >
              View socials
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:py-3"
            >
              Later
            </button>
          </div>

          <p className="mt-2 hidden text-center text-xs text-slate-400 sm:mt-3 sm:block">
            {SOCIAL_CONFIG.businessName}
          </p>
        </div>
      </div>
    </>
  );
}
