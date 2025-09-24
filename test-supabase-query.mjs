// Test the exact Supabase query that's failing
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkgxhcactrytfkrbsket.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3hoY2FjdHJ5dGZrcmJza2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzMyOTEsImV4cCI6MjA3Mzc0OTI5MX0.dVz8mIDe39s3lsz1W2t23lL5MIbBzMjTsQ526diuO40';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testEmail = 'dr.satish@greybrain.ai';

console.log('🔍 TESTING SUPABASE QUERY FOR:', testEmail);
console.log('=' .repeat(60));

async function testSupabaseQuery() {
  try {
    console.log('🗄️ Testing Supabase whitelist query...');
    
    // Test the exact query from App.tsx
    const { data: whitelistData, error: whitelistError } = await supabase
      .from('whitelisted_users')
      .select('id')
      .eq('email', testEmail)
      .single();
    
    console.log('📊 Query Results:');
    console.log('   Data:', whitelistData);
    console.log('   Error:', whitelistError);
    console.log('   Status: ', whitelistError?.code || 'success');
    
    if (whitelistError) {
      console.log('\n❌ Error Details:');
      console.log('   Code:', whitelistError.code);
      console.log('   Message:', whitelistError.message);
      console.log('   Details:', whitelistError.details);
      console.log('   Hint:', whitelistError.hint);
    }
    
    // Also test a simple select all to see if the table is accessible
    console.log('\n🔍 Testing table access...');
    const { data: allData, error: allError } = await supabase
      .from('whitelisted_users')
      .select('*')
      .limit(5);
    
    console.log('   All data (limited to 5):', allData);
    console.log('   All query error:', allError);
    
    // Test with different query approach
    console.log('\n🔍 Testing alternative query...');
    const { data: altData, error: altError } = await supabase
      .from('whitelisted_users')
      .select('*')
      .eq('email', testEmail);
    
    console.log('   Alternative data:', altData);
    console.log('   Alternative error:', altError);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSupabaseQuery();