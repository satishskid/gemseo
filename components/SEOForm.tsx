import React from 'react';
import type { SeoFormData } from '../types';
import { SparkleIcon, SpinnerIcon } from './icons/Icons';

interface SEOFormProps {
    formData: SeoFormData;
    isGeneratingDesc: boolean;
    isGeneratingAudience: boolean;
    isLoading: boolean;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onGenerateDescription: () => void;
    onGenerateAudience: () => void;
}

export const SEOForm: React.FC<SEOFormProps> = ({
    formData,
    isGeneratingDesc,
    isGeneratingAudience,
    isLoading,
    onFormChange,
    onSubmit,
    onGenerateDescription,
    onGenerateAudience,
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-300">Business Name</label>
                    <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={onFormChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., 'Arogya Multispeciality Clinic'" />
                </div>
                <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-300">Pincode / Target City</label>
                    <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={onFormChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., '560034' or 'Koramangala, Bengaluru'" />
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-300">Business Description</label>
                    <button type="button" onClick={onGenerateDescription} disabled={isGeneratingDesc} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isGeneratingDesc ? <SpinnerIcon /> : <SparkleIcon />}
                        <span>{isGeneratingDesc ? 'Generating...' : 'Auto-Generate'}</span>
                    </button>
                </div>
                <textarea id="businessDescription" name="businessDescription" value={formData.businessDescription} onChange={onFormChange} rows={4} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe your clinic, ed-tech platform, or D2C brand. Or, let our AI generate a description for you."></textarea>
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300">Target Audience</label>
                    <button type="button" onClick={onGenerateAudience} disabled={isGeneratingAudience} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isGeneratingAudience ? <SpinnerIcon /> : <SparkleIcon />}
                        <span>{isGeneratingAudience ? 'Generating...' : 'Auto-Generate'}</span>
                    </button>
                </div>
                <input type="text" id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={onFormChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., 'Families in South Bengaluru seeking pediatric care'" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300">Website URL (Optional)</label>
                    <input type="text" id="websiteUrl" name="websiteUrl" value={formData.websiteUrl} onChange={onFormChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://example.com or example.com" />
                    <p className="mt-1 text-xs text-gray-400">Enter your website URL in any format (with or without https://)</p>
                </div>
                <div>
                    <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-300">Brand Voice (Optional)</label>
                    <input type="text" id="brandVoice" name="brandVoice" value={formData.brandVoice} onChange={onFormChange} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., 'Professional, empathetic, and reassuring'" />
                </div>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="campaignData" className="block text-sm font-medium text-gray-300">Paste Campaign/Audit Data (Optional)</label>
                    <div className="group relative">
                        <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute bottom-6 left-0 w-80 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <p className="text-xs text-gray-300 mb-2"><strong>What to paste here:</strong></p>
                            <ul className="text-xs text-gray-400 space-y-1">
                                <li>• Campaign performance metrics (CTR, CPC, conversions)</li>
                                <li>• Google Analytics data (traffic, bounce rate, top pages)</li>
                                <li>• Page Speed Insights results</li>
                                <li>• Current SEO audit findings</li>
                                <li>• Competitor analysis data</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <textarea id="campaignData" name="campaignData" value={formData.campaignData} onChange={onFormChange} rows={5} className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Paste campaign metrics, analytics data, or SEO audit results here for personalized recommendations..."></textarea>
                <div className="mt-2 text-xs text-gray-400">
                    <p className="mb-1"><strong>Where to find this data:</strong></p>
                    <div className="flex flex-wrap gap-4">
                        <a href="https://ads.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Ads Dashboard</a>
                        <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Analytics</a>
                        <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">PageSpeed Insights</a>
                        <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Meta Business Suite</a>
                        <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Search Console</a>
                    </div>
                </div>
            </div>
            <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105 disabled:bg-indigo-800 disabled:cursor-not-allowed">
                    {isLoading ? 'Generating...' : 'Generate Growth Plan'}
                </button>
            </div>
        </form>
    );
};