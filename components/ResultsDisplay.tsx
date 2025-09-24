import React, { useState, useEffect } from 'react';
import type { GeminiResults, Keyword, Post, CampaignAnalysis, TechnicalSeoAudit, GbpRecommendations, QualityChecklistItem, SocialMediaPost } from '../types';
import { CampaignCalendar } from './CampaignCalendar';
import { saveGrowthPlan, getCurrentGrowthPlan } from '../services/storageService';
import { downloadAsJSON, downloadAsPDF, downloadCalendarAsCSV, generateFilename } from '../services/downloadService';
import { downloadCalendar, openInGoogleCalendar, getCalendarImportInstructions } from '../services/calendarService';
import MediaGenerationGuide from './MediaGenerationGuide';

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

const SocialMediaTab: React.FC<{ posts: SocialMediaPost[]; businessType?: string; targetAudience?: string }> = ({ posts, businessType, targetAudience }) => {
    const [copyTexts, setCopyTexts] = useState<{ [key: number]: string }>({});
    const [showMediaGuide, setShowMediaGuide] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState<string>('');
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [multimediaPrompts, setMultimediaPrompts] = useState<{ [key: number]: { image: string; video: string } }>({});
    const [copiedMultimedia, setCopiedMultimedia] = useState<{ [key: string]: boolean }>({});

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

    const handlePromptSelect = (prompt: string, platform: string) => {
        setSelectedPrompt(prompt);
        setSelectedPlatform(platform);
    };

    const generateMultimediaPrompt = (post: SocialMediaPost, index: number) => {
        const businessTypeClean = businessType || 'your business';
        const targetAudienceClean = targetAudience || 'your audience';
        
        const platformSpecificPrompts = {
            image: getPlatformSpecificImagePrompt(post, businessTypeClean, targetAudienceClean),
            video: getPlatformSpecificVideoPrompt(post, businessTypeClean, targetAudienceClean)
        };

        setMultimediaPrompts(prev => ({ ...prev, [index]: platformSpecificPrompts }));
    };

    const getPlatformSpecificImagePrompt = (post: SocialMediaPost, businessType: string, targetAudience: string): string => {
        const baseContent = `${post.title}. ${post.content}`.substring(0, 200);
        const hashtags = post.hashtags.slice(0, 3).join(' ');
        
        switch (post.platform.toLowerCase()) {
            case 'instagram':
                return `Instagram post image for ${businessType}: ${baseContent}. Style: vibrant, engaging, square format (1080x1080px). Include visual elements that appeal to ${targetAudience}. Colors: warm, inviting. Mood: positive, shareable. Text overlay: minimal, focus on visual storytelling. Hashtag themes: ${hashtags}. Call-to-action vibe: ${post.callToAction}. Instagram-worthy, high engagement potential.`;
            
            case 'facebook':
                return `Facebook post image for ${businessType}: ${baseContent}. Style: professional yet approachable, landscape format (1200x630px). Community-focused design that resonates with ${targetAudience}. Include subtle branding elements. Colors: trustworthy blues/earth tones. Text: clear, readable. Engagement-focused layout. Hashtag themes: ${hashtags}. Facebook algorithm friendly.`;
            
            case 'twitter':
                return `Twitter/X post image for ${businessType}: ${baseContent}. Style: bold, attention-grabbing, landscape format (1200x675px). Quick visual impact for scrolling users. Contrasting colors for visibility. Minimal text, maximum visual punch. Trending aesthetic. Viral potential for ${targetAudience}. Hashtag themes: ${hashtags}. Shareable, retweet-worthy design.`;
            
            case 'linkedin':
                return `LinkedIn professional image for ${businessType}: ${baseContent}. Style: corporate, sophisticated, landscape format (1200x627px). Professional setting that appeals to ${targetAudience}. Clean, modern design. Colors: professional blues/grays. Industry-relevant imagery. Thought leadership aesthetic. B2B focused. Hashtag themes: ${hashtags}. Business network appropriate.`;
            
            case 'tiktok':
                return `TikTok thumbnail/story image for ${businessType}: ${baseContent}. Style: trendy, dynamic, vertical format (1080x1920px). Youthful energy that connects with ${targetAudience}. Bold colors, eye-catching design. Social media native aesthetic. Viral potential. Hashtag themes: ${hashtags}. TikTok algorithm optimized. Trending visual style.`;
            
            default:
                return `Social media image for ${businessType}: ${baseContent}. Style: professional, engaging. Universal appeal for ${targetAudience}. Clear messaging with visual impact. Hashtag themes: ${hashtags}. ${post.callToAction}`;
        }
    };

    const getPlatformSpecificVideoPrompt = (post: SocialMediaPost, businessType: string, targetAudience: string): string => {
        const baseContent = `${post.title}. ${post.content}`.substring(0, 200);
        const hashtags = post.hashtags.slice(0, 3).join(' ');
        
        switch (post.platform.toLowerCase()) {
            case 'instagram':
                return `Instagram Reels/Story video for ${businessType}: ${baseContent}. Duration: 15-30 seconds. Format: vertical 9:16. Style: fast-paced, trendy transitions. Hook viewers in first 3 seconds. Visual elements appealing to ${targetAudience}. Include trending audio suggestion. Text overlays: minimal, impactful. Call-to-action: ${post.callToAction}. Hashtag integration: ${hashtags}. Instagram native feel, high save/share potential.`;
            
            case 'facebook':
                return `Facebook video for ${businessType}: ${baseContent}. Duration: 30-60 seconds. Format: landscape 16:9 or square 1:1. Style: informative, community-building. Professional production quality. Story-driven content for ${targetAudience}. Include captions for silent viewing. Call-to-action: ${post.callToAction}. Hashtag themes: ${hashtags}. Facebook algorithm optimized for engagement.`;
            
            case 'twitter':
                return `Twitter/X video for ${businessType}: ${baseContent}. Duration: 15-45 seconds. Format: landscape 16:9. Style: news-worthy, shareable. Quick, impactful messaging. Visual hooks for ${targetAudience}. Trending topic alignment. Text overlays: readable, concise. Call-to-action: ${post.callToAction}. Hashtag themes: ${hashtags}. Viral potential, retweet-worthy content.`;
            
            case 'linkedin':
                return `LinkedIn professional video for ${businessType}: ${baseContent}. Duration: 30-90 seconds. Format: landscape 16:9. Style: thought leadership, educational. Professional setting, industry insights. Target ${targetAudience} with valuable content. Include expert tips/advice. Call-to-action: ${post.callToAction}. Hashtag themes: ${hashtags}. B2B focused, professional network appropriate.`;
            
            case 'tiktok':
                return `TikTok video for ${businessType}: ${baseContent}. Duration: 15-60 seconds. Format: vertical 9:16. Style: native TikTok feel, trending sounds. Engaging hook for ${targetAudience} in first second. Quick cuts, dynamic transitions. Include popular effects/filters. Call-to-action: ${post.callToAction}. Hashtag themes: ${hashtags}. TikTok algorithm friendly, viral potential.`;
            
            default:
                return `Social media video for ${businessType}: ${baseContent}. Duration: 15-60 seconds. Professional quality, engaging content for ${targetAudience}. Call-to-action: ${post.callToAction}. Hashtag themes: ${hashtags}.`;
        }
    };

    const copyMultimediaPrompt = (prompt: string, type: string, index: number) => {
        navigator.clipboard.writeText(prompt).then(() => {
            const key = `${index}-${type}`;
            setCopiedMultimedia(prev => ({ ...prev, [key]: true }));
            setTimeout(() => {
                setCopiedMultimedia(prev => ({ ...prev, [key]: false }));
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy multimedia prompt: ', err);
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Social Media Posts</h2>
                    <p className="text-gray-400">Ready-to-post content for various platforms.</p>
                </div>
                <button
                    onClick={() => setShowMediaGuide(!showMediaGuide)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
                    </svg>
                    {showMediaGuide ? 'Hide Media Guide' : 'Generate Media'}
                </button>
            </div>

            {showMediaGuide && (
                <div className="mb-8">
                    <MediaGenerationGuide 
                        businessType={businessType}
                        targetAudience={targetAudience}
                        onPromptSelect={handlePromptSelect}
                    />
                    {selectedPrompt && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">Selected Prompt</h4>
                            <p className="text-sm text-green-800 mb-2">{selectedPrompt}</p>
                            <p className="text-xs text-green-600">Platform: {selectedPlatform}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-6">
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
                                {copyTexts[index] === 'Copied!' ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy Post
                                    </>
                                )}
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
                                
                                {/* Multimedia Generation Section */}
                                <div className="border-t border-gray-700 pt-4 mt-4">
                                    <button
                                        onClick={() => generateMultimediaPrompt(post, index)}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
                                    >
                                        🎨 Generate Multimedia Prompts for {post.platform}
                                    </button>
                                    
                                    {multimediaPrompts[index] && (
                                        <div className="mt-4 space-y-4">
                                            {/* Image Prompt */}
                                            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-500/50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-purple-300 flex items-center">
                                                        🖼️ Image Generation Prompt
                                                    </h4>
                                                    <button
                                                        onClick={() => copyMultimediaPrompt(multimediaPrompts[index].image, 'image', index)}
                                                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                                                    >
                                                        {copiedMultimedia[`${index}-image`] ? '✅ Copied!' : '📋 Copy'}
                                                    </button>
                                                </div>
                                                <p className="text-purple-200 text-sm leading-relaxed">
                                                    {multimediaPrompts[index].image}
                                                </p>
                                                <div className="mt-2 text-xs text-purple-400">
                                                    💡 <strong>Tip:</strong> Use this prompt in Leonardo, Midjourney, or DALL-E to generate platform-optimized images
                                                </div>
                                            </div>
                                            
                                            {/* Video Prompt */}
                                            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 p-4 rounded-lg border border-blue-500/50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-blue-300 flex items-center">
                                                        🎬 Video Generation Prompt
                                                    </h4>
                                                    <button
                                                        onClick={() => copyMultimediaPrompt(multimediaPrompts[index].video, 'video', index)}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                                    >
                                                        {copiedMultimedia[`${index}-video`] ? '✅ Copied!' : '📋 Copy'}
                                                    </button>
                                                </div>
                                                <p className="text-blue-200 text-sm leading-relaxed">
                                                    {multimediaPrompts[index].video}
                                                </p>
                                                <div className="mt-2 text-xs text-blue-400">
                                                    💡 <strong>Tip:</strong> Use this prompt in Runway, Pika, or Synthesia to create engaging video content
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
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

export const ResultsDisplay: React.FC<{ results: GeminiResults; formData?: any }> = ({ results, formData }) => {
    const [activeTab, setActiveTab] = useState<Tab>('keywords');
    const [showInstructions, setShowInstructions] = useState(false);

    // Save results to storage when component mounts
    useEffect(() => {
        try {
            if (results && formData) {
                saveGrowthPlan(results, formData);
            }
        } catch (error) {
            console.error('Failed to save results:', error);
        }
    }, [results, formData]);

    const handleDownloadJSON = () => {
        try {
            const filename = generateFilename(formData?.businessName || 'growth-plan', 'json');
            downloadAsJSON(results, filename);
        } catch (error) {
            console.error('Failed to download JSON:', error);
            alert('Failed to download JSON file. Please try again.');
        }
    };

    const handleDownloadPDF = () => {
        try {
            const currentPlan = getCurrentGrowthPlan();
            if (currentPlan) {
                downloadAsPDF(currentPlan);
            } else {
                alert('No saved plan found. Please ensure data is saved first.');
            }
        } catch (error) {
            console.error('Failed to download PDF:', error);
            alert('Failed to generate PDF file. Please try again.');
        }
    };

    const handleDownloadCalendarCSV = () => {
        try {
            downloadCalendarAsCSV(results);
        } catch (error) {
            console.error('Failed to download calendar CSV:', error);
            alert('Failed to download calendar CSV file. Please try again.');
        }
    };

    const handleExportCalendar = () => {
        try {
            const businessName = formData?.businessName || 'Growth Plan';
            downloadCalendar(results, businessName);
        } catch (error) {
            console.error('Failed to export calendar:', error);
            alert('Failed to export calendar. Please try again.');
        }
    };

    const handleOpenInGoogleCalendar = () => {
        try {
            const businessName = formData?.businessName || 'Growth Plan';
            openInGoogleCalendar(results, businessName);
        } catch (error) {
            console.error('Failed to open Google Calendar:', error);
            // Fallback to download
            handleExportCalendar();
        }
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

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
            
            {/* Export Controls */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">Export Options</h3>
                        <span className="text-sm text-gray-400">Download your growth plan</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleDownloadJSON}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center space-x-2"
                            title="Download as JSON"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>JSON</span>
                        </button>
                        
                        <button
                            onClick={handleDownloadPDF}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center space-x-2"
                            title="Download as PDF"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>PDF</span>
                        </button>
                        
                        <div className="relative">
                            <button
                                onClick={toggleInstructions}
                                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center space-x-2"
                                title="Calendar Export Options"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Calendar</span>
                                <svg className={`w-4 h-4 transition-transform duration-200 ${showInstructions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {showInstructions && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 p-3">
                                    <div className="space-y-2">
                                        <button
                                            onClick={handleOpenInGoogleCalendar}
                                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors"
                                        >
                                            📅 Open in Google Calendar
                                        </button>
                                        <button
                                            onClick={handleExportCalendar}
                                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors"
                                        >
                                            📥 Download .ics file
                                        </button>
                                        <button
                                            onClick={handleDownloadCalendarCSV}
                                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors"
                                        >
                                            📊 Download CSV
                                        </button>
                                        <div className="border-t border-gray-700 pt-2 mt-2">
                                            <p className="text-xs text-gray-400 mb-1">Import instructions:</p>
                                            <p className="text-xs text-gray-500">{getCalendarImportInstructions()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
                {activeTab === 'socialMedia' && <SocialMediaTab posts={results.socialMediaPosts} businessType={formData?.businessType} targetAudience={formData?.targetAudience} />}
                {activeTab === 'calendar' && <CampaignCalendar initialItems={results.publishingCalendar} />}
                {activeTab === 'quality' && <QualityChecklistTab items={results.qualityChecklist} />}
                {activeTab === 'analysis' && results.campaignAnalysis && <AnalysisTab analysis={results.campaignAnalysis} />}
            </div>
        </div>
    );
};