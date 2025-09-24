// Test authentication configuration without sending actual emails
console.log('🧪 Authentication Configuration Test');
console.log('=' .repeat(50));

// Import the whitelist configuration
import { WHITELISTED_EMAILS } from './config/whitelistedEmails.ts';

// Test emails you added via admin dashboard
const adminAddedEmails = [
  'drpratichi@skids.health',
  'Raghab.panda@santaan.in', 
  'lnmishra84@gmail.com',
  'dr.satish@greybrain.ai',
  'dev@santaan.in',
  'admin@skids.health',
  'devadmin@skids.health'
];

console.log('\n📋 Current Hardcoded Whitelist:');
WHITELISTED_EMAILS.forEach((email, index) => {
  console.log(`   ${index + 1}. ${email}`);
});

console.log('\n🔍 Testing Your Admin-Added Emails:');
adminAddedEmails.forEach(email => {
  const normalizedEmail = email.toLowerCase();
  const isInHardcodedList = WHITELISTED_EMAILS.includes(normalizedEmail);
  const canAuthenticate = isInHardcodedList; // Assuming they're also in Supabase
  
  console.log(`\n📧 ${email}:`);
  console.log(`   - Normalized: ${normalizedEmail}`);
  console.log(`   - In Hardcoded List: ${isInHardcodedList ? '✅ YES' : '❌ NO'}`);
  console.log(`   - Can Authenticate: ${canAuthenticate ? '🟢 ACCESS GRANTED' : '🟡 NEEDS SUPABASE CHECK'}`);
});

console.log('\n💡 Authentication Status:');
console.log('✅ These emails should be able to authenticate:');
adminAddedEmails.forEach(email => {
  const normalizedEmail = email.toLowerCase();
  if (WHITELISTED_EMAILS.includes(normalizedEmail)) {
    console.log(`   - ${email} (hardcoded whitelist)`);
  }
});

console.log('\n🟡 These emails need Supabase verification:');
adminAddedEmails.forEach(email => {
  const normalizedEmail = email.toLowerCase();
  if (!WHITELISTED_EMAILS.includes(normalizedEmail)) {
    console.log(`   - ${email} (needs to be in Supabase table)`);
  }
});

console.log('\n🎯 Summary:');
console.log('   The app checks BOTH hardcoded whitelist AND Supabase table.');
console.log('   Users you added via admin dashboard should be in Supabase.');
console.log('   If they\'re not working, we need to verify Supabase insertion.');