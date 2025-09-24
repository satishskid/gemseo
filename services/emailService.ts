import { Resend } from 'resend';
import { WHITELISTED_EMAILS } from '../config/whitelistedEmails';

const resend = new Resend('re_KvzBi2dv_JE9vDNRriZUiakAU9kALsSTD');

interface WelcomeEmailData {
  email: string;
  appUrl: string;
}

export const sendWelcomeEmail = async ({ email, appUrl }: WelcomeEmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Use centralized whitelisted emails configuration
    const whitelistedEmails = WHITELISTED_EMAILS;
    
    // Since domain is verified, all emails can be sent
    console.log(`📧 Sending welcome email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: 'welcome@greybrain.ai',
      to: email,
      subject: '🚀 Welcome to gbseo - Your AI-Powered SEO Access is Ready!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4f46e5; font-size: 28px; margin-bottom: 10px;">🚀 Welcome to gbseo!</h1>
              <p style="color: #6b7280; font-size: 16px;">Your AI-powered SEO strategy generator is ready</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">🔑 Getting Started is Easy:</h2>
              <ol style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                <li>Visit: <a href="${appUrl}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">${appUrl}</a></li>
                <li>Click "Sign in with Email"</li>
                <li>Enter your email: <strong>${email}</strong></li>
                <li>Check your email for the magic link</li>
                <li>Click the link and you're in!</li>
              </ol>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">✨ What You'll Get:</h2>
              <ul style="color: #4b5563; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                <li>AI-powered SEO strategy generation</li>
                <li>Local SEO optimization</li>
                <li>Content calendar planning</li>
                <li>Social media post suggestions</li>
                <li>Technical SEO audits</li>
                <li>And much more!</li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                <strong>💡 Pro Tip:</strong> Have your business information ready (business name, location, services) to get the most out of your first session.
              </p>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="${appUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Get Started Now</a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Need help getting started? Just reply to this email or contact the person who added you to the platform.
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin-top: 10px;">
                Ready to boost your SEO? Let's go! 🚀
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
🚀 Welcome to gbseo!

Your AI-powered SEO strategy generator is ready!

🔑 GETTING STARTED IS EASY:
1. Visit: ${appUrl}
2. Click "Sign in with Email"
3. Enter your email: ${email}
4. Check your inbox for the magic link
5. Click the link and you're in!

✨ WHAT YOU'LL GET:
• AI-powered SEO strategy generation
• Local SEO optimization
• Content calendar planning
• Social media post suggestions
• Technical SEO audits
• And much more!

💡 PRO TIP: Have your business information ready (business name, location, services) to get the most out of your first session.

Need help getting started? Just reply to this email or contact the person who added you to the platform.

Ready to boost your SEO? Let's go! 🚀

Best regards,
The gbseo Team
      `
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const testEmailConfiguration = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'welcome@greybrain.ai',
      to: 'test@example.com',
      subject: 'Test Email - gbseo Configuration',
      text: 'This is a test email to verify gbseo email configuration is working.'
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};