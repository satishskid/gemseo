import { supabase } from './lib/supabaseClient.ts';

async function testRealAuthFlow() {
  console.log('=== TESTING REAL AUTHENTICATION FLOW ===\n');

  // Test 1: Check if we can access the whitelisted_users table using the app's client
  console.log('1. Testing table access with app client...');
  
  try {
    const { data, error } = await supabase
      .from('whitelisted_users')
      .select('*')
      .limit(5);

    if (error) {
      console.log('❌ Table access failed:', error.message);
      console.log('   Error code:', error.code);
      console.log('   Error details:', error.details);
      
      if (error.code === 'PGRST116') {
        console.log('   💡 No rows found (this might be OK)');
      } else if (error.code === '42501') {
        console.log('   💡 Permission denied - RLS policy blocking');
      } else if (error.message.includes('Invalid API key')) {
        console.log('   💡 API key issue - check if key is correct');
      }
    } else {
      console.log(`✅ Table access successful - found ${data ? data.length : 0} rows`);
      if (data && data.length > 0) {
        console.log('   Sample data:', data.slice(0, 2));
      }
    }
  } catch (err) {
    console.log('❌ Exception accessing table:', err.message);
  }

  // Test 2: Try to add a test user (simulate admin action)
  console.log('\n2. Testing user insertion...');
  
  const testEmail = `test-user-${Date.now()}@example.com`;
  console.log('   Trying to add test user:', testEmail);
  
  try {
    const { data, error } = await supabase
      .from('whitelisted_users')
      .insert([{ email: testEmail }])
      .select();

    if (error) {
      console.log('❌ Insert failed:', error.message);
      console.log('   Error code:', error.code);
      
      if (error.code === '42501') {
        console.log('   💡 RLS policy is blocking inserts');
      } else if (error.code === '23505') {
        console.log('   💡 Duplicate email');
      }
    } else {
      console.log('✅ Insert successful:', data);
      
      // Clean up - remove test user
      if (data && data[0]) {
        await supabase.from('whitelisted_users').delete().eq('id', data[0].id);
        console.log('   🧹 Cleaned up test user');
      }
    }
  } catch (err) {
    console.log('❌ Exception during insert:', err.message);
  }

  // Test 3: Check specific emails that should be in the system
  console.log('\n3. Testing specific email lookups...');
  
  const testEmails = [
    'dr.satish@greybrain.ai',
    'admin-added@example.com',
    'test@nonexistent.com'
  ];

  for (const email of testEmails) {
    console.log(`   Checking: ${email}`);
    try {
      const { data, error } = await supabase
        .from('whitelisted_users')
        .select('id, email, created_at')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`     ℹ️  Not found in Supabase table`);
        } else {
          console.log(`     ❌ Error: ${error.message}`);
        }
      } else if (data) {
        console.log(`     ✅ Found: ${data.email} (created: ${data.created_at})`);
      }
    } catch (err) {
      console.log(`     ❌ Exception: ${err.message}`);
    }
  }

  console.log('\n=== REAL AUTH FLOW TEST COMPLETE ===');
}

testRealAuthFlow().catch(console.error);