-- Creates the assigned_codes table used by the app to persist access codes
-- Run this in your Supabase SQL editor or via a Postgres client

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.assigned_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  code text NULL,
  code_hash text NULL,
  is_hashed boolean NOT NULL DEFAULT false,
  is_blocked boolean NOT NULL DEFAULT false,
  is_used boolean NOT NULL DEFAULT false,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assigned_codes_code_hash ON public.assigned_codes (code_hash);
CREATE INDEX IF NOT EXISTS idx_assigned_codes_user_id ON public.assigned_codes (user_id);
