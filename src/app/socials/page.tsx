import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SocialLinks } from "@/components/SocialLinks";
import { SOCIAL_CONFIG } from "@/lib/socials";

export const metadata: Metadata = {
  title: "Our Socials",
  description: SOCIAL_CONFIG.tagline,
};

export default function SocialsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <div className="relative mb-4 h-16 w-40">
            <Image
              src="/1stop-logo.png"
              alt={SOCIAL_CONFIG.businessName}
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Our Socials
          </h1>
          <p className="mt-2 max-w-sm text-sm text-slate-600">
            {SOCIAL_CONFIG.tagline}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6">
        <SocialLinks links={SOCIAL_CONFIG.links} />

        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center text-sm text-emerald-900">
          Visit our Glossop showroom for expert advice on bathrooms, heating,
          and green energy.
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          Back to home
        </Link>
      </footer>
    </div>
  );
}
