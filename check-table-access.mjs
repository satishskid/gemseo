// Check Row Level Security and table structure
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkgxhcactrytfkrbsket.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3hoY2FjdHJ5dGZrcmJza2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzMyOTEsImV4cCI6MjA3Mzc0OTI5MX0.dVz8mIDe39s3lsz1W2t23lL5MIbBzMjTsQ526diuO40';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 CHECKING ROW LEVEL SECURITY AND TABLE ACCESS');
console.log('=' .repeat(60));

async function checkTableAccess() {
  try {
    // Try to query with different approaches
    console.log('🗄️ Testing different query methods...');
    
    // Method 1: Try without RLS (using service role key if available)
    console.log('\n1. Testing with current anon key...');
    const { data: data1, error: error1 } = await supabase
      .from('whitelisted_users')
      .select('*');
    
    console.log('   Data:', data1);
    console.log('   Error:', error1);
    
    // Method 2: Try to see if we can get table info
    console.log('\n2. Testing table existence...');
    const { data: data2, error: error2 } = await supabase
      .rpc('get_table_info', { table_name: 'whitelisted_users' })
      .catch(() => ({ data: null, error: 'RPC not available' }));
    
    console.log('   Table info:', data2);
    console.log('   Error:', error2);
    
    // Method 3: Try a simple count
    console.log('\n3. Testing count query...');
    const { data: count, error: countError } = await supabase
      .from('whitelisted_users')
      .select('*', { count: 'exact', head: true });
    
    console.log('   Count:', count);
    console.log('   Count error:', countError);
    
    // Method 4: Check if we can see any tables
    console.log('\n4. Testing if we can see any data...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(2);
    
    console.log('   Profiles data:', profiles);
    console.log('   Profiles error:', profilesError);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkTableAccess();