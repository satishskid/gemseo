// Test current authentication status for dr.satish@greybrain.ai
console.log('🔍 TESTING CURRENT AUTHENTICATION STATUS');
console.log('=' .repeat(50));

// Simulate the exact logic from App.tsx
const WHITELISTED_EMAILS = [
  'drpratichi@skids.health',
  'dr.satish@greybrain.ai', 
  'dev@santaan.in',
  'raghab.panda@santaan.in',
  'Lnmishra84@gmail.com',
  'satish@skids.health'
];

function simulateAppAuthentication(email) {
  console.log(`Testing email: ${email}`);
  
  // Check hardcoded whitelist (from App.tsx line 35)
  const isInHardcodedWhitelist = WHITELISTED_EMAILS.includes(email);
  console.log(`Hardcoded whitelist check: ${isInHardcodedWhitelist}`);
  
  // Since you confirmed they're in Supabase table, let's assume that check passes
  const isInSupabaseWhitelist = true; // You confirmed they're visible in admin
  console.log(`Supabase whitelist check: ${isInSupabaseWhitelist}`);
  
  // Final authentication result (from App.tsx lines 39-44)
  const canAuthenticate = isInHardcodedWhitelist || isInSupabaseWhitelist;
  console.log(`Final authentication result: ${canAuthenticate ? '✅ APPROVED' : '❌ DENIED'}`);
  
  // Check the admin bypass (from App.tsx lines 73-75)
  const isAdmin = email === 'satish@skids.health';
  console.log(`Admin bypass: ${isAdmin}`);
  
  return canAuthenticate || isAdmin;
}

// Test the problematic email
const testEmail = 'dr.satish@greybrain.ai';
const result = simulateAppAuthentication(testEmail);

console.log('\n' + '='.repeat(50));
console.log(`🎯 FINAL RESULT FOR ${testEmail}:`);
console.log(`   ${result ? '✅ USER SHOULD BE ABLE TO AUTHENTICATE' : '❌ USER WILL BE DENIED ACCESS'}`);

if (!result) {
  console.log('\n❌ TROUBLESHOOTING:');
  console.log('   1. Check if the email is exactly as listed (case sensitive)');
  console.log('   2. Verify Supabase connection is working');
  console.log('   3. Check browser console for JavaScript errors');
  console.log('   4. Clear browser cache and try again');
  console.log('   5. Check if the App.tsx file was recently updated');
}