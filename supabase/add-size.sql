-- Run in Supabase → SQL Editor to add size field to items

ALTER TABLE items ADD COLUMN IF NOT EXISTS size TEXT;
