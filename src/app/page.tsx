import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <main className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Showroom Display
        </h1>
        <p className="mt-3 max-w-md text-slate-600">
          Create display spec sheets with QR codes for your showroom. Staff
          manage displays in the admin panel; customers scan to view details.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/admin"
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Admin Panel
          </Link>
        </div>
      </main>
    </div>
  );
}
