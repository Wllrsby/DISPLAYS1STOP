import Link from "next/link";
import { notFound } from "next/navigation";
import { DisplayForm } from "@/components/admin/DisplayForm";
import { ConfigError } from "@/components/ConfigError";
import { createServerClient } from "@/lib/supabase/server";
import type { DisplayWithSections, Item, Section } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("displays")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: data ? `Edit ${data.name} – Admin` : "Edit Display – Admin",
  };
}

export default async function EditDisplayPage({ params }: Props) {
  const { id } = await params;

  try {
    const supabase = createServerClient();

    const { data: display, error: displayError } = await supabase
      .from("displays")
      .select("*")
      .eq("id", id)
      .single();

    if (displayError || !display) notFound();

    const { data: sections, error: sectionsError } = await supabase
      .from("sections")
      .select("*")
      .eq("display_id", id)
      .order("sort_order");

    if (sectionsError) {
      return <ConfigError message={sectionsError.message} />;
    }

    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("*")
      .eq("display_id", id);

    if (itemsError) {
      return <ConfigError message={itemsError.message} />;
    }

  const itemsBySection = new Map<string, Item[]>();
  for (const item of (items as Item[]) ?? []) {
    if (!item.section_id) continue;
    const list = itemsBySection.get(item.section_id) ?? [];
    list.push(item);
    itemsBySection.set(item.section_id, list);
  }

  let displaySections =
    (sections as Section[] | null)?.map((section) => ({
      ...section,
      items: itemsBySection.get(section.id) ?? [],
    })) ?? [];

  if (!displaySections.length && items?.length) {
    displaySections = [
      {
        id: "legacy",
        display_id: id,
        name: "Main",
        sort_order: 0,
        items: items as Item[],
      },
    ];
  }

  const displayWithSections: DisplayWithSections = {
    ...display,
    sections: displaySections,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            href="/admin"
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to displays
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">
            Edit Display
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <DisplayForm display={displayWithSections} />
        </div>
      </main>
    </div>
  );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load display";
    return <ConfigError message={message} />;
  }
}
