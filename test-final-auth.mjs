import { readFileSync } from 'fs';

// Read the TypeScript file and extract the whitelist
const whitelistFile = readFileSync('./config/whitelistedEmails.ts', 'utf8');
const match = whitelistFile.match(/export\s+const\s+WHITELISTED_EMAILS\s*=\s*\[([\s\S]*?)\]/);
if (!match) {
  console.error('Could not find WHITELISTED_EMAILS in file');
  process.exit(1);
}

const emailsStr = match[1];
const WHITELISTED_EMAILS = emailsStr
  .split(',')
  .map(email => email.trim().replace(/['"]/g, ''))
  .filter(email => email.includes('@'));

const testEmail = 'dr.satish@greybrain.ai';

console.log('=== FINAL AUTHENTICATION TEST ===');
console.log('Testing email:', testEmail);
console.log('');

// Test hardcoded whitelist
const isInHardcoded = WHITELISTED_EMAILS.includes(testEmail);
console.log('✓ Hardcoded whitelist check:', isInHardcoded);

// Test case variations
const variations = [
  testEmail,
  testEmail.toLowerCase(),
  testEmail.toUpperCase(),
  testEmail.trim()
];

console.log('');
console.log('Case sensitivity test:');
variations.forEach(email => {
  const result = WHITELISTED_EMAILS.includes(email);
  console.log(`  "${email}": ${result}`);
});

console.log('');
console.log('=== RESULT ===');
if (isInHardcoded) {
  console.log('✅ APPROVED - User should be able to authenticate');
} else {
  console.log('❌ DENIED - User not in whitelist');
}

console.log('');
console.log('Hardcoded whitelist contents:');
WHITELISTED_EMAILS.forEach((email, index) => {
  console.log(`  ${index + 1}. ${email}`);
});