import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '../components/Header';
import { SEOForm } from '../components/SEOForm';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { generateGrowthPlan, generateTextSuggestion } from '../services/geminiService';
import type { SeoFormData, GeminiResults, User, Profile } from '../types';
import { AccountPage } from './AccountPage';
import { supabase } from '../lib/supabaseClient';

interface AppPageProps {
    user: User;
    profile: Profile | null;
}

const SESSION_API_KEY = 'gemini_api_key';

export const AppPage: React.FC<AppPageProps> = ({ user, profile: initialProfile }) => {
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [formData, setFormData] = useState<SeoFormData>(() => {
        try {
            const savedData = localStorage.getItem('seoFormData');
            const initialData = {
                businessName: '', pincode: '', businessDescription: '',
                targetAudience: '', campaignData: '', websiteUrl: '', brandVoice: '',
            };
            return savedData ? { ...initialData, ...JSON.parse(savedData) } : initialData;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return {
                businessName: '', pincode: '', businessDescription: '',
                targetAudience: '', campaignData: '', websiteUrl: '', brandVoice: '',
            };
        }
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState<boolean>(false);
    const [isGeneratingAudience, setIsGeneratingAudience] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<GeminiResults | null>(null);

    const fetchProfile = useCallback(async () => {
        if (user) {
            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (fetchError) console.error("Error fetching profile:", fetchError);
            else setProfile(data);
        }
    }, [user]);

    useEffect(() => {
        // This ensures the profile state is updated if the initialProfile prop changes
        setProfile(initialProfile);
    }, [initialProfile]);


    useEffect(() => {
        try {
            localStorage.setItem('seoFormData', JSON.stringify(formData));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [formData]);
    
    const handleSignOut = async () => {
        sessionStorage.removeItem(SESSION_API_KEY);
        await supabase.auth.signOut();
    };

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const getApiKey = (): string | null => {
        return sessionStorage.getItem(SESSION_API_KEY);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const apiKey = getApiKey();
        if (!apiKey) {
            setError('Your API key is missing. Please go to your account and re-enter it.');
            return;
        }

        if (!formData.businessName || !formData.pincode || !formData.businessDescription || !formData.targetAudience) {
            setError('Please fill out Business Name, Pincode/City, Description, and Target Audience.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await generateGrowthPlan(formData, apiKey);
            setResults(response);
        } catch (err) {
            console.error('API Call Failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to get a response. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateSuggestion = useCallback(async (
        promptGenerator: () => string,
        field: keyof SeoFormData,
        setGenerating: (isGenerating: boolean) => void,
        validation: () => boolean,
        errorMessage: string
    ) => {
        const apiKey = getApiKey();
        if (!apiKey) {
            setError('Your API key is missing. Please go to your account page and enter it.');
            return;
        }
        if (!validation()) {
            setError(errorMessage);
            return;
        }
        setGenerating(true);
        setError(null);
        const prompt = promptGenerator();
        try {
            const suggestion = await generateTextSuggestion(prompt, apiKey);
            setFormData(prev => ({ ...prev, [field]: suggestion }));
        } catch (err) {
            console.error('Suggestion generation failed:', err);
            setError('AI suggestion failed. Please try again.');
        } finally {
            setGenerating(false);
        }
    }, []);


    const handleGenerateDescription = () => handleGenerateSuggestion(
        () => `Act as a professional copywriter for the Indian market. Based on the business name "${formData.businessName}" and location "${formData.pincode}", write a compelling and SEO-friendly business description (around 50-70 words) suitable for a website's homepage. Mention the types of services or products this business likely offers.`,
        'businessDescription',
        setIsGeneratingDesc,
        () => !!formData.businessName && !!formData.pincode,
        "Please enter a Business Name and Pincode/City first."
    );

    const handleGenerateAudience = () => handleGenerateSuggestion(
        () => `Act as a market research analyst for India. Based on the business name "${formData.businessName}", location "${formData.pincode}", and this description: "${formData.businessDescription}", define a primary target audience. Be specific about demographics, needs, and location in a single concise sentence.`,
        'targetAudience',
        setIsGeneratingAudience,
        () => !!formData.businessName && !!formData.pincode && !!formData.businessDescription,
        "Please enter Business Name, Pincode/City, and a Description first."
    );
    
    const handleAccountClick = () => {
        // This is a simple trick to force a re-render of the AccountPage
        setProfile({ ...profile!, has_api_key: false });
    };

    if (!profile) {
        return (
             <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div>Loading profile...</div>
            </div>
        )
    }

    if (!profile.has_api_key) {
        return <AccountPage user={user} onKeySaved={fetchProfile} />;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
            <div className="flex justify-between items-center mb-4">
                 <p className="text-sm text-gray-400">Signed in as {user.email}</p>
                 <div>
                    <button onClick={handleAccountClick} className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold mr-4">
                        Account
                    </button>
                    <button onClick={handleSignOut} className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">
                        Sign Out
                    </button>
                 </div>
            </div>
            <Header />
            <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
                <SEOForm
                    formData={formData}
                    isGeneratingDesc={isGeneratingDesc}
                    isGeneratingAudience={isGeneratingAudience}
                    onFormChange={handleFormChange}
                    onSubmit={handleSubmit}
                    onGenerateDescription={handleGenerateDescription}
                    onGenerateAudience={handleGenerateAudience}
                    isLoading={isLoading}
                />
                
                {isLoading && <Loader />}
                
                {error && <ErrorMessage message={error} />}

                {results && !isLoading && <ResultsDisplay results={results} />}
            </main>
            <footer className="text-center mt-8 text-sm text-gray-500">
                <p>powered by greybrain.ai</p>
            </footer>
        </div>
    );
};