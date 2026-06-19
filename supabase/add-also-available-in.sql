-- Adds colour swatches per item (run in Supabase → SQL Editor)
ALTER TABLE items
ADD COLUMN IF NOT EXISTS also_available_in JSONB NOT NULL DEFAULT '[]'::jsonb;
