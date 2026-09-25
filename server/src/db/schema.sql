-- AgentFlow Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Query Editor to set up the database tables and Row Level Security (RLS) policies.

-- 1. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo_user',
  task TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'PLANNING', 'EXECUTING', 'WAITING_FOR_APPROVAL', 'VERIFYING', 'COMPLETED', 'FAILED')),
  result JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agent Steps Table
CREATE TABLE IF NOT EXISTS public.agent_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  description TEXT NOT NULL,
  tool TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'waiting_approval')),
  result JSONB DEFAULT '{}'::jsonb,
  requires_approval BOOLEAN DEFAULT FALSE,
  execution_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('info', 'success', 'warning', 'error')),
  timestamp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Integrations Table
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo_user',
  provider TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('connected', 'disconnected')),
  last_used TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Memories Table
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo_user',
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  category TEXT DEFAULT 'User Preferences',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default Integrations
INSERT INTO public.integrations (provider, status, description, last_used) VALUES
('Google Calendar', 'connected', 'Allow AgentFlow to read availability and create calendar events.', '2 minutes ago'),
('Gmail', 'connected', 'Draft and send emails to team members and external partners.', '5 minutes ago'),
('Google Maps', 'connected', 'Find locations, calculate travel routes, and estimate transit times.', '1 hour ago'),
('Weather', 'connected', 'Retrieve real-time weather forecasts and travel weather warnings.', '10 minutes ago'),
('Flight Search', 'connected', 'Search flights, compare airline fares, and prepare booking drafts.', 'Yesterday'),
('Hotel Search', 'connected', 'Discover top-rated hotels, check room rates, and check availability.', '3 hours ago'),
('WhatsApp', 'disconnected', 'Send instant notifications and chat updates via WhatsApp Business API.', 'Never'),
('Slack', 'connected', 'Broadcast agent task updates and request approvals directly in Slack channels.', 'Just now')
ON CONFLICT (provider) DO NOTHING;

-- Seed default Memories
INSERT INTO public.memories (key, value, category) VALUES
('Preferred meeting time', '3:00 PM - 6:00 PM (IST)', 'User Preferences'),
('Preferred airline', 'IndiGo / Vistara (Economy)', 'User Preferences'),
('Home Location', 'Chennai, Tamil Nadu', 'Saved Context'),
('Default Team Email', 'team-sync@agentflow.ai', 'Agent Context')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Permissive RLS policies for demo/production flexibility
CREATE POLICY "Allow public read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert tasks" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tasks" ON public.tasks FOR UPDATE USING (true);

CREATE POLICY "Allow public read agent_steps" ON public.agent_steps FOR SELECT USING (true);
CREATE POLICY "Allow public insert agent_steps" ON public.agent_steps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update agent_steps" ON public.agent_steps FOR UPDATE USING (true);

CREATE POLICY "Allow public read activity_logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert activity_logs" ON public.activity_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read integrations" ON public.integrations FOR SELECT USING (true);
CREATE POLICY "Allow public update integrations" ON public.integrations FOR UPDATE USING (true);

CREATE POLICY "Allow public read memories" ON public.memories FOR SELECT USING (true);
CREATE POLICY "Allow public insert memories" ON public.memories FOR INSERT WITH CHECK (true);
