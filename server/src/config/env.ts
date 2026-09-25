import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL || 'https://pfbtkptqqfhrntvwesuq.supabase.co',
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || '',
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  demoMode: process.env.DEMO_MODE === 'true' || true,
};

// Security check helper - NEVER log actual secret values
export function isRealSupabaseSecretConfigured(): boolean {
  return (
    Boolean(config.supabaseSecretKey) &&
    !config.supabaseSecretKey.includes('PASTE_MY') &&
    !config.supabaseSecretKey.includes('YOUR_')
  );
}

export function isRealSupabasePublishableConfigured(): boolean {
  return (
    Boolean(config.supabasePublishableKey) &&
    !config.supabasePublishableKey.includes('PASTE_MY') &&
    !config.supabasePublishableKey.includes('YOUR_')
  );
}
