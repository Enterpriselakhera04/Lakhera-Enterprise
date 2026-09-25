-- Lakhera Enterprise - Supabase Schema Migration
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/dfaoaxehhszlbgvqaiyy/sql

-- 1. Consultations Table
CREATE TABLE IF NOT EXISTS public.consultations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  property_type TEXT DEFAULT 'Commercial',
  service_id TEXT NOT NULL,
  consultation_mode TEXT NOT NULL,
  address TEXT,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Quotes Table
CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_id TEXT NOT NULL,
  property_type TEXT DEFAULT 'Commercial',
  dimensions JSONB,
  material_preference TEXT,
  location TEXT,
  notes TEXT,
  files_count INT DEFAULT 0,
  status TEXT DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Inquiries / Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  phone TEXT,
  inquiry TEXT NOT NULL,
  service TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anonymous Access Policies for Public Booking & Quotes
DROP POLICY IF EXISTS "Allow anon read/write consultations" ON public.consultations;
CREATE POLICY "Allow anon read/write consultations" ON public.consultations
  FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read/write quotes" ON public.quotes;
CREATE POLICY "Allow anon read/write quotes" ON public.quotes
  FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert leads" ON public.leads;
CREATE POLICY "Allow anon insert leads" ON public.leads
  FOR ALL TO anon USING (true) WITH CHECK (true);
