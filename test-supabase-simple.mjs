import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from the current project
const supabaseUrl = 'https://xkgxhcactrytfkrbsket.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3hoYWN0cnl0ZmtyYnNrZXQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc1ODE3MzI5MSwiZXhwIjoyMDczNzQ5MjkxfQ.dVz8mIDe39s3lsz1W2t23lL5MIbBzMjTsQ526diuO40';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableAccess() {
  console.log('=== SUPABASE TABLE ACCESS TEST ===\n');

  // Test 1: Basic connection
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

  // Test 2: Check whitelisted_users table with different approaches
  console.log('\n2. Testing whitelisted_users table access...');
  
  // Try simple select first
  console.log('   Attempting simple select...');
  try {
    const { data, error } = await supabase
      .from('whitelisted_users')
      .select('*')
      .limit(10);

    if (error) {
      console.log('   ❌ Select error:', error.message, `(Code: ${error.code})`);
      if (error.code === 'PGRST116') {
        console.log('   💡 No rows found or RLS policy blocking');
      } else if (error.code === '42501') {
        console.log('   💡 Permission denied - RLS policy blocking');
      }
    } else {
      console.log(`   ✅ Found ${data ? data.length : 0} rows`);
      if (data && data.length > 0) {
        console.log('   Sample data:', data.slice(0, 3));
      }
    }
  } catch (err) {
    console.log('   ❌ Exception:', err.message);
  }

  // Test 3: Try to insert a test user
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
        console.log('💡 RLS policy is blocking inserts - this is likely the issue!');
      }
    } else {
      console.log('✅ Insert successful:', data);
      // Clean up
      if (data && data[0]) {
        await supabase.from('whitelisted_users').delete().eq('id', data[0].id);
      }
    }
  } catch (err) {
    console.log('❌ Insert exception:', err.message);
  }

  // Test 4: Check if we can see any existing users
  console.log('\n4. Checking for existing users...');
  try {
    const { data, error } = await supabase
      .from('whitelisted_users')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log('❌ Cannot fetch users:', error.message);
    } else if (data && data.length > 0) {
      console.log('✅ Found existing users:');
      data.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
      });
    } else {
      console.log('ℹ️  No users found in table (empty table or RLS blocking)');
    }
  } catch (err) {
    console.log('❌ Fetch exception:', err.message);
  }

  console.log('\n=== DIAGNOSIS ===');
  console.log('Based on these tests, we can determine if:');
  console.log('- RLS policies are blocking read/write access');
  console.log('- The table is actually empty');
  console.log('- Inserts are being blocked');
}

checkTableAccess().catch(console.error);