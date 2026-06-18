-- Run in Supabase → SQL Editor to add finish and code fields to items

ALTER TABLE items ADD COLUMN IF NOT EXISTS finish TEXT;
ALTER TABLE items ADD COLUMN IF NOT EXISTS code TEXT;
