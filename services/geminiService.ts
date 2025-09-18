import { GoogleGenAI, Type } from "@google/genai";
import type { SeoFormData, GeminiResults } from '../types';

const getAIClient = (apiKey: string) => {
    if (!apiKey) {
        throw new Error("API key is required.");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateGrowthPlan = async (formData: SeoFormData, apiKey: string): Promise<GeminiResults> => {
    const ai = getAIClient(apiKey);
    
    const systemPrompt = `You are an expert SEO strategist and digital marketing genius specializing in the Indian market for healthcare (providers, payers, pharma), edtech, and D2C personal care products. Your task is to provide a complete, hyper-local, and actionable growth plan. Structure your response perfectly into the requested JSON format. Your content must be human-like, pass AI detection, and be optimized for conversions in the Indian context. All content generated (pillar posts, blogs, landing pages) must be comprehensive, well-structured with HTML, and at least 1000 words each.`;

    let campaignDataSection = '';
    if (formData.campaignData.trim() !== '') {
        campaignDataSection = `
        ## Campaign Performance / SEO Audit Data for Analysis ##
        ${formData.campaignData}
        `;
    }

    const businessProfileParts = [
        `Name: ${formData.businessName}`,
        `Location (Pincode/City): ${formData.pincode}`,
        `Description: ${formData.businessDescription}`,
        `Target Audience: ${formData.targetAudience}`
    ];

    if (formData.websiteUrl.trim()) {
        businessProfileParts.push(`Website URL: ${formData.websiteUrl.trim()}`);
    }

    if (formData.brandVoice.trim()) {
        businessProfileParts.push(`Brand Voice: ${formData.brandVoice.trim()}`);
    }
    
    const businessProfile = businessProfileParts.join('\n        ');


    const userPrompt = `
        Analyze the following business profile for the Indian market and generate a comprehensive, hyper-local SEO and content plan.

        ## Business Profile ##
        ${businessProfile}
        ${campaignDataSection}

        ## Task ##
        Generate ALL of the following assets based on the business profile. Ensure all content is well-structured with appropriate HTML tags (headings, paragraphs, lists) and ready to publish.

        1.  **Keywords:** A list of hyper-local keywords.
        2.  **Pillar Post:** One long-form pillar content piece.
        3.  **Blog Posts:** Several supporting blog post ideas with full content.
        4.  **Landing Pages:** Ideas for 2-3 conversion-focused landing pages with full content.
        5.  **Publishing Calendar:** A detailed content publishing schedule.
        6.  **Campaign Analysis:** If campaign data is provided, perform a detailed analysis and provide actionable recommendations. If not, make this field null.
        7.  **Technical SEO Audit:** A full technical audit with code examples for robots.txt, schema, etc.
        8.  **Google Business Profile Recommendations:** A strategy for optimizing the GBP listing.
        9.  **Quality Checklist:** A list of human-review steps to perform before publishing the content.
    `;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            keywords: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keyword: { type: Type.STRING }, intent: { type: Type.STRING }, explanation: { type: Type.STRING } } } },
            pillarPost: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING } } },
            blogPosts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING } } } },
            landingPages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING } } } },
            publishingCalendar: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { week: { type: Type.STRING }, day: { type: Type.STRING }, platform: { type: Type.STRING }, title: {type: Type.STRING}, content: {type: Type.STRING}, notes: { type: Type.STRING } } } },
            campaignAnalysis: { type: [Type.OBJECT, Type.NULL], properties: { summary: { type: Type.STRING }, keyObservations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { metric: { type: Type.STRING }, finding: { type: Type.STRING } } } }, recommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { recommendation: { type: Type.STRING }, impact: { type: Type.STRING } } } } } },
            technicalSeoAudit: { type: Type.OBJECT, properties: { auditSummary: { type: Type.STRING }, robotsTxt: { type: Type.OBJECT, properties: { recommendation: {type: Type.STRING }, code: {type: Type.STRING}} }, schemaMarkup: { type: Type.OBJECT, properties: { recommendation: {type: Type.STRING }, code: {type: Type.STRING}} }, performanceFixes: { type: Type.OBJECT, properties: { recommendation: {type: Type.STRING }, checklist: {type: Type.ARRAY, items: {type: Type.STRING}}} }, onPageFixes: { type: Type.OBJECT, properties: { recommendation: {type: Type.STRING }, checklist: {type: Type.ARRAY, items: {type: Type.STRING}}} }, llmVisibility: { type: Type.OBJECT, properties: { recommendation: {type: Type.STRING }, code: {type: Type.STRING}} } } },
            gbpRecommendations: { type: Type.OBJECT, properties: { profileSetup: { type: Type.OBJECT, properties: { recommendation: { type: Type.STRING }, actionableSteps: { type: Type.ARRAY, items: { type: Type.STRING }}}}, postSuggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }}}}, reviewStrategy: { type: Type.STRING }}},
            qualityChecklist: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { task: { type: Type.STRING }, description: { type: Type.STRING }}}}
        }
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.7,
        }
    });
    
    const jsonText = response.text;
    return JSON.parse(jsonText) as GeminiResults;
};

export const generateTextSuggestion = async (prompt: string, apiKey: string): Promise<string> => {
    const ai = getAIClient(apiKey);
    const systemPrompt = `You are a helpful AI assistant that generates concise text for web forms. Respond only with the generated text, no preamble or markdown.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemPrompt,
            temperature: 0.5,
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });

    return response.text.trim();
};

export const testApiKey = async (apiKey: string): Promise<{ success: boolean; message: string }> => {
    try {
        const ai = getAIClient(apiKey);
        // Use a very small, fast, and cheap model call to test the key
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "test",
            config: { maxOutputTokens: 5 }
        });
        return { success: true, message: 'API key is valid and working correctly.' };
    } catch (error) {
        console.error("API Key Test Failed:", error);
        return { success: false, message: 'API key is invalid or has insufficient permissions. Please check the key and try again.' };
    }
};