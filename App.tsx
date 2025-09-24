import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { AppPage } from './pages/AppPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import type { Profile } from './types';
import { ConfigurationMessage } from './components/ConfigurationMessage';

const App: React.FC = () => {
    // If Supabase is not configured, show a helpful message and stop.
    if (!supabase) {
        return <ConfigurationMessage />;
    }

    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                setSession(session);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (session?.user) {
                // Check if user is whitelisted
                const { data: whitelistData, error: whitelistError } = await supabase
                    .from('whitelisted_users')
                    .select('id')
                    .eq('email', session.user.email)
                    .single();

                if (whitelistError || !whitelistData) {
                    console.log('User not whitelisted:', session.user.email);
                    setIsWhitelisted(false);
                    setProfile(null);
                    return;
                }

                setIsWhitelisted(true);

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                } else if (data) {
                    setProfile(data);
                }
            } else {
                setProfile(null);
                setIsWhitelisted(false);
            }
        };

        fetchProfile();
    }, [session]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div>Loading...</div>
            </div>
        );
    }
    
    if (!session) {
        return <AuthPage />;
    }

    // Check if user is whitelisted (except for admin)
    if (session.user.email !== 'satish@skids.health' && !isWhitelisted) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                        gbseo
                    </h1>
                    <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
                        Access Denied
                    </p>
                </div>
                <div className="w-full max-w-sm bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <div className="text-center">
                        <div className="text-red-400 text-xl mb-4">🚫</div>
                        <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
                        <p className="text-gray-400 text-sm mb-4">
                            Your email address is not whitelisted. Please contact the administrator to request access.
                        </p>
                        <button 
                            onClick={async () => await supabase.auth.signOut()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Force admin access for satish@skids.health
    if (session.user.email === 'satish@skids.health' || profile?.role === 'admin') {
        return <AdminPage user={session.user} profile={profile} />;
    }

    return <AppPage user={session.user} profile={profile} />;
};

export default App;