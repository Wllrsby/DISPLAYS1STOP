import Link from "next/link";
import { DisplayList } from "@/components/admin/DisplayList";
import { ConfigError } from "@/components/ConfigError";
import { createServerClient } from "@/lib/supabase/server";
import type { Display } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin – Showroom Displays",
};

export default async function AdminPage() {
  let displays: Display[] = [];

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("displays")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return <ConfigError message={error.message} />;
    }

    displays = (data as Display[]) ?? [];
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to connect to Supabase";
    return <ConfigError message={message} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Showroom Displays
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage display spec sheets and QR codes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/socials"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Socials
            </Link>
            <Link
              href="/admin/new"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              New Display
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <DisplayList displays={displays} />
      </main>
    </div>
  );
}
