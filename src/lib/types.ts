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

export type Item = {
  id: string;
  display_id: string;
  section_id: string;
  description: string;
  quantity: number;
  rrp: number;
  image_url: string | null;
};

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
  image_url: string | null;
  imageFile?: File | null;
};

export type SectionFormData = {
  id?: string;
  name: string;
  items: ItemFormData[];
};
