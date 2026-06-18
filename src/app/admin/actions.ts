"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SaveItemInput = {
  id?: string;
  description: string;
  quantity: number;
  rrp: number;
  image_url: string | null;
};

export async function saveDisplay(
  displayId: string | null,
  name: string,
  items: SaveItemInput[]
) {
  const supabase = createServerClient();

  if (!name.trim()) {
    return { error: "Display name is required" };
  }

  const validItems = items.filter((item) => item.description.trim());
  if (validItems.length === 0) {
    return { error: "Add at least one item with a description" };
  }

  let id = displayId;

  if (id) {
    const { error } = await supabase
      .from("displays")
      .update({ name: name.trim() })
      .eq("id", id);

    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("displays")
      .insert({ name: name.trim() })
      .select("id")
      .single();

    if (error) return { error: error.message };
    id = data.id;
  }

  const { data: existingItems } = await supabase
    .from("items")
    .select("id")
    .eq("display_id", id);

  const existingIds = new Set(existingItems?.map((i) => i.id) ?? []);
  const keptIds = new Set(validItems.filter((i) => i.id).map((i) => i.id!));

  const toDelete = [...existingIds].filter((itemId) => !keptIds.has(itemId));
  if (toDelete.length > 0) {
    await supabase.from("items").delete().in("id", toDelete);
  }

  for (const item of validItems) {
    const payload = {
      display_id: id,
      description: item.description.trim(),
      quantity: item.quantity,
      rrp: item.rrp,
      image_url: item.image_url,
    };

    if (item.id && existingIds.has(item.id)) {
      const { error } = await supabase
        .from("items")
        .update(payload)
        .eq("id", item.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("items").insert(payload);
      if (error) return { error: error.message };
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/display/${id}`);

  return { id };
}

export async function deleteDisplay(displayId: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from("displays").delete().eq("id", displayId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

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
