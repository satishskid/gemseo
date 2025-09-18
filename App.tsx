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

    if (profile?.role === 'admin') {
        return <AdminPage user={session.user} profile={profile} />;
    }

    return <AppPage user={session.user} profile={profile} />;
};

export default App;