import React from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '../types';

interface AdminPageProps {
    user: User;
}

export const AdminPage: React.FC<AdminPageProps> = ({ user }) => {

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="container mx-auto max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-gray-400">Welcome, {user.email}</p>
                    </div>
                     <button onClick={handleSignOut} className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">
                        Sign Out
                    </button>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-indigo-400">Admin Functionality</h2>
                    <p className="mt-2 text-gray-300">
                        This is the placeholder for the admin interface. Future features will include:
                    </p>
                    <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                        <li>User Management (View all users, manage roles and subscriptions)</li>
                        <li>Application Analytics (Track report generation, popular features)</li>
                        <li>Content Management (Update landing page copy, pricing)</li>
                        <li>Coupon and Promotion Management</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};