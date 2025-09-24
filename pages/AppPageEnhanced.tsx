import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '../components/Header';
import { SEOForm } from '../components/SEOForm';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingState, FormSkeleton, ResultsSkeleton, useLoadingState } from '../components/LoadingStates';
import { generateGrowthPlan, generateTextSuggestion } from '../services/geminiService';
import { saveGrowthPlan, getCurrentGrowthPlan, clearCurrentGrowthPlan } from '../services/storageService';
import { secureRetrieveApiKey, validateApiKey, validateBusinessDescription } from '../utils/security';
import { FEATURE_FLAGS } from '../config/featureFlags';
import type { SeoFormData, GeminiResults, User, Profile } from '../types';
import { AccountPage } from './AccountPage';
import { supabase } from '../lib/supabaseClient';

interface AppPageEnhancedProps {
    user: User;
    profile: Profile | null;
}

const SESSION_API_KEY = 'gemini_api_key';

/**
 * Enhanced AppPage with architectural improvements
 * All new features are behind feature flags for safe rollout
 */
export const AppPageEnhanced: React.FC<AppPageEnhancedProps> = ({ user, profile: initialProfile }) => {
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [formData, setFormData] = useState<SeoFormData>(() => {
        try {
            const savedData = localStorage.getItem('seoFormData');
            const initialData = {
                businessName: '', pincode: '', businessDescription: '',
                targetAudience: '', campaignData: '', websiteUrl: '', brandVoice: '', socialMediaHandles: '',
            };
            return savedData ? { ...initialData, ...JSON.parse(savedData) } : initialData;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return {
                businessName: '', pincode: '', businessDescription: '',
                targetAudience: '', campaignData: '', websiteUrl: '', brandVoice: '', socialMediaHandles: '',
            };
        }
    });

    // Enhanced loading state management
    const {
        isLoading,
        error,
        progress,
        startLoading,
        stopLoading,
        setLoadingError,
        updateProgress,
        reset: resetLoadingState,
    } = useLoadingState();

    const [isGeneratingDesc, setIsGeneratingDesc] = useState<boolean>(false);
    const [isGeneratingAudience, setIsGeneratingAudience] = useState<boolean>(false);
    const [results, setResults] = useState<GeminiResults | null>(null);

    // Data recovery on component mount
    useEffect(() => {
        const recoverData = () => {
            try {
                const savedPlan = getCurrentGrowthPlan();
                if (savedPlan) {
                    setResults(savedPlan.results);
                    // Optionally restore form data too
                    if (savedPlan.formData) {
                        setFormData(prev => ({ ...prev, ...savedPlan.formData }));
                    }
                    console.log('Growth plan recovered from storage');
                }
            } catch (error) {
                console.error('Failed to recover growth plan:', error);
            }
        };
        
        recoverData();
    }, []);

    const fetchProfile = useCallback(async () => {
        if (user) {
            try {
                const { data, error: fetchError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                    
                if (fetchError) {
                    console.error("Error fetching profile:", fetchError);
                    setLoadingError('Failed to fetch profile data');
                } else {
                    setProfile(data);
                }
            } catch (error) {
                console.error('Profile fetch failed:', error);
                setLoadingError('Network error while fetching profile');
            }
        }
    }, [user, setLoadingError]);

    useEffect(() => {
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
        
        // Enhanced input validation when feature is enabled
        if (FEATURE_FLAGS.INPUT_VALIDATION) {
            if (name === 'businessDescription') {
                const validation = validateBusinessDescription(value);
                if (!validation.isValid) {
                    console.warn('Business description validation failed:', validation.error);
                    // Still allow the input but log the warning
                }
            }
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const getApiKey = (): string | null => {
        // Use secure retrieval when feature is enabled
        if (FEATURE_FLAGS.SECURE_API_STORAGE) {
            return secureRetrieveApiKey();
        }
        // Fallback to session storage for backward compatibility
        return sessionStorage.getItem(SESSION_API_KEY);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const apiKey = getApiKey();
        if (!apiKey) {
            setLoadingError('Your API key is missing. Please go to your account and re-enter it.');
            return;
        }

        // Enhanced API key validation
        if (FEATURE_FLAGS.INPUT_VALIDATION) {
            const apiValidation = validateApiKey(apiKey);
            if (!apiValidation.isValid) {
                setLoadingError(apiValidation.error || 'Invalid API key format');
                return;
            }
        }

        if (!formData.businessName || !formData.pincode || !formData.businessDescription || !formData.targetAudience) {
            setLoadingError('Please fill out Business Name, Pincode/City, Description, and Target Audience.');
            return;
        }
        
        startLoading('Generating your growth plan...');
        setResults(null);

        try {
            // Simulate progress for better UX
            let progressInterval: NodeJS.Timeout;
            if (FEATURE_FLAGS.LOADING_STATES) {
                progressInterval = setInterval(() => {
                    updateProgress(prev => Math.min(prev + 10, 90));
                }, 500);
            }

            const response = await generateGrowthPlan(formData, apiKey);
            
            if (progressInterval) clearInterval(progressInterval);
            updateProgress(100);
            
            setResults(response);
            stopLoading();
            
            // Save results to persistent storage
            try {
                const planId = saveGrowthPlan(response, formData);
                console.log('Growth plan saved with ID:', planId);
            } catch (storageError) {
                console.error('Failed to save growth plan:', storageError);
                // Non-critical error, continue with results
            }
        } catch (err) {
            console.error('API Call Failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setLoadingError(`Failed to get a response. ${errorMessage}`);
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
            setLoadingError('Your API key is missing. Please go to your account page and enter it.');
            return;
        }
        if (!validation()) {
            setLoadingError(errorMessage);
            return;
        }
        
        setGenerating(true);
        resetLoadingState();
        
        const prompt = promptGenerator();
        try {
            const suggestion = await generateTextSuggestion(prompt, apiKey);
            setFormData(prev => ({ ...prev, [field]: suggestion }));
        } catch (err) {
            console.error('Suggestion generation failed:', err);
            setLoadingError('AI suggestion failed. Please try again.');
        } finally {
            setGenerating(false);
        }
    }, [getApiKey, setLoadingError, resetLoadingState]);

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

    // Enhanced loading states
    if (!profile) {
        return (
            <LoadingState
                isLoading={true}
                loadingText="Loading profile..."
                fallback={<FormSkeleton />}
            />
        );
    }

    if (!profile.has_api_key) {
        return <AccountPage user={user} onKeySaved={fetchProfile} />;
    }

    return (
        <ErrorBoundary
            fallback={
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-bold mb-4">Application Error</h2>
                        <p className="text-gray-300">Please refresh the page to continue.</p>
                    </div>
                </div>
            }
        >
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
                    <LoadingState
                        isLoading={isLoading}
                        error={error}
                        loadingText={loadingText}
                        fallback={<FormSkeleton />}
                    >
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
                    </LoadingState>
                    
                    {FEATURE_FLAGS.LOADING_STATES && isLoading && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-400 mt-2 text-center">
                                {loadingText} ({progress}%)
                            </p>
                        </div>
                    )}

                    {results && !isLoading && (
                        <LoadingState
                            isLoading={false}
                            error={error}
                            fallback={<ResultsSkeleton />}
                        >
                            <ResultsDisplay results={results} formData={formData} />
                        </LoadingState>
                    )}
                </main>
                <footer className="text-center mt-8 text-sm text-gray-500">
                    <p>powered by greybrain.ai</p>
                    {FEATURE_FLAGS.DEBUG_MODE && (
                        <p className="text-xs text-gray-600 mt-1">
                            Features: {Object.entries(FEATURE_FLAGS)
                                .filter(([, enabled]) => enabled)
                                .map(([key]) => key)
                                .join(', ')}
                        </p>
                    )}
                </footer>
            </div>
        </ErrorBoundary>
    );
};

// Export both enhanced and original for gradual migration
export default AppPageEnhanced;