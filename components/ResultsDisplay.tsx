import React, { useState } from 'react';
import type { GeminiResults, Keyword, Post, CampaignAnalysis, TechnicalSeoAudit, GbpRecommendations, QualityChecklistItem, SocialMediaPost } from '../types';
import { CampaignCalendar } from './CampaignCalendar';

type Tab = 'keywords' | 'techSeo' | 'gbp' | 'landingPages' | 'pillar' | 'blogs' | 'socialMedia' | 'calendar' | 'quality' | 'analysis';

const TABS: { id: Tab; label: string }[] = [
    { id: 'keywords', label: 'Keywords' },
    { id: 'techSeo', label: 'Tech SEO Audit' },
    { id: 'gbp', label: 'Google Business Profile' },
    { id: 'landingPages', label: 'Landing Pages' },
    { id: 'pillar', label: 'Pillar Content' },
    { id: 'blogs', label: 'Blog Posts' },
    { id: 'socialMedia', label: 'Social Media Posts' },
    { id: 'calendar', label: 'Campaign Calendar' },
    { id: 'quality', label: 'Quality Checklist' },
    { id: 'analysis', label: 'Campaign Analysis' },
];

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copyText, setCopyText] = useState('Copy Code');
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy Code'), 2000);
        }).catch(err => {
            console.error('Failed to copy code: ', err);
        });
    };
    return (
        <div className="relative bg-gray-900 p-4 rounded-md border border-gray-700 mt-2">
            <button onClick={copyToClipboard} className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium py-1 px-2 rounded-md transition">
                {copyText}
            </button>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto"><code>{code}</code></pre>
        </div>
    );
};

const ProseContent: React.FC<{ title: string; content: string; header: string; isCollapsible?: boolean; }> = ({ title, content, header, isCollapsible = false }) => {
    const [copyText, setCopyText] = useState('Copy HTML');

    const copyToClipboard = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        navigator.clipboard.writeText(tempDiv.innerHTML).then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy HTML'), 2000);
        }).catch(err => {
            console.error('Failed to copy HTML: ', err);
        });
    };

    const contentBlock = (
        <div className="relative">
            <div className="prose-custom max-w-none mt-4" dangerouslySetInnerHTML={{ __html: content }} />
            <button onClick={copyToClipboard} className="absolute top-0 -right-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium py-1 px-3 rounded-md transition">
                {copyText}
            </button>
        </div>
    );

    if (isCollapsible) {
        return (
            <details className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <summary className="font-semibold text-lg text-white cursor-pointer hover:text-indigo-400 transition">{title}</summary>
                {contentBlock}
            </details>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">{header}</h2>
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">{title}</h3>
            {contentBlock}
        </div>
    );
};

const KeywordsTab: React.FC<{ keywords: Keyword[] }> = ({ keywords }) => (
    <div>
        <h2 className="text-2xl font-bold text-white mb-4">Hyper-Local Keywords</h2>
        <p className="text-gray-400 mb-6">A list of 25-50 keywords targeting high-intent searches in your specific area.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keywords.map((kw, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition">
                    <h3 className="font-semibold text-indigo-400">{kw.keyword}</h3>
                    <p className="text-sm text-gray-400 mt-1"><span className="font-medium text-gray-300">Intent:</span> {kw.intent}</p>
                    <p className="text-sm text-gray-400 mt-2">{kw.explanation}</p>
                </div>
            ))}
        </div>
    </div>
);

