import React from 'react';

export const ConfigurationMessage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4 text-gray-200">
            <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-yellow-500">
                <div className="text-center">
                     <svg className="w-16 h-16 mx-auto text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <h1 className="mt-4 text-3xl font-bold text-white tracking-tight">
                        Configuration Required
                    </h1>
                    <p className="mt-3 text-lg text-gray-400">
                        Your application is not connected to Supabase yet.
                    </p>
                </div>
                <div className="mt-8 text-left bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-lg font-semibold text-indigo-400">Please follow these steps:</h2>
                    <ol className="mt-4 space-y-4 list-decimal list-inside text-gray-300">
                        <li>
                            <p>
                                In your code editor, open the file: <br />
                                <code className="text-sm bg-gray-700 text-yellow-300 rounded px-2 py-1 mt-1 inline-block">lib/supabaseClient.ts</code>
                            </p>
                        </li>
                         <li>
                            <p>
                                In your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Supabase project dashboard</a>, navigate to <br />
                                <span className="font-semibold text-gray-200">Settings</span> &gt; <span className="font-semibold text-gray-200">API</span>.
                            </p>
                        </li>
                        <li>
                            <p>
                                Copy your <span className="font-semibold text-gray-200">Project URL</span> and <span className="font-semibold text-gray-200">anon public</span> key.
                            </p>
                        </li>
                        <li>
                            <p>
                                Paste them into `lib/supabaseClient.ts`, replacing the placeholder values `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY`.
                            </p>
                        </li>
                         <li>
                            <p>
                                Save the file. The application should automatically reload.
                            </p>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
};