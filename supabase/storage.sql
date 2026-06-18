-- Run this in Supabase → SQL Editor if image uploads fail with "Bucket not found"

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
