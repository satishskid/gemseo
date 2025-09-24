import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './lib/supabaseClient.ts';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function comprehensiveTableTest() {
  console.log('=== COMPREHENSIVE SUPABASE TABLE TEST ===\n');

  // Test 1: Check if we can connect to Supabase
  console.log('1. Testing basic connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Basic connection successful');
    }
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }

  // Test 2: Check table structure and RLS policies
  console.log('\n2. Testing whitelisted_users table access...');
  
  // Try different query approaches
  const testQueries = [
    {
      name: 'Simple select all',
      query: async () => await supabase.from('whitelisted_users').select('*').limit(5)
    },
    {
      name: 'Select with specific email',
      query: async () => await supabase.from('whitelisted_users').select('id').eq('email', 'test@example.com')
    },
    {
      name: 'Count query',
      query: async () => await supabase.from('whitelisted_users').select('*', { count: 'exact', head: true })
    },
    {
      name: 'Table info via RPC',
      query: async () => await supabase.rpc('get_table_info', { table_name: 'whitelisted_users' }).catch(() => ({ data: null, error: { message: 'RPC not available' } }))
    }
  ];

  for (const test of testQueries) {
    console.log(`\n   Testing: ${test.name}`);
    try {
      const { data, error } = await test.query();
      if (error) {
        console.log(`   ❌ Error: ${error.message} (Code: ${error.code})`);
        if (error.code === 'PGRST116') {
          console.log('   💡 This usually means no rows found or RLS policy blocking');
        }
      } else {
        console.log(`   ✅ Success: Found ${data ? data.length : 0} rows`);
        if (data && data.length > 0) {
          console.log('   Data sample:', data.slice(0, 2));
        }
      }
    } catch (err) {
      console.log(`   ❌ Exception: ${err.message}`);
    }
  }

  // Test 3: Check if we can insert (simulate admin adding user)
  console.log('\n3. Testing insert capability...');
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const { data, error } = await supabase
      .from('whitelisted_users')
      .insert([{ email: testEmail }])
      .select();

    if (error) {
      console.log('❌ Insert failed:', error.message, `(Code: ${error.code})`);
      if (error.code === '42501') {
        console.log('💡 This is an RLS policy violation - inserts are blocked');
      }
    } else {
      console.log('✅ Insert successful:', data);
      // Clean up test data
      if (data && data[0]) {
        await supabase.from('whitelisted_users').delete().eq('id', data[0].id);
      }
    }
  } catch (err) {
    console.log('❌ Insert exception:', err.message);
  }

  // Test 4: Check RLS policies via system tables (if accessible)
  console.log('\n4. Testing RLS policy visibility...');
  try {
    const { data, error } = await supabase
      .from('information_schema.table_privileges')
      .select('*')
      .eq('table_name', 'whitelisted_users');

    if (error) {
      console.log('❌ Cannot access system tables:', error.message);
    } else {
      console.log('✅ System table access:', data ? data.length : 0, 'privileges found');
    }
  } catch (err) {
    console.log('❌ System table exception:', err.message);
  }

  console.log('\n=== TEST SUMMARY ===');
  console.log('Based on the test results, we can determine:');
  console.log('- If RLS policies are blocking access');
  console.log('- If the table structure is correct');
  console.log('- What permissions are available');
}

comprehensiveTableTest().catch(console.error);