const TechnicalSeoTab: React.FC<{ audit: TechnicalSeoAudit }> = ({ audit }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white">Technical SEO Audit</h2>
            <div className="mt-4 bg-gray-800 p-6 rounded-lg border border-gray-700 prose-custom max-w-none">
                <h4 className="!text-white !font-semibold">Audit Summary</h4>
                <p>{audit.auditSummary}</p>
            </div>
        </div>
        <div className="space-y-6">
            <details className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <summary className="font-semibold text-lg text-white cursor-pointer hover:text-indigo-400 transition">Robots.txt</summary>
                <p className="prose-custom max-w-none mt-4">{audit.robotsTxt.recommendation}</p>
                <CodeBlock code={audit.robotsTxt.code} />
            </details>
             <details className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <summary className="font-semibold text-lg text-white cursor-pointer hover:text-indigo-400 transition">Schema Markup (JSON-LD)</summary>
                <p className="prose-custom max-w-none mt-4">{audit.schemaMarkup.recommendation}</p>
                <CodeBlock code={audit.schemaMarkup.code} />
            </details>
             <details className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <summary className="font-semibold text-lg text-white cursor-pointer hover:text-indigo-400 transition">Performance Fixes</summary>
                <p className="prose-custom max-w-none mt-4">{audit.performanceFixes.recommendation}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                    {audit.performanceFixes.checklist.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </details>
             <details className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <summary className="font-semibold text-lg text-white cursor-pointer hover:text-indigo-400 transition">On-Page Fixes</summary>
                 <p className="prose-custom max-w-none mt-4">{audit.onPageFixes.recommendation}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                    {audit.onPageFixes.checklist.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </details>
            <details className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <summary className="font-semibold text-lg text-white cursor-pointer hover:text-indigo-400 transition">LLM Visibility (LLM.txt)</summary>
                <p className="prose-custom max-w-none mt-4">{audit.llmVisibility.recommendation}</p>
                <CodeBlock code={audit.llmVisibility.code} />
            </details>
        </div>
    </div>
);

const GbpTab: React.FC<{ gbp: GbpRecommendations }> = ({ gbp }) => (
     <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white">Google Business Profile Strategy</h2>
            <p className="text-gray-400 mt-2 mb-6">A plan to optimize your GBP for maximum local visibility.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Profile Setup & Optimization</h3>
            <p className="prose-custom max-w-none mb-4">{gbp.profileSetup.recommendation}</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
                 {gbp.profileSetup.actionableSteps.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
        <div>
            <h3 className="text-xl font-bold text-white mb-4">GBP Post Suggestions</h3>
            <div className="space-y-6">
                {gbp.postSuggestions.map((post, index) => (
                    <details key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <summary className="font-semibold text-lg text-white cursor-pointer hover:text-indigo-400 transition">{post.title}</summary>
                        <div className="prose-custom max-w-none mt-4" dangerouslySetInnerHTML={{ __html: post.content}} />
                    </details>
                ))}
            </div>
        </div>
         <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Review Acquisition Strategy</h3>
            <p className="prose-custom max-w-none">{gbp.reviewStrategy}</p>
        </div>
    </div>
);

const QualityChecklistTab: React.FC<{ items: QualityChecklistItem[] }> = ({ items }) => (
    <div>
        <h2 className="text-2xl font-bold text-white mb-4">Human Quality Control Checklist</h2>
        <p className="text-gray-400 mb-6">Use this checklist to review and refine all AI-generated content before publishing.</p>
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <label className="flex items-center">
                        <input type="checkbox" className="h-5 w-5 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500" />
                        <span className="ml-3 text-white font-medium">{item.task}</span>
                    </label>
                    <p className="ml-8 mt-1 text-sm text-gray-400">{item.description}</p>
                </div>
            ))}
        </div>
    </div>
);

