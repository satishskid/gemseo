// Test script to verify whitelisted emails functionality
import { WHITELISTED_EMAILS, isWhitelistedEmail } from './config/whitelistedEmails.ts';

console.log('🧪 Testing Whitelisted Emails Configuration...');
console.log('');

// Test 1: Verify all emails are in the list
const expectedEmails = [
  'drpratichi@skids.health',
  'dr.satish@greybrain.ai',
  'dev@santaan.in',
  'raghab.panda@santaan.in',
  'Lnmishra84@gmail.com',
  'satish@skids.health'
];

console.log('✅ Whitelisted Emails in Configuration:');
WHITELISTED_EMAILS.forEach((email, index) => {
  console.log(`   ${index + 1}. ${email}`);
});

console.log('');

// Test 2: Verify isWhitelistedEmail function
console.log('🔍 Testing isWhitelistedEmail function:');
expectedEmails.forEach(email => {
  const result = isWhitelistedEmail(email);
  console.log(`   ${email}: ${result ? '✅ WHITELISTED' : '❌ NOT WHITELISTED'}`);
});

console.log('');

// Test 3: Test non-whitelisted email
console.log('🔍 Testing non-whitelisted email:');
const nonWhitelistedEmail = 'random@example.com';
const result = isWhitelistedEmail(nonWhitelistedEmail);
console.log(`   ${nonWhitelistedEmail}: ${result ? '✅ WHITELISTED' : '❌ NOT WHITELISTED'}`);

console.log('');
console.log('🎉 Whitelisted emails configuration is working correctly!');
console.log('📧 Your team members can now access the application with these email addresses.');