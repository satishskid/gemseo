import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mwnwhshpqffntedqueuz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bndoc2hxcWZmbnRlZHF1ZXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzU0MjksImV4cCI6MjA1MTI1MTQyOX0.9cxlJ_KjA7P1wL5dQjHf5-c7x1sGaJ4b1c5hQ6Zr3Y';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkWhitelistedUsers() {
  console.log('🔍 Checking whitelisted users in Supabase...');
  
  const { data, error } = await supabase
    .from('whitelisted_users')
    .select('email, created_at');
    
  if (error) {
    console.error('❌ Error fetching whitelisted users:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('✅ Found whitelisted users:');
    data.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (added: ${new Date(user.created_at).toLocaleString()})`);
    });
  } else {
    console.log('⚠️  No whitelisted users found in database');
  }
  
  // Test specific emails you mentioned
  const testEmails = [
    'drpratichi@skids.health',
    'Raghab.panda@santaan.in',
    'lnmishra84@gmail.com',
    'dr.satish@greybrain.ai',
    'dev@santaan.in',
    'admin@skids.health',
    'devadmin@skids.health'
  ];
  
  console.log('\n🔍 Testing specific emails:');
  for (const email of testEmails) {
    const { data: userData } = await supabase
      .from('whitelisted_users')
      .select('email')
      .eq('email', email)
      .single();
      
    if (userData) {
      console.log(`✅ ${email} - FOUND in database`);
    } else {
      console.log(`❌ ${email} - NOT FOUND in database`);
    }
  }
}

checkWhitelistedUsers().catch(console.error);