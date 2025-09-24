// Debug authentication for dr.satish@greybrain.ai
import { createClient } from '@supabase/supabase-js';
import { WHITELISTED_EMAILS } from './config/whitelistedEmails.js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testEmail = 'dr.satish@greybrain.ai';

console.log('🔍 DEBUGGING AUTHENTICATION FOR:', testEmail);
console.log('=' .repeat(60));

async function debugAuthentication() {
  try {
    // Check hardcoded whitelist
    const normalizedEmail = testEmail.toLowerCase();
    const isInHardcoded = WHITELISTED_EMAILS.includes(normalizedEmail);
    console.log('📋 Hardcoded whitelist check:', isInHardcoded);
    console.log('   Available emails:', WHITELISTED_EMAILS);
    
    // Check Supabase whitelist
    console.log('\n🗄️ Checking Supabase whitelist...');
    const { data: whitelistData, error: whitelistError } = await supabase
      .from('whitelisted_users')
      .select('*')
      .eq('email', testEmail);
    
    console.log('   Supabase result:', whitelistData);
    console.log('   Supabase error:', whitelistError);
    
    const isInSupabase = whitelistData && whitelistData.length > 0;
    console.log('   Supabase whitelist check:', isInSupabase);
    
    // Final authentication result
    const canAuthenticate = isInHardcoded || isInSupabase;
    console.log('\n🎯 FINAL RESULT:', canAuthenticate ? '✅ APPROVED' : '❌ DENIED');
    
    if (!canAuthenticate) {
      console.log('\n❌ REASON: User not found in any whitelist');
      console.log('   - Hardcoded whitelist:', isInHardcoded ? '✅ Found' : '❌ Not found');
      console.log('   - Supabase whitelist:', isInSupabase ? '✅ Found' : '❌ Not found');
    }
    
  } catch (error) {
    console.error('❌ Error during authentication debug:', error);
  }
}

debugAuthentication();