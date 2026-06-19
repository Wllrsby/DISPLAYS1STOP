export type Display = {
  id: string;
  name: string;
  created_at: string;
};

export type Section = {
  id: string;
  display_id: string;
  name: string;
  sort_order: number;
};

export type ColorSwatch = {
  name: string;
  image_url: string;
};

export type ColorSwatchFormData = {
  name: string;
  image_url: string | null;
  imageFile?: File | null;
};

export type Item = {
  id: string;
  display_id: string;
  section_id: string;
  description: string;
  quantity: number;
  rrp: number;
  image_url: string | null;
  finish: string | null;
  code: string | null;
  also_available_in: ColorSwatch[];
};

export function parseColorSwatches(value: unknown): ColorSwatch[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (entry): entry is Record<string, unknown> =>
        typeof entry === "object" &&
        entry !== null &&
        typeof entry.image_url === "string" &&
        entry.image_url.length > 0
    )
    .map((entry) => ({
      name: typeof entry.name === "string" ? entry.name : "",
      image_url: entry.image_url as string,
    }));
}

export type SectionWithItems = Section & {
  items: Item[];
};

export type DisplayWithSections = Display & {
  sections: SectionWithItems[];
};

export type ItemFormData = {
  id?: string;
  description: string;
  quantity: number;
  rrp: string;
  finish: string;
  code: string;
  image_url: string | null;
  imageFile?: File | null;
  also_available_in: ColorSwatchFormData[];
};

export type SectionFormData = {
  id?: string;
  name: string;
  items: ItemFormData[];
};
