import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// --- IMPORTANT SETUP ---
// Go to your Supabase project dashboard > Settings > API
// and copy your Project URL and anon key here.
const supabaseUrl = 'https://xkgxhcactrytfkrbsket.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3hoY2FjdHJ5dGZrcmJza2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzMyOTEsImV4cCI6MjA3Mzc0OTI5MX0.dVz8mIDe39s3lsz1W2t23lL5MIbBzMjTsQ526diuO40';
// --- END OF SETUP ---


export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);