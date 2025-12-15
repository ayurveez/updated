-- Ensure code_hash is unique to avoid duplicate codes being inserted
CREATE UNIQUE INDEX IF NOT EXISTS ux_assigned_codes_code_hash ON public.assigned_codes (code_hash);
