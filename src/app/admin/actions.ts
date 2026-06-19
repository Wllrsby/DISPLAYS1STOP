"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SaveItemInput = {
  id?: string;
  description: string;
  quantity: number;
  rrp: number;
  finish: string | null;
  code: string | null;
  size: string | null;
  image_url: string | null;
  also_available_in: { name: string; image_url: string }[];
};

export type SaveSectionInput = {
  id?: string;
  name: string;
  items: SaveItemInput[];
};

export async function saveDisplay(
  displayId: string | null,
  name: string,
  sections: SaveSectionInput[]
) {
  const supabase = createServerClient();

  if (!name.trim()) {
    return { error: "Display name is required" };
  }

  const validSections = sections
    .map((section) => ({
      ...section,
      name: section.name.trim(),
      items: section.items.filter((item) => item.description.trim()),
    }))
    .filter((section) => section.name || section.items.length > 0);

  const totalItems = validSections.reduce((n, s) => n + s.items.length, 0);
  if (totalItems === 0) {
    return { error: "Add at least one item with a description" };
  }

  for (const section of validSections) {
    if (!section.name) {
      return { error: "Each section needs a name" };
    }
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

  const { data: existingSections } = await supabase
    .from("sections")
    .select("id")
    .eq("display_id", id);

  const existingSectionIds = new Set(existingSections?.map((s) => s.id) ?? []);
  const keptSectionIds = new Set(
    validSections.filter((s) => s.id).map((s) => s.id!)
  );

  const sectionsToDelete = [...existingSectionIds].filter(
    (sectionId) => !keptSectionIds.has(sectionId)
  );
  if (sectionsToDelete.length > 0) {
    await supabase.from("sections").delete().in("id", sectionsToDelete);
  }

  const { data: existingItems } = await supabase
    .from("items")
    .select("id")
    .eq("display_id", id);

  const existingItemIds = new Set(existingItems?.map((i) => i.id) ?? []);
  const keptItemIds = new Set(
    validSections.flatMap((s) => s.items.filter((i) => i.id).map((i) => i.id!))
  );

  const itemsToDelete = [...existingItemIds].filter(
    (itemId) => !keptItemIds.has(itemId)
  );
  if (itemsToDelete.length > 0) {
    await supabase.from("items").delete().in("id", itemsToDelete);
  }

  for (let i = 0; i < validSections.length; i++) {
    const section = validSections[i];
    let sectionId = section.id;

    if (sectionId && existingSectionIds.has(sectionId)) {
      const { error } = await supabase
        .from("sections")
        .update({ name: section.name, sort_order: i })
        .eq("id", sectionId);
      if (error) return { error: error.message };
    } else {
      const { data, error } = await supabase
        .from("sections")
        .insert({ display_id: id, name: section.name, sort_order: i })
        .select("id")
        .single();
      if (error) return { error: error.message };
      sectionId = data.id;
    }

    for (const item of section.items) {
      const payload = {
        display_id: id,
        section_id: sectionId,
        description: item.description.trim(),
        quantity: item.quantity,
        rrp: item.rrp,
        finish: item.finish?.trim() || null,
        code: item.code?.trim() || null,
        size: item.size?.trim() || null,
        image_url: item.image_url,
        also_available_in: item.also_available_in ?? [],
      };

      if (item.id && existingItemIds.has(item.id)) {
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
