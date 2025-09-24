import { WHITELISTED_EMAILS } from './config/whitelistedEmails.ts';

// Since we can't add users directly due to RLS, let's create a simple HTML page
// that can be used to add users through the admin interface

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Add Whitelisted Users - Admin Interface</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .user-list { margin: 20px 0; }
        .user-item { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #007bff; }
        .instructions { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .warning { background: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ffc107; }
        .next-steps { background: #d4edda; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #28a745; }
        code { background: #f1f1f1; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Add Whitelisted Users to gbseo</h1>
        
        <div class="instructions">
            <h3>📋 Instructions:</h3>
            <ol>
                <li>Open the admin dashboard at: <code>http://localhost:5433/admin</code></li>
                <li>Sign in with your admin account</li>
                <li>Go to the "User Whitelist" section</li>
                <li>Add each user from the list below using the "Add User" form</li>
                <li>The system will automatically send welcome emails</li>
            </ol>
        </div>

        <div class="warning">
            <strong>⚠️ Important:</strong> Make sure you're signed in as an admin (satish@skids.health) to access the admin panel.
        </div>

        <h3>👥 Users to Add (${WHITELISTED_EMAILS.length} total):</h3>
        <div class="user-list">
            ${WHITELISTED_EMAILS.map(email => `<div class="user-item">📧 ${email}</div>`).join('')}
        </div>

        <div class="next-steps">
            <h3>✅ After Adding All Users:</h3>
            <ul>
                <li>Users can sign in at: <code>https://gemseo.netlify.app</code></li>
                <li>They'll receive magic links via email</li>
                <li>Access is immediate once they click the magic link</li>
            </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:5433/admin" target="_blank" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                🚀 Open Admin Dashboard
            </a>
        </div>
    </div>
</body>
</html>
`;

// Write the HTML file
import { writeFileSync } from 'fs';
writeFileSync('add-whitelisted-users.html', htmlContent);

console.log('✅ Created add-whitelisted-users.html');
console.log('📋 Instructions:');
console.log('1. Open add-whitelisted-users.html in your browser');
console.log('2. Follow the instructions to add users via admin interface');
console.log('3. Or go directly to: http://localhost:5433/admin');
console.log(`4. Add these ${WHITELISTED_EMAILS.length} emails to the whitelist:`);
WHITELISTED_EMAILS.forEach(email => console.log(`   - ${email}`));