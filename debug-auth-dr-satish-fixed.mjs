// Debug authentication for dr.satish@greybrain.ai
import { WHITELISTED_EMAILS } from './config/whitelistedEmails.ts';

const testEmail = 'dr.satish@greybrain.ai';

console.log('🔍 DEBUGGING AUTHENTICATION FOR:', testEmail);
console.log('=' .repeat(60));

function debugAuthentication() {
  try {
    // Check hardcoded whitelist
    const normalizedEmail = testEmail.toLowerCase();
    const isInHardcoded = WHITELISTED_EMAILS.includes(normalizedEmail);
    
    console.log('📋 Hardcoded whitelist check:', isInHardcoded);
    console.log('   Looking for:', normalizedEmail);
    console.log('   Available emails:', WHITELISTED_EMAILS);
    
    // Check if there are any case sensitivity issues
    const exactMatch = WHITELISTED_EMAILS.find(email => email === testEmail);
    const caseInsensitiveMatch = WHITELISTED_EMAILS.find(email => email.toLowerCase() === normalizedEmail);
    
    console.log('\n🔍 Case sensitivity check:');
    console.log('   Exact match:', exactMatch || 'none');
    console.log('   Case-insensitive match:', caseInsensitiveMatch || 'none');
    
    // Final authentication result (assuming Supabase check passes since you confirmed they're in the table)
    const canAuthenticate = isInHardcoded; // Since you confirmed they're in Supabase table too
    console.log('\n🎯 FINAL RESULT:', canAuthenticate ? '✅ APPROVED' : '❌ DENIED');
    
    if (!canAuthenticate) {
      console.log('\n❌ REASON: User not found in hardcoded whitelist');
      console.log('   - This suggests a case sensitivity or exact match issue');
    }
    
  } catch (error) {
    console.error('❌ Error during authentication debug:', error);
  }
}

debugAuthentication();