const SocialMediaTab: React.FC<{ posts: SocialMediaPost[] }> = ({ posts }) => {
    const [copyTexts, setCopyTexts] = useState<{ [key: number]: string }>({});

    const copyToClipboard = (content: string, index: number) => {
        navigator.clipboard.writeText(content).then(() => {
            setCopyTexts(prev => ({ ...prev, [index]: 'Copied!' }));
            setTimeout(() => {
                setCopyTexts(prev => ({ ...prev, [index]: 'Copy Post' }));
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return '📘';
            case 'instagram': return '📷';
            case 'twitter': return '🐦';
            case 'linkedin': return '💼';
            case 'tiktok': return '🎵';
            default: return '📱';
        }
    };

    const getPlatformColor = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return 'border-blue-500';
            case 'instagram': return 'border-pink-500';
            case 'twitter': return 'border-sky-500';
            case 'linkedin': return 'border-blue-600';
            case 'tiktok': return 'border-purple-500';
            default: return 'border-gray-500';
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Social Media Posts</h2>
            <p className="text-gray-400 mb-6">Ready-to-use social media content for different platforms. Copy and customize as needed.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post, index) => (
                    <div key={index} className={`bg-gray-800 p-6 rounded-lg border-2 ${getPlatformColor(post.platform)} hover:border-opacity-80 transition`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                                <h3 className="font-semibold text-lg text-white">{post.platform}</h3>
                            </div>
                            <button
                                onClick={() => copyToClipboard(`${post.title}\n\n${post.content}\n\n${post.hashtags.join(' ')}\n\n${post.callToAction}`, index)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-2 px-3 rounded-md transition"
                            >
                                {copyTexts[index] || 'Copy Post'}
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-indigo-400 mb-1">Title:</h4>
                                <p className="text-gray-300 text-sm">{post.title}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-indigo-400 mb-1">Content:</h4>
                                <p className="text-gray-300 text-sm whitespace-pre-wrap">{post.content}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-indigo-400 mb-1">Hashtags:</h4>
                                <p className="text-blue-400 text-sm">{post.hashtags.join(' ')}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-indigo-400 mb-1">Call to Action:</h4>
                                <p className="text-gray-300 text-sm font-medium">{post.callToAction}</p>
                            </div>
                            
                            {post.imagePrompt && (
                                <div>
                                    <h4 className="font-medium text-indigo-400 mb-1">Image Suggestion:</h4>
                                    <p className="text-gray-400 text-xs italic">{post.imagePrompt}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AnalysisTab: React.FC<{ analysis: CampaignAnalysis }> = ({ analysis }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white">Campaign Performance Analysis</h2>
            <div className="mt-4 bg-gray-800 p-6 rounded-lg border border-gray-700 prose-custom max-w-none">
                <h4 className="!text-white !font-semibold">Executive Summary</h4>
                <p>{analysis.summary}</p>
            </div>
        </div>
        <div>
            <h3 className="text-xl font-bold text-white mb-4">Key Observations</h3>
            <div className="space-y-4">
                {analysis.keyObservations.map((obs, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-indigo-400">{obs.metric}</h4>
                        <p className="text-sm text-gray-300 mt-1">{obs.finding}</p>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-xl font-bold text-white mb-4">Actionable Recommendations</h3>
             <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-indigo-400">{rec.recommendation}</h4>
                        <p className="text-sm text-gray-300 mt-1"><span className="font-medium">Expected Impact:</span> {rec.impact}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const ResultsDisplay: React.FC<{ results: GeminiResults }> = ({ results }) => {
    const [activeTab, setActiveTab] = useState<Tab>('keywords');

    return (
        <div className="mt-8 fade-in">
            <style>{`
                .prose-custom h1, .prose-custom h2, .prose-custom h3, .prose-custom h4 { color: #f9fafb; }
                .prose-custom p, .prose-custom ul, .prose-custom li, .prose-custom strong { color: #d1d5db; }
                .prose-custom ul { list-style-type: disc; padding-left: 1.5rem; }
                .tab-active { border-color: #4f46e5; color: #eef2ff; }
                .tab-inactive { border-color: transparent; color: #9ca3af; }
                .fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {TABS.map(tab => {
                        if (tab.id === 'analysis' && !results.campaignAnalysis) return null;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'tab-active' : 'tab-inactive hover:text-gray-200'}`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="py-6">
                {activeTab === 'keywords' && <KeywordsTab keywords={results.keywords} />}
                {activeTab === 'techSeo' && <TechnicalSeoTab audit={results.technicalSeoAudit} />}
                {activeTab === 'gbp' && <GbpTab gbp={results.gbpRecommendations} />}
                {activeTab === 'landingPages' && (
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Conversion-Focused Landing Pages</h2>
                        <p className="text-gray-400 mb-6">Dedicated pages for high-intent keywords, designed to convert visitors.</p>
                        <div className="space-y-6">
                            {results.landingPages.map((post, index) => (
                                <ProseContent key={index} header={`Landing Page ${index + 1}`} title={post.title} content={post.content} isCollapsible />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'pillar' && <ProseContent header="Pillar Content" title={results.pillarPost.title} content={results.pillarPost.content} />}
                {activeTab === 'blogs' && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Supporting Blog Posts</h2>
                        <p className="text-gray-400 mb-6">Build topical authority and link back to your pillar content and service pages.</p>
                        <div className="space-y-6">
                            {results.blogPosts.map((post, index) => (
                                <ProseContent key={index} header={`Blog Post ${index + 1}`} title={post.title} content={post.content} isCollapsible />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'socialMedia' && <SocialMediaTab posts={results.socialMediaPosts} />}
                {activeTab === 'calendar' && <CampaignCalendar initialItems={results.publishingCalendar} />}
                {activeTab === 'quality' && <QualityChecklistTab items={results.qualityChecklist} />}
                {activeTab === 'analysis' && results.campaignAnalysis && <AnalysisTab analysis={results.campaignAnalysis} />}
            </div>
        </div>
    );
};