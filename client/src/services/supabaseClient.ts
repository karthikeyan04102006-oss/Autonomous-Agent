import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Reads frontend public environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://pfbtkptqqfhrntvwesuq.supabase.co';
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || '';

export let supabaseClient: SupabaseClient | null = null;

// Initialize browser-side Supabase client using PUBLISHABLE KEY ONLY
if (supabaseUrl && supabasePublishableKey && !supabasePublishableKey.includes('PASTE_MY')) {
  try {
    supabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    console.log('[Frontend Supabase] Initialized client with publishable key');
  } catch (err) {
    console.warn('[Frontend Supabase] Could not initialize client:', err);
  }
}
