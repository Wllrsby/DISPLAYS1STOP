-- Run in Supabase → SQL Editor to allow decimal quantities (e.g. 3.34)

ALTER TABLE items
  ALTER COLUMN quantity TYPE NUMERIC(10, 2)
  USING quantity::numeric;

ALTER TABLE items
  ALTER COLUMN quantity SET DEFAULT 1;
