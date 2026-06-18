import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

export function createBrowserClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key);
}
