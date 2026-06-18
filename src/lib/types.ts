export type Display = {
  id: string;
  name: string;
  created_at: string;
};

export type Item = {
  id: string;
  display_id: string;
  description: string;
  quantity: number;
  rrp: number;
  image_url: string | null;
};

export type DisplayWithItems = Display & {
  items: Item[];
};

export type ItemFormData = {
  id?: string;
  description: string;
  quantity: number;
  rrp: string;
  image_url: string | null;
  imageFile?: File | null;
};
