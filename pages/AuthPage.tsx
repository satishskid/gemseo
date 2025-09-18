import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AuthPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                // This URL will be the link that the user clicks on in the email.
                // It redirects back to the base URL where the app will handle the session.
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Check your email for the sign-in link!');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    gbseo
                </h1>
                <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
                    Sign in to generate your AI-powered SEO strategy.
                </p>
            </div>
            <div className="w-full max-w-sm bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
                 <p className="text-center text-gray-400 text-sm mb-6">
                    Enter your email to receive a magic link to sign in.
                </p>

                <form className="space-y-6" onSubmit={handleLogin}>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-900 text-white"
                            />
                        </div>
                    </div>
                    
                     {error && <div className="text-red-400 text-sm">{error}</div>}
                     {message && <div className="text-green-400 text-sm">{message}</div>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending link...' : 'Send Magic Link'}
                        </button>
                    </div>
                </form>
            </div>
             <footer className="text-center mt-8 text-sm text-gray-500">
                <p>powered by greybrain.ai</p>
            </footer>
        </div>
    );
};