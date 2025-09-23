import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User, Profile } from '../types';
import { AppPage } from './AppPage';
import UserWhitelist from '../components/admin/UserWhitelist';
import LicenseManager from '../components/admin/LicenseManager';

interface AdminPageProps {
    user: User;
    profile: Profile | null;
}

export const AdminPage: React.FC<AdminPageProps> = ({ user, profile }) => {
    const [activeTab, setActiveTab] = useState('dashboard');

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
                    <div className="flex items-center">
                        <div className="mr-6">
                            <button onClick={() => setActiveTab('dashboard')} className={`pb-2 text-sm font-semibold ${activeTab === 'dashboard' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-indigo-300'}`}>
                                Dashboard
                            </button>
                            <button onClick={() => setActiveTab('user-management')} className={`ml-4 pb-2 text-sm font-semibold ${activeTab === 'user-management' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-indigo-300'}`}>
                                User Management
                            </button>
                            <button onClick={() => setActiveTab('license-management')} className={`ml-4 pb-2 text-sm font-semibold ${activeTab === 'license-management' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-indigo-300'}`}>
                                License Management
                            </button>
                            <button onClick={() => setActiveTab('seo')} className={`ml-4 pb-2 text-sm font-semibold ${activeTab === 'seo' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-indigo-300'}`}>
                                SEO Application
                            </button>
                        </div>
                        <button onClick={handleSignOut} className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">
                            Sign Out
                        </button>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
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
                )}

                {activeTab === 'user-management' && (
                    <UserWhitelist />
                )}

                {activeTab === 'license-management' && (
                    <LicenseManager />
                )}

                {activeTab === 'seo' && <AppPage user={user} profile={profile} />}
            </div>
        </div>
    );
};