// Test welcome email functionality for whitelisted users
import { sendWelcomeEmail } from './services/emailService.ts';

console.log('📧 Testing Welcome Email Functionality');
console.log('=' .repeat(50));

// Test emails from your admin dashboard
const testUsers = [
  { email: 'drpratichi@skids.health', name: 'Dr. Pratichi' },
  { email: 'Raghab.panda@santaan.in', name: 'Raghab Panda' },
  { email: 'lnmishra84@gmail.com', name: 'LN Mishra' },
  { email: 'dr.satish@greybrain.ai', name: 'Dr. Satish' },
  { email: 'dev@santaan.in', name: 'Dev Team' },
  { email: 'admin@skids.health', name: 'Admin' },
  { email: 'devadmin@skids.health', name: 'Dev Admin' }
];

// Simulate your Netlify URL (you should replace this with your actual URL)
const appUrl = 'https://your-netlify-url.netlify.app'; // Replace with your actual URL

async function testWelcomeEmails() {
  console.log(`🚀 Testing welcome emails with app URL: ${appUrl}`);
  console.log('');
  
  for (const user of testUsers) {
    console.log(`📧 Testing welcome email for: ${user.email}`);
    
    try {
      const result = await sendWelcomeEmail({
        email: user.email,
        appUrl: appUrl
      });
      
      if (result.success) {
        console.log(`   ✅ Welcome email sent successfully to ${user.email}`);
      } else {
        console.log(`   ❌ Failed to send welcome email: ${result.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Error sending welcome email: ${error.message}`);
    }
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('');
  }
  
  console.log('🎉 Welcome email testing completed!');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   1. Replace the appUrl with your actual Netlify URL');
  console.log('   2. Users can now sign in with their whitelisted email addresses');
  console.log('   3. They will receive welcome emails with instructions');
}

// Note: This will actually send emails, so use with caution
testWelcomeEmails().catch(console.error);