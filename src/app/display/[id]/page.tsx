import Image from "next/image";
import { notFound } from "next/navigation";
import { SocialPrompt } from "@/components/SocialPrompt";
import { createServerClient } from "@/lib/supabase/server";
import type { Item, Section } from "@/lib/types";
import { parseColorSwatches } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

function formatPrice(rrp: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(rrp);
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("displays")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: data?.name ?? "Display",
  };
}

export default async function DisplayPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: display } = await supabase
    .from("displays")
    .select("*")
    .eq("id", id)
    .single();

  if (!display) notFound();

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("display_id", id)
    .order("sort_order");

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("display_id", id);

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
        name: "Products",
        sort_order: 0,
        items: items as Item[],
      },
    ];
  }

  const hasContent = displaySections.some((s) => s.items.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-center text-[11px] leading-snug text-amber-900 sm:px-6 sm:py-2.5 sm:text-sm">
        RRP prices — discounts available. Please ask staff.
      </div>

      <header className="border-b border-slate-100 px-3 py-3 sm:px-6 sm:py-5">
        <h1 className="text-center text-lg font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {display.name}
        </h1>
        <p className="mt-0.5 hidden text-center text-sm text-slate-500 sm:block">
          Display specification
        </p>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-3 py-3 sm:px-6 sm:py-6">
        {!hasContent ? (
          <p className="text-center text-sm text-slate-500">
            No items in this display.
          </p>
        ) : (
          <div className="space-y-5 sm:space-y-10">
            {displaySections.map((section) =>
              section.items.length > 0 ? (
                <section key={section.id}>
                  <h2 className="mb-2 border-b border-slate-200 pb-1.5 text-base font-semibold text-slate-900 sm:mb-4 sm:pb-2 sm:text-lg">
                    {section.name}
                  </h2>
                  <ul className="space-y-3 sm:space-y-6">
                    {section.items.map((item) => {
                      const swatches = parseColorSwatches(item.also_available_in);

                      return (
                        <li
                          key={item.id}
                          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:rounded-xl"
                        >
                          <div className="flex h-[min(28vh,180px)] w-full items-center justify-center bg-slate-50 p-1.5 sm:h-[min(50vh,320px)] sm:p-2">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.description}
                                width={800}
                                height={800}
                                className="max-h-full max-w-full object-contain"
                                sizes="(max-width: 640px) 100vw, 672px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-8 w-8 sm:h-12 sm:w-12"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-sm font-medium leading-snug text-slate-900 sm:text-base">
                                {item.description}
                              </h3>
                              <p className="shrink-0 text-sm font-semibold text-slate-900 sm:text-lg">
                                {formatPrice(Number(item.rrp))}
                              </p>
                            </div>

                            {(item.finish || item.code || item.quantity > 0) && (
                              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                                {item.finish && (
                                  <span>
                                    <span className="text-slate-400">Finish</span>{" "}
                                    {item.finish}
                                  </span>
                                )}
                                {item.finish && item.code && (
                                  <span className="text-slate-300"> · </span>
                                )}
                                {item.code && (
                                  <span>
                                    <span className="text-slate-400">Code</span>{" "}
                                    {item.code}
                                  </span>
                                )}
                                {(item.finish || item.code) && (
                                  <span className="text-slate-300"> · </span>
                                )}
                                <span>
                                  <span className="text-slate-400">Qty</span>{" "}
                                  {item.quantity}
                                </span>
                              </p>
                            )}

                            {swatches.length > 0 && (
                              <div>
                                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
                                  Also available in
                                </p>
                                <div className="mt-1.5 flex flex-wrap gap-2">
                                  {swatches.map((swatch, swatchIndex) => (
                                    <div
                                      key={swatchIndex}
                                      className="flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 py-0.5 pl-0.5 pr-2"
                                    >
                                      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded border border-slate-200 sm:h-8 sm:w-8">
                                        <Image
                                          src={swatch.image_url}
                                          alt={
                                            swatch.name ||
                                            `Colour option ${swatchIndex + 1}`
                                          }
                                          fill
                                          className="object-cover"
                                          sizes="32px"
                                        />
                                      </div>
                                      {swatch.name && (
                                        <span className="max-w-[88px] truncate text-[11px] text-slate-600 sm:max-w-none sm:text-xs">
                                          {swatch.name}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-100 px-3 py-3 text-center sm:px-6 sm:py-5">
        <a
          href="/socials"
          className="text-xs font-medium text-slate-500 transition hover:text-slate-900 sm:text-sm"
        >
          Follow us on social media
        </a>
      </footer>

      <SocialPrompt />
    </div>
  );
}
