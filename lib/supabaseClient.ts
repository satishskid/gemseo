import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- IMPORTANT SETUP ---
// Go to your Supabase project dashboard > Settings > API
// and copy your Project URL and anon key here.
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
// --- END OF SETUP ---


const isSupabaseConfigured = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

// We conditionally export the client. If it's not configured, we export null.
// This prevents the app from crashing and allows us to show a helpful message.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;