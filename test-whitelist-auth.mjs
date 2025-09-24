import { WHITELISTED_EMAILS } from './config/whitelistedEmails.ts';

console.log('Testing whitelist configuration...');
console.log('Whitelisted emails:', WHITELISTED_EMAILS);

// Test emails from your whitelist
const testEmails = [
    'satish@skids.health',
    'pranav@skids.health', 
    'pratik@skids.health',
    'vaibhav@skids.health',
    'rajesh@skids.health',
    'sachin@skids.health'
];

console.log('\nTesting email verification:');
testEmails.forEach(email => {
    const isWhitelisted = WHITELISTED_EMAILS.includes(email);
    console.log(`${email}: ${isWhitelisted ? '✅ WHITELISTED' : '❌ NOT WHITELISTED'}`);
});

// Test non-whitelisted email
const nonWhitelistedEmail = 'random@example.com';
const isNonWhitelisted = WHITELISTED_EMAILS.includes(nonWhitelistedEmail);
console.log(`\n${nonWhitelistedEmail}: ${isNonWhitelisted ? '✅ WHITELISTED' : '❌ NOT WHITELISTED'}`);

console.log('\n✅ All whitelist tests completed successfully!');