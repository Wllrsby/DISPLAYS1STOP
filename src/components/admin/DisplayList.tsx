"use client";

import { deleteDisplay } from "@/app/admin/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Display } from "@/lib/types";

type DisplayListProps = {
  displays: Display[];
};

export function DisplayList({ displays }: DisplayListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    const result = await deleteDisplay(id);
    setDeletingId(null);

    if (result.error) {
      alert(result.error);
      return;
    }

    router.refresh();
  }

  if (displays.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center">
        <p className="text-slate-600">No displays yet.</p>
        <Link
          href="/admin/new"
          className="mt-4 inline-block text-sm font-medium text-slate-900 underline underline-offset-2"
        >
          Create your first display
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-6 py-3 font-medium text-slate-600">Name</th>
            <th className="px-6 py-3 font-medium text-slate-600">Created</th>
            <th className="px-6 py-3 font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {displays.map((display) => (
            <tr key={display.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4 font-medium text-slate-900">
                {display.name}
              </td>
              <td className="px-6 py-4 text-slate-500">
                {new Date(display.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/${display.id}/edit`}
                    className="font-medium text-slate-700 hover:text-slate-900"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/display/${display.id}`}
                    target="_blank"
                    className="font-medium text-slate-500 hover:text-slate-700"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(display.id, display.name)}
                    disabled={deletingId === display.id}
                    className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {deletingId === display.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
