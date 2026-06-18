import { createBrowserClient } from "@/lib/supabase/client";

export async function uploadItemImage(file: File): Promise<string> {
  const supabase = createBrowserClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("item-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    if (error.message === "Bucket not found") {
      throw new Error(
        'Storage bucket "item-images" not found. In Supabase, open SQL Editor and run supabase/storage.sql (or create a public bucket named "item-images" under Storage).'
      );
    }
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("item-images").getPublicUrl(fileName);
  return data.publicUrl;
}
