// Script to add admin user to Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkgxhcactrytfkrbsket.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3hoY2FjdHJ5dGZrcmJza2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzMyOTEsImV4cCI6MjA3Mzc0OTI5MX0.dVz8mIDe39s3lsz1W2t23lL5MIbBzMjTsQ526diuO40';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addAdminUser() {
    const adminEmail = 'satish@skids.health';
    
    try {
        // First, check if user exists in auth.users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
            console.error('Error fetching users:', authError);
            return;
        }
        
        const existingUser = authUsers.users.find(user => user.email === adminEmail);
        
        if (!existingUser) {
            console.log(`User ${adminEmail} not found in auth. They need to sign up first.`);
            return;
        }
        
        console.log(`Found user: ${existingUser.id}`);
        
        // Update or insert profile with admin role
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: existingUser.id,
                email: adminEmail,
                role: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id'
            });
        
        if (error) {
            console.error('Error updating profile:', error);
        } else {
            console.log(`Successfully set ${adminEmail} as admin!`);
            console.log('Profile data:', data);
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

addAdminUser();