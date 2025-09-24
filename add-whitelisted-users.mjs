import { createClient } from '@supabase/supabase-js';
import { WHITELISTED_EMAILS } from './config/whitelistedEmails.ts';

// Initialize Supabase client with hardcoded credentials from supabaseClient.ts
const supabaseUrl = 'https://xkgxhcactrytfkrbsket.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3hoY2FjdHJ5dGZrcmJza2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzMyOTEsImV4cCI6MjA3Mzc0OTI5MX0.dVz8mIDe39s3lsz1W2t23lL5MIbBzMjTsQ526diuO40';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addWhitelistedUsers() {
    console.log('Adding whitelisted users to Supabase...');
    console.log('Users to add:', WHITELISTED_EMAILS);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const email of WHITELISTED_EMAILS) {
        try {
            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('whitelisted_users')
                .select('id')
                .eq('email', email)
                .single();
            
            if (existingUser) {
                console.log(`⏭️  Skipping ${email} - already whitelisted`);
                skippedCount++;
                continue;
            }
            
            // Add user to whitelist
            const { data, error } = await supabase
                .from('whitelisted_users')
                .insert([
                    { 
                        email: email,
                        created_at: new Date().toISOString()
                    }
                ]);
            
            if (error) {
                console.error(`❌ Error adding ${email}:`, error.message);
            } else {
                console.log(`✅ Added ${email} to whitelist`);
                addedCount++;
            }
            
        } catch (error) {
            console.error(`❌ Exception adding ${email}:`, error.message);
        }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Added: ${addedCount} users`);
    console.log(`⏭️  Skipped: ${skippedCount} users (already existed)`);
    console.log(`📧 Total whitelisted: ${addedCount + skippedCount} users`);
}

// Run the script
addWhitelistedUsers().catch(console.error);