import Image from "next/image";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import type { Item } from "@/lib/types";

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

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("display_id", id);

  return (
    <div className="min-h-screen bg-white">
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

      <main className="mx-auto max-w-lg px-4 py-6 sm:max-w-2xl sm:px-6">
        {!items?.length ? (
          <p className="text-center text-slate-500">No items in this display.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {(items as Item[]).map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-square bg-slate-100">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.description}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
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
                  <h2 className="font-medium text-slate-900">
                    {item.description}
                  </h2>
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
        )}
      </main>
    </div>
  );
}
