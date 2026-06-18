-- Run in Supabase → SQL Editor to add sections support
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT patterns)

CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_id UUID NOT NULL REFERENCES displays(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS sections_display_id_idx ON sections(display_id);

ALTER TABLE items ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES sections(id) ON DELETE CASCADE;

-- Migrate existing items into a default section per display
INSERT INTO sections (display_id, name, sort_order)
SELECT d.id, 'Main', 0
FROM displays d
WHERE EXISTS (SELECT 1 FROM items i WHERE i.display_id = d.id AND i.section_id IS NULL)
  AND NOT EXISTS (SELECT 1 FROM sections s WHERE s.display_id = d.id);

UPDATE items i
SET section_id = s.id
FROM sections s
WHERE i.display_id = s.display_id
  AND i.section_id IS NULL
  AND s.name = 'Main'
  AND s.sort_order = 0;

GRANT ALL ON sections TO anon, authenticated;

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read sections" ON sections;
DROP POLICY IF EXISTS "Anyone can insert sections" ON sections;
DROP POLICY IF EXISTS "Anyone can update sections" ON sections;
DROP POLICY IF EXISTS "Anyone can delete sections" ON sections;

CREATE POLICY "Public can read sections"
  ON sections FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can insert sections"
  ON sections FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can update sections"
  ON sections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete sections"
  ON sections FOR DELETE TO anon, authenticated USING (true);
