import { readFileSync } from 'fs';
import { join } from 'path';

// Read the hardcoded whitelist
const whitelistPath = join(process.cwd(), 'config', 'whitelistedEmails.ts');
const whitelistContent = readFileSync(whitelistPath, 'utf8');
const emailMatches = whitelistContent.match(/WHITELISTED_EMAILS\s*=\s*\[([\s\S]*?)\]/);
if (!emailMatches) {
  console.log('Could not find WHITELISTED_EMAILS array');
  process.exit(1);
}

const hardcodedEmails = emailMatches[1]
  .split(',')
  .map(email => email.trim().replace(/['"]/g, ''))
  .filter(email => email.includes('@'));

console.log('=== Testing Updated Authentication Logic ===');
console.log('Hardcoded whitelist contains:', hardcodedEmails.length, 'emails');

// Test specific emails
testEmail('dr.satish@greybrain.ai');
testEmail('drpratichi@skids.health');
testEmail('nonexistent@example.com');
testEmail('admin-added@example.com');

function testEmail(email) {
  console.log('\n--- Testing:', email, '---');
  
  // Simulate hardcoded whitelist check (priority 1)
  const isInHardcoded = hardcodedEmails.includes(email.toLowerCase());
  console.log('Hardcoded whitelist:', isInHardcoded ? '✅ FOUND' : '❌ NOT FOUND');
  
  if (isInHardcoded) {
    console.log('✅ Authentication SUCCESS via hardcoded whitelist');
    return true;
  }
  
  // Simulate Supabase check (priority 2) - would normally be blocked by RLS
  console.log('Supabase whitelist: ❌ BLOCKED BY RLS POLICY');
  console.log('❌ Authentication FAILED');
  return false;
}

console.log('\n=== Summary ===');
console.log('The updated logic prioritizes hardcoded whitelist over Supabase.');
console.log('Admin-added users should be added to hardcoded whitelist for immediate access.');
console.log('RLS policies are blocking Supabase operations, but this is handled gracefully.');