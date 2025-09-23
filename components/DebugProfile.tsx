import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types';

interface DebugProfileProps {
    userId: string;
}

export const DebugProfile: React.FC<DebugProfileProps> = ({ userId }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    setError(`Error fetching profile: ${error.message}`);
                } else {
                    setProfile(data);
                }
            } catch (err) {
                setError(`Unexpected error: ${err}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const updateToAdmin = async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    role: 'admin',
                    updated_at: new Date().toISOString()
                });

            if (error) {
                setError(`Error updating profile: ${error.message}`);
            } else {
                setProfile(prev => prev ? { ...prev, role: 'admin' } : null);
                alert('Profile updated to admin! Please refresh the page.');
            }
        } catch (err) {
            setError(`Unexpected error: ${err}`);
        }
    };

    const setSatishAsAdmin = async () => {
        try {
            // Get current user info
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user?.email === 'satish@skids.health') {
                await updateToAdmin();
            } else {
                alert('This function only works for satish@skids.health');
            }
        } catch (err) {
            setError(`Error: ${err}`);
        }
    };

    if (loading) return <div className="text-white">Loading profile...</div>;

    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-white font-bold mb-2">Debug Profile Information</h3>
            {error && <p className="text-red-400 mb-2">{error}</p>}
            {profile ? (
                <div className="text-white">
                    <p><strong>User ID:</strong> {userId}</p>
                    <p><strong>Role:</strong> {profile.role || 'No role set'}</p>
                    <p><strong>Created:</strong> {profile.created_at}</p>
                    <p><strong>Updated:</strong> {profile.updated_at}</p>
                    {profile.role !== 'admin' && (
                        <div className="mt-2 space-x-2">
                            <button 
                                onClick={updateToAdmin}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                            >
                                Set as Admin
                            </button>
                            <button 
                                onClick={setSatishAsAdmin}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Set Satish as Admin
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-white">
                    <p>No profile found for user: {userId}</p>
                    <div className="mt-2 space-x-2">
                        <button 
                            onClick={updateToAdmin}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                        >
                            Create Admin Profile
                        </button>
                        <button 
                            onClick={setSatishAsAdmin}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Set Satish as Admin
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};