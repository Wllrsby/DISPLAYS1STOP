-- Run in Supabase → SQL Editor if you see:
-- "new row violates row-level security policy"

ALTER TABLE displays ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Remove old policies (safe to re-run)
DROP POLICY IF EXISTS "Public can read displays" ON displays;
DROP POLICY IF EXISTS "Anyone can insert displays" ON displays;
DROP POLICY IF EXISTS "Anyone can update displays" ON displays;
DROP POLICY IF EXISTS "Anyone can delete displays" ON displays;

DROP POLICY IF EXISTS "Public can read items" ON items;
DROP POLICY IF EXISTS "Anyone can insert items" ON items;
DROP POLICY IF EXISTS "Anyone can update items" ON items;
DROP POLICY IF EXISTS "Anyone can delete items" ON items;

-- Allow public read (customer QR page)
CREATE POLICY "Public can read displays"
  ON displays FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read items"
  ON items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow admin writes (open for testing — lock down before production)
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

-- Table grants (needed if tables were created via the dashboard)
GRANT ALL ON displays TO anon, authenticated;
GRANT ALL ON items TO anon, authenticated;
