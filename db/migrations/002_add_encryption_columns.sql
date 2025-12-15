-- Add encrypted code storage columns to assigned_codes

ALTER TABLE public.assigned_codes
  ADD COLUMN IF NOT EXISTS code_encrypted text,
  ADD COLUMN IF NOT EXISTS code_enc_iv text,
  ADD COLUMN IF NOT EXISTS is_encrypted boolean NOT NULL DEFAULT false;
