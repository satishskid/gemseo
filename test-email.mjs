import { Resend } from 'resend';

const resend = new Resend('re_KvzBi2dv_JE9vDNRriZUiakAU9kALsSTD');

async function testEmail() {
  try {
    console.log('Testing Resend API configuration...');
    
    // Test the email service with whitelisted addresses
    const testEmails = [
      'drpratichi@skids.health',
      'dr.satish@greybrain.ai',
      'dev@santaan.in',
      'raghab.panda@santaan.in',
      'Lnmishra84@gmail.com'
    ];

    // Test each whitelisted email
    for (const email of testEmails) {
      console.log(`\n🧪 Testing email: ${email}`);
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Test Email - gbseo Configuration',
        text: 'This is a test email to verify gbseo email configuration is working.'
      });
      
      if (error) {
        console.log(`❌ Email test failed for ${email}:`, error);
      } else {
        console.log(`✅ Email test successful for ${email}`);
        console.log(`ℹ️  Email ID: ${data.id}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
}

testEmail().then(result => {
  console.log('Final result:', result);
  process.exit(result.success ? 0 : 1);
});