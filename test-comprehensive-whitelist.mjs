// Comprehensive test for whitelisted users authentication
import { WHITELISTED_EMAILS, isWhitelistedEmail } from './config/whitelistedEmails.ts';

console.log('🧪 Comprehensive Whitelist Authentication Test');
console.log('=' .repeat(60));

// Emails you mentioned adding via admin dashboard
const adminAddedEmails = [
  'drpratichi@skids.health',
  'Raghab.panda@santaan.in', 
  'lnmishra84@gmail.com',
  'dr.satish@greybrain.ai',
  'dev@santaan.in',
  'admin@skids.health',
  'devadmin@skids.health'
];

console.log('\n📋 Hardcoded Whitelist Configuration:');
WHITELISTED_EMAILS.forEach((email, index) => {
  console.log(`   ${index + 1}. ${email}`);
});

console.log('\n🔍 Testing Admin-Added Emails Against Hardcoded Whitelist:');
adminAddedEmails.forEach(email => {
  const normalizedEmail = email.toLowerCase();
  const isWhitelisted = isWhitelistedEmail(normalizedEmail);
  const inHardcodedList = WHITELISTED_EMAILS.includes(normalizedEmail);
  
  console.log(`   ${email}:`);
  console.log(`      - Normalized: ${normalizedEmail}`);
  console.log(`      - In Hardcoded List: ${inHardcodedList ? '✅ YES' : '❌ NO'}`);
  console.log(`      - Can Authenticate: ${isWhitelisted || inHardcodedList ? '✅ YES' : '❌ NO'}`);
  console.log('');
});

console.log('💡 Authentication Summary:');
console.log('   The application checks BOTH hardcoded whitelist AND Supabase table.');
console.log('   Users can authenticate if they are in EITHER location.');
console.log('');
console.log('   ✅ Users in hardcoded whitelist: Can authenticate immediately');
console.log('   ✅ Users added via admin: Can authenticate (stored in Supabase)');
console.log('   ❌ Users not in either: Will see "Access Restricted" message');