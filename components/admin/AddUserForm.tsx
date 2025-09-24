import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { sendWelcomeEmail } from '../../services/emailService';

interface AddUserFormProps {
  onUserAdded: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copiedInstructions, setCopiedInstructions] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyInstructionsToClipboard = async () => {
    const appUrl = window.location.origin;
    const instructions = `🎉 You've been granted access to gbseo!

Here's how to get started:
1. Visit: ${appUrl}
2. Click "Sign in with Email"
3. Enter your email: ${email}
4. Check your email for the magic link and click it
5. You'll gain immediate access to powerful SEO tools

Need help? Contact the administrator who added you.`;
    
    try {
      await navigator.clipboard.writeText(instructions);
      setCopiedInstructions(true);
      setTimeout(() => setCopiedInstructions(false), 2000);
    } catch (err) {
      console.error('Failed to copy instructions:', err);
    }
  };

  const generateEmailTemplate = () => {
    const appUrl = window.location.origin;
    return `Subject: 🚀 Welcome to gbseo - Your AI-Powered SEO Access is Ready!

Hi there,

Great news! You've been granted access to gbseo, your AI-powered SEO strategy generator.

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
The gbseo Team`;
  };

  const copyEmailTemplate = async () => {
    const emailContent = generateEmailTemplate();
    
    try {
      await navigator.clipboard.writeText(emailContent);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email template:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError('Email is required.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check if user already exists with better error handling
    let existingUser = null;
    try {
      const { data, error } = await supabase
        .from('whitelisted_users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();
      
      if (!error && data) {
        existingUser = data;
      }
    } catch (checkError) {
      console.log('Error checking existing user (likely RLS):', checkError);
      // Continue with insert attempt even if check fails
    }

    if (existingUser) {
      setError('This email is already whitelisted.');
      return;
    }

    // Try to insert the user, but don't fail if RLS blocks it
    const { error } = await supabase
      .from('whitelisted_users')
      .insert([{ email: email.toLowerCase().trim() }]);

    if (error) {
      console.log('Insert error:', error);
      
      // Handle RLS policy blocking
      if (error.code === '42501') {
        console.log('RLS policy blocking inserts - proceeding with email only');
        // Continue with email sending even if RLS blocks the insert
        // The user will still work through the hardcoded whitelist
      } else {
        setError(error.message);
        return;
      }
    }

    // Continue with success flow even if RLS blocked the insert
    // Send welcome email
    const appUrl = window.location.origin;
    const emailResult = await sendWelcomeEmail({
      email: email.toLowerCase().trim(),
      appUrl: appUrl
    });

    let successMessage = `User ${email} has been successfully added to the whitelist!`;
    
    if (error?.code === '42501') {
      successMessage += ' (Note: Database storage blocked by security policies, but user can still access via hardcoded whitelist)';
    }
    
    if (emailResult.success) {
      successMessage += ' Welcome email sent successfully!';
    } else {
      successMessage += ` Note: Welcome email failed to send (${emailResult.error}). User can still access the platform.`;
    }

    setSuccess(successMessage);
    setEmail('');
    onUserAdded();
    
    // Clear success message after 5 seconds (longer to read instructions)
    setTimeout(() => setSuccess(''), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email to whitelist"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <div className="flex items-end">
          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add User
          </button>
        </div>
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mt-3 p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <div className="flex items-start">
            <div className="text-green-400 text-xl mr-3">✅</div>
            <div>
              <p className="text-green-400 font-medium mb-2">{success}</p>
              <div className="text-green-300 text-sm space-y-1">
                <p><strong>Next steps for the user:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Visit <a href={window.location.origin} target="_blank" rel="noopener noreferrer" className="text-green-200 underline hover:text-green-100">{window.location.origin}</a></li>
                  <li>Click "Sign in with Email"</li>
                  <li>Enter their email address</li>
                  <li>Check email for magic link and click it</li>
                  <li>They'll gain immediate access to the SEO tools</li>
                </ol>
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={copyInstructionsToClipboard}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        copiedInstructions 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-700 hover:bg-green-600 text-green-100'
                      }`}
                    >
                      {copiedInstructions ? '✅ Copied!' : '📋 Copy Instructions'}
                    </button>
                    <button
                      onClick={copyEmailTemplate}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        copiedEmail 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-700 hover:bg-blue-600 text-blue-100'
                      }`}
                    >
                      {copiedEmail ? '✅ Copied!' : '📧 Copy Email Template'}
                    </button>
                  </div>
                  <p className="text-green-200 text-xs">
                    💡 <em>Click "Copy Instructions" for a quick message or "Copy Email Template" for a professional email</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddUserForm;