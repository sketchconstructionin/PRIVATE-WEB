-- SQL Schema Migration: WhatsApp Business & Leads Database
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/swaqwlilafdebynpnihq/sql/new

-- 1. Create Leads table to store website inquiry forms
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    project_type TEXT,
    budget TEXT,
    description TEXT,
    attachment_url TEXT,
    whatsapp_status TEXT DEFAULT 'pending' -- 'pending', 'sent', 'failed'
);

-- Enable Row Level Security (RLS) for Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from frontend website form)
CREATE POLICY "Allow anonymous insert access" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated read/write (for dashboard admin)
CREATE POLICY "Allow authenticated read/write access" 
ON public.leads 
FOR ALL 
TO authenticated 
USING (true);


-- 2. Create WhatsApp Logs table for tracking message logs and chatbot history
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT now(),
    from_number TEXT NOT NULL,
    to_number TEXT NOT NULL,
    message_body TEXT,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    status TEXT DEFAULT 'delivered'
);

-- Enable RLS for WhatsApp Logs
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (or the API server service role) can view logs
CREATE POLICY "Allow service role full access" 
ON public.whatsapp_logs 
FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Allow authenticated read access" 
ON public.whatsapp_logs 
FOR SELECT 
TO authenticated 
USING (true);
