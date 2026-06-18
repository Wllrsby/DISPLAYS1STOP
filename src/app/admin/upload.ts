"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function uploadItemImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { error: "No image file provided" };
  }

  const supabase = createServerClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("item-images")
    .upload(fileName, buffer, {
      contentType: file.type || "image/jpeg",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    if (error.message === "Bucket not found") {
      return {
        error:
          'Storage bucket "item-images" not found. Run supabase/storage.sql in Supabase.',
      };
    }
    return { error: error.message };
  }

  const { data } = supabase.storage.from("item-images").getPublicUrl(fileName);
  return { url: data.publicUrl };
}
