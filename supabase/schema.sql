-- Displays table
CREATE TABLE displays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_id UUID NOT NULL REFERENCES displays(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  rrp NUMERIC(10, 2) NOT NULL CHECK (rrp >= 0),
  image_url TEXT
);

CREATE INDEX items_display_id_idx ON items(display_id);

-- Row Level Security
ALTER TABLE displays ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Public read access for customer view
CREATE POLICY "Public can read displays"
  ON displays FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read items"
  ON items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write access (tighten with auth in production)
CREATE POLICY "Anyone can insert displays"
  ON displays FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update displays"
  ON displays FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete displays"
  ON displays FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert items"
  ON items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update items"
  ON items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete items"
  ON items FOR DELETE
  TO anon, authenticated
  USING (true);

-- Storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view item images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Anyone can upload item images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'item-images');

CREATE POLICY "Anyone can update item images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'item-images');

CREATE POLICY "Anyone can delete item images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'item-images');
