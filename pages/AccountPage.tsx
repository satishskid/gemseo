import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { testApiKey } from '../services/geminiService';
import type { User } from '../types';

interface AccountPageProps {
    user: User;
    onKeySaved: () => void;
}

const SESSION_API_KEY = 'gemini_api_key';

export const AccountPage: React.FC<AccountPageProps> = ({ user, onKeySaved }) => {
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTestKey = async () => {
        if (!apiKey) {
            setTestResult({ success: false, message: 'Please enter an API key to test.' });
            return;
        }
        setLoading(true);
        setTestResult(null);
        setError(null);
        const result = await testApiKey(apiKey);
        setTestResult(result);
        setLoading(false);
    };

    const handleSaveKey = async () => {
        if (!apiKey) {
            setError('Please enter an API key to save.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // First, test the key to ensure it's valid before saving
            const testResponse = await testApiKey(apiKey);
            if (!testResponse.success) {
                setTestResult(testResponse);
                setError("Cannot save an invalid API key. Please test it successfully first.");
                setLoading(false);
                return;
            }

            // Save the key to session storage for use during this session
            sessionStorage.setItem(SESSION_API_KEY, apiKey);

            // Update the user's profile to indicate a key has been provided
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ has_api_key: true })
                .eq('id', user.id);
            
            if (updateError) {
                 throw updateError;
            }

            onKeySaved(); // Notify parent component to refetch profile and proceed
        } catch (err) {
            setError(err instanceof Error ? `Failed to save: ${err.message}` : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSignOut = async () => {
        sessionStorage.removeItem(SESSION_API_KEY);
        await supabase.auth.signOut();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
             <div className="w-full max-w-2xl">
                 <div className="text-right mb-4">
                    <p className="text-sm text-gray-400 float-left mt-2">Signed in as {user.email}</p>
                    <button onClick={handleSignOut} className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">
                        Sign Out
                    </button>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                    <p className="mt-2 text-gray-400">
                        To get started, please provide your Google Gemini API key. This key is stored securely in your browser's session and is required to generate your SEO growth plan.
                    </p>
                    
                    <div className="mt-6">
                        <label htmlFor="api-key" className="block text-sm font-medium text-gray-300">Your Google AI API Key</label>
                        <input
                            type="password"
                            id="api-key"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                setTestResult(null); // Reset test result on key change
                            }}
                            className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your API key here"
                        />
                         <p className="mt-2 text-xs text-gray-400">
                            You can get an API key from {' '}
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                Google AI Studio
                            </a>.
                        </p>
                    </div>

                    {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
                    
                    {testResult && (
                         <div className={`mt-4 text-sm p-3 rounded-md ${testResult.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {testResult.message}
                        </div>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                         <button
                            onClick={handleTestKey}
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-indigo-400 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50"
                        >
                            {loading ? 'Testing...' : 'Test Key'}
                        </button>
                        <button
                            onClick={handleSaveKey}
                            disabled={loading || testResult?.success !== true}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save and Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};