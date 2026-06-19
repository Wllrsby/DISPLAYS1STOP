import Image from "next/image";
import { notFound } from "next/navigation";
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
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 sm:px-6">
        All prices are RRP and subject to discount. Please ask a member of
        staff.
      </div>

      <header className="border-b border-slate-100 px-4 py-6 sm:px-6">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {display.name}
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Display specification
        </p>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        {!hasContent ? (
          <p className="text-center text-slate-500">No items in this display.</p>
        ) : (
          <div className="space-y-10">
            {displaySections.map((section) =>
              section.items.length > 0 ? (
                <section key={section.id}>
                  <h2 className="mb-4 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
                    {section.name}
                  </h2>
                  <ul className="space-y-6">
                    {section.items.map((item) => (
                      <li
                        key={item.id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="flex h-[min(50vh,320px)] w-full items-center justify-center bg-slate-50 p-2">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.description}
                              width={800}
                              height={800}
                              className="max-h-full max-w-full object-contain"
                              sizes="100vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12"
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
                        <div className="p-4">
                          <h3 className="font-medium text-slate-900">
                            {item.description}
                          </h3>
                          {(item.finish || item.code) && (
                            <dl className="mt-2 space-y-1 text-sm">
                              {item.finish && (
                                <div className="flex gap-2">
                                  <dt className="text-slate-500">Finish</dt>
                                  <dd className="font-medium text-slate-900">
                                    {item.finish}
                                  </dd>
                                </div>
                              )}
                              {item.code && (
                                <div className="flex gap-2">
                                  <dt className="text-slate-500">Code</dt>
                                  <dd className="font-medium text-slate-900">
                                    {item.code}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          )}
                          {parseColorSwatches(item.also_available_in).length >
                            0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Also available in
                              </p>
                              <div className="mt-2 flex flex-wrap gap-3">
                                {parseColorSwatches(item.also_available_in).map(
                                  (swatch, swatchIndex) => (
                                    <div
                                      key={swatchIndex}
                                      className="flex flex-col items-center gap-1"
                                    >
                                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-slate-200">
                                        <Image
                                          src={swatch.image_url}
                                          alt={
                                            swatch.name ||
                                            `Colour option ${swatchIndex + 1}`
                                          }
                                          fill
                                          className="object-cover"
                                          sizes="40px"
                                        />
                                      </div>
                                      {swatch.name && (
                                        <span className="max-w-[72px] truncate text-center text-xs text-slate-600">
                                          {swatch.name}
                                        </span>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                          <dl className="mt-3 flex items-center justify-between text-sm">
                            <div>
                              <dt className="text-slate-500">Qty</dt>
                              <dd className="font-medium text-slate-900">
                                {item.quantity}
                              </dd>
                            </div>
                            <div className="text-right">
                              <dt className="text-slate-500">RRP</dt>
                              <dd className="text-lg font-semibold text-slate-900">
                                {formatPrice(Number(item.rrp))}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null
            )}
          </div>
        )}
      </main>
    </div>
  );
}
