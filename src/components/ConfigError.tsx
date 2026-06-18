import Link from "next/link";

type ConfigErrorProps = {
  message: string;
};

export function ConfigError({ message }: ConfigErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-lg rounded-xl border border-red-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Configuration required
        </h1>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <p className="mt-4 text-sm text-slate-600">
          In Vercel, go to <strong>Settings → Environment Variables</strong> and
          add:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
          <li>NEXT_PUBLIC_SUPABASE_URL</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          <li>NEXT_PUBLIC_APP_URL</li>
        </ul>
        <p className="mt-4 text-sm text-slate-600">
          After saving, redeploy the project for changes to take effect.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-slate-900 underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
