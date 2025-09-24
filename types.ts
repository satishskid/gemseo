import type { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export interface Profile {
    id: string;
    email: string | null;
    role: 'user' | 'admin';
    has_api_key: boolean;
}

export interface SeoFormData {
    businessName: string;
    pincode: string;
    businessDescription: string;
    targetAudience: string;
    campaignData: string;
    websiteUrl: string;
    brandVoice: string;
    socialMediaHandles: string;
}

export interface Keyword {
    keyword: string;
    intent: string;
    explanation: string;
}

export interface Post {
    title: string;
    content: string;
}

export type CampaignStatus = 'draft' | 'review' | 'approved' | 'published';

export interface CalendarItem {
    // Client-side properties
    id: string;
    status: CampaignStatus;
    date?: Date;

    // Properties from API
    week: string;
    day: string;
    platform: string;
    title: string;
    content: string;
    notes: string;
}

export interface CampaignObservation {
    metric: string;
    finding: string;
}

export interface CampaignRecommendation {
    recommendation: string;
    impact: string;
}

export interface CampaignAnalysis {
    summary: string;
    keyObservations: CampaignObservation[];
    recommendations: CampaignRecommendation[];
}

export interface TechnicalSeoAudit {
    auditSummary: string;
    robotsTxt: { recommendation: string; code: string; };
    schemaMarkup: { recommendation: string; code: string; };
    performanceFixes: { recommendation: string; checklist: string[]; };
    onPageFixes: { recommendation: string; checklist: string[]; };
    llmVisibility: { recommendation: string; code: string; };
}

export interface GbpRecommendation {
    recommendation: string;
    actionableSteps: string[];
}

export interface GbpRecommendations {
    profileSetup: GbpRecommendation;
    postSuggestions: Post[];
    reviewStrategy: string;
}

export interface QualityChecklistItem {
    task: string;
    description: string;
}

export interface SocialMediaPost {
    platform: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'TikTok';
    title: string;
    content: string;
    hashtags: string[];
    callToAction: string;
    imagePrompt?: string;
}

export interface GeminiResults {
    keywords: Keyword[];
    pillarPost: Post;
    blogPosts: Post[];
    landingPages: Post[];
    publishingCalendar: Omit<CalendarItem, 'id' | 'status' | 'date'>[];
    campaignAnalysis: CampaignAnalysis | null;
    technicalSeoAudit: TechnicalSeoAudit;
    gbpRecommendations: GbpRecommendations;
    qualityChecklist: QualityChecklistItem[];
    socialMediaPosts: SocialMediaPost[];
}

export interface StoredGrowthPlan {
    id: string;
    results: GeminiResults;
    formData: SeoFormData;
    timestamp: number;
    businessName: string;
}