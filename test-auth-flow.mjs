// Test authentication flow for whitelisted users
// This script tests if users can authenticate through the app

const testEmails = [
  'drpratichi@skids.health',
  'Raghab.panda@santaan.in', 
  'lnmishra84@gmail.com',
  'dr.satish@greybrain.ai',
  'dev@santaan.in',
  'admin@skids.health',
  'devadmin@skids.health'
];

console.log('🧪 Testing Authentication Flow for Whitelisted Users');
console.log('=' .repeat(50));

// Test the hardcoded whitelist configuration
import('./config/whitelistedEmails.js').then(module => {
  const { WHITELISTED_EMAILS } = module;
  
  console.log('\n📋 Hardcoded Whitelist Configuration:');
  WHITELISTED_EMAILS.forEach((email, index) => {
    console.log(`   ${index + 1}. ${email}`);
  });
  
  console.log('\n🔍 Testing against hardcoded whitelist:');
  testEmails.forEach(email => {
    const isWhitelisted = WHITELISTED_EMAILS.includes(email.toLowerCase());
    console.log(`   ${email}: ${isWhitelisted ? '✅ WHITELISTED' : '❌ NOT FOUND'}`);
  });
  
  console.log('\n💡 Note: The app checks BOTH the hardcoded whitelist AND the Supabase table.');
  console.log('   Users need to be in either location to gain access.');
  
}).catch(error => {
  console.error('Error loading whitelist configuration:', error);
});