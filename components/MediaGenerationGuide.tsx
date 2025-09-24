import React, { useState } from 'react';
import { Copy, ExternalLink, Download, Sparkles, Image, Video, FileText, CheckCircle } from 'lucide-react';

interface MediaPlatform {
  id: string;
  name: string;
  type: 'image' | 'video' | 'both';
  description: string;
  features: string[];
  pricing: string;
  url: string;
  embeddable: boolean;
  socialMediaCompatible: string[];
  promptExamples: {
    image: string[];
    video: string[];
  };
}

const mediaPlatforms: MediaPlatform[] = [
  {
    id: 'leonardo-ai',
    name: 'Leonardo AI',
    type: 'image',
    description: 'Professional AI image generation with fine-tuned models and style consistency',
    features: ['150+ models', 'Custom training', 'Style consistency', 'High-resolution output'],
    pricing: 'Free tier (150 daily tokens), Premium from $10/month',
    url: 'https://leonardo.ai',
    embeddable: true,
    socialMediaCompatible: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'Pinterest'],
    promptExamples: {
      image: [
        "Professional headshot of a [business type] owner, confident smile, modern office background, soft lighting, LinkedIn style portrait",
        "Vibrant Instagram post featuring [product/service], bright colors, lifestyle setting, engaging composition, social media ready",
        "Clean minimalist graphic for [topic], modern typography, brand colors [specify colors], Pinterest-worthy design"
      ],
      video: []
    }
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    type: 'image',
    description: 'Artistic AI image generation with unique aesthetic and community features',
    features: ['Artistic style', 'Discord community', 'Version control', 'High creativity'],
    pricing: 'From $10/month (no free tier)',
    url: 'https://www.midjourney.com',
    embeddable: false,
    socialMediaCompatible: ['Instagram', 'Twitter', 'Pinterest', 'Art portfolios'],
    promptExamples: {
      image: [
        "Aesthetic social media graphic about [topic], trending art style, vibrant colors, Instagram-worthy composition --ar 1:1",
        "Professional business illustration, clean modern design, corporate branding, LinkedIn header style --ar 16:9",
        "Eye-catching Twitter header image, [industry] themed, modern typography, bold colors --ar 3:1"
      ],
      video: []
    }
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    type: 'image',
    description: 'Open-source AI image generation with unlimited customization options',
    features: ['Open source', 'Unlimited usage', 'Custom models', 'Local deployment'],
    pricing: 'Free (self-hosted) or various API services',
    url: 'https://stability.ai',
    embeddable: true,
    socialMediaCompatible: ['All platforms'],
    promptExamples: {
      image: [
        "Professional social media post, [business type], engaging visual, brand consistent, high quality, modern design",
        "Instagram story template, [topic] related, vertical format, engaging colors, social media optimized",
        "Facebook cover photo, [industry] business, professional appearance, brand aligned, 820x312 dimensions"
      ],
      video: []
    }
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    type: 'video',
    description: 'AI video generation with realistic avatars and voice synthesis',
    features: ['AI avatars', 'Voice cloning', 'Multi-language', 'Professional templates'],
    pricing: 'Free tier available, Premium from $29/month',
    url: 'https://www.heygen.com',
    embeddable: true,
    socialMediaCompatible: ['YouTube', 'LinkedIn', 'Facebook', 'Instagram', 'TikTok'],
    promptExamples: {
      image: [],
      video: [
        "Create a 30-second promotional video for [business/service] featuring a professional avatar explaining key benefits and call-to-action",
        "Generate an educational video about [topic] with engaging visuals and clear narration for social media sharing",
        "Produce a testimonial-style video with an avatar discussing [product/service] experience and results"
      ]
    }
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    type: 'video',
    description: 'Professional AI video creation with 230+ avatars and 140+ languages',
    features: ['230+ avatars', '140+ languages', 'Professional templates', 'SCORM export'],
    pricing: 'From $29/month with free trial',
    url: 'https://www.synthesia.io',
    embeddable: true,
    socialMediaCompatible: ['YouTube', 'LinkedIn', 'Corporate training', 'Educational content'],
    promptExamples: {
      image: [],
      video: [
        "Professional business presentation video about [topic], corporate setting, clear messaging, 60-second format for LinkedIn",
        "Multilingual promotional video for [product/service] targeting [audience], engaging visuals, social media optimized",
        "Training video explaining [process/concept] with step-by-step instructions and professional presentation"
      ]
    }
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face Spaces',
    type: 'both',
    description: 'Community-driven AI models for various media generation tasks',
    features: ['Community models', 'Open source', 'Multiple modalities', 'Free hosting'],
    pricing: 'Free tier with compute limits, paid plans for more resources',
    url: 'https://huggingface.co/spaces',
    embeddable: true,
    socialMediaCompatible: ['All platforms'],
    promptExamples: {
      image: [
        "Generate social media graphic using community Stable Diffusion model, [topic] themed, high engagement potential",
        "Create artistic interpretation of [concept] using Hugging Face image generation space, unique style"
      ],
      video: [
        "Use community video generation model to create short-form content about [topic], social media ready format"
      ]
    }
  }
];

interface MediaGenerationGuideProps {
  businessType?: string;
  targetAudience?: string;
  onPromptSelect?: (prompt: string, platform: string) => void;
}

export default function MediaGenerationGuide({ 
  businessType = 'your business', 
  targetAudience = 'your audience',
  onPromptSelect 
}: MediaGenerationGuideProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'image' | 'video' | 'both'>('both');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const filteredPlatforms = mediaPlatforms.filter(platform => 
    selectedType === 'both' || platform.type === selectedType || platform.type === 'both'
  );

  const copyToClipboard = async (text: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(promptId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const replacePlaceholders = (prompt: string) => {
    return prompt
      .replace(/\[business type\]/gi, businessType)
      .replace(/\[product\/service\]/gi, businessType)
      .replace(/\[topic\]/gi, targetAudience)
      .replace(/\[industry\]/gi, businessType)
      .replace(/\[audience\]/gi, targetAudience);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">AI Media Generation Guide</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Create stunning visual content for your social media posts using these recommended AI platforms. 
          Copy prompts, generate media, and embed directly into your posts.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedType('both')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedType === 'both' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Platforms
        </button>
        <button
          onClick={() => setSelectedType('image')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            selectedType === 'image' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Image className="w-4 h-4" />
          Image Generation
        </button>
        <button
          onClick={() => setSelectedType('video')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            selectedType === 'video' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Video className="w-4 h-4" />
          Video Generation
        </button>
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlatforms.map((platform) => (
          <div key={platform.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{platform.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {platform.type === 'image' && <Image className="w-4 h-4" />}
                  {platform.type === 'video' && <Video className="w-4 h-4" />}
                  {platform.type === 'both' && (
                    <>
                      <Image className="w-4 h-4" />
                      <Video className="w-4 h-4" />
                    </>
                  )}
                  <span className="capitalize">{platform.type}</span>
                </div>
              </div>
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <p className="text-gray-600 mb-4">{platform.description}</p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
              <div className="flex flex-wrap gap-2">
                {platform.features.map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-1">Pricing:</h4>
              <p className="text-sm text-gray-600">{platform.pricing}</p>
            </div>

            {/* Social Media Compatibility */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Perfect for:</h4>
              <div className="flex flex-wrap gap-2">
                {platform.socialMediaCompatible.map((platform, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompt Examples */}
            {(platform.promptExamples.image.length > 0 || platform.promptExamples.video.length > 0) && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Ready-to-Use Prompts:</h4>
                
                {platform.promptExamples.image.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Image Prompts
                    </h5>
                    {platform.promptExamples.image.map((prompt, index) => (
                      <div key={index} className="mb-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2 font-mono">
                          {replacePlaceholders(prompt)}
                        </p>
                        <button
                          onClick={() => {
                            copyToClipboard(replacePlaceholders(prompt), `${platform.id}-image-${index}`);
                            onPromptSelect?.(replacePlaceholders(prompt), platform.name);
                          }}
                          className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                        >
                          {copiedPrompt === `${platform.id}-image-${index}` ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy Prompt
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {platform.promptExamples.video.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video Prompts
                    </h5>
                    {platform.promptExamples.video.map((prompt, index) => (
                      <div key={index} className="mb-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2 font-mono">
                          {replacePlaceholders(prompt)}
                        </p>
                        <button
                          onClick={() => {
                            copyToClipboard(replacePlaceholders(prompt), `${platform.id}-video-${index}`);
                            onPromptSelect?.(replacePlaceholders(prompt), platform.name);
                          }}
                          className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                        >
                          {copiedPrompt === `${platform.id}-video-${index}` ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy Prompt
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Platform Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Best Practices
              </h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Start with detailed, specific prompts for better results</li>
                <li>• Test different styles and models to find your brand voice</li>
                <li>• Always review and adjust generated content before publishing</li>
                <li>• Keep platform-specific requirements in mind (dimensions, formats)</li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Embeddable Media Examples */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-6 h-6 text-blue-600" />
          Embeddable Media Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Instagram Post Example</h4>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg mb-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">LOGO</span>
                </div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">Your Business Name</h5>
                <p className="text-gray-600 text-sm mb-4">Engaging caption with relevant hashtags and call-to-action</p>
                <div className="flex justify-center space-x-2">
                  <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded">#hashtag1</span>
                  <span className="px-2 py-1 bg-pink-200 text-pink-800 text-xs rounded">#hashtag2</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p><strong>Dimensions:</strong> 1080x1080px (square) or 1080x1350px (portrait)</p>
              <p><strong>Format:</strong> JPG/PNG for images, MP4 for videos</p>
              <p><strong>Max size:</strong> 30MB images, 100MB videos</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">LinkedIn Post Example</h4>
            <div className="bg-blue-50 p-6 rounded-lg mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">B</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-800 mb-1">Professional Headline</h5>
                  <p className="text-gray-600 text-sm mb-3">Thought leadership content with industry insights and professional tone</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>💼 Professional</span>
                    <span>📊 Industry Insights</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p><strong>Dimensions:</strong> 1200x627px (landscape) or 1080x1080px (square)</p>
              <p><strong>Format:</strong> JPG/PNG for images, MP4 for videos</p>
              <p><strong>Max size:</strong> 5MB images, 5GB videos</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Twitter/X Post Example</h4>
            <div className="bg-gray-50 p-6 rounded-lg mb-3">
              <div className="space-y-3">
                <p className="text-gray-800 text-sm">Concise, engaging tweet with trending hashtags and clear messaging 🚀</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">#Trending</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">#Business</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">#Growth</span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>🔁 42</span>
                  <span>❤️ 128</span>
                  <span>💬 15</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p><strong>Dimensions:</strong> 1200x675px (landscape) or 1080x1080px (square)</p>
              <p><strong>Format:</strong> JPG/PNG for images, MP4 for videos</p>
              <p><strong>Character limit:</strong> 280 characters</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Facebook Post Example</h4>
            <div className="bg-white border border-gray-200 p-6 rounded-lg mb-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 text-sm">Business Page Name</h5>
                  <p className="text-gray-500 text-xs">2 hours ago</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-3">Community-focused content that encourages engagement and sharing among your target audience</p>
              <div className="bg-gray-100 p-4 rounded text-center">
                <p className="text-gray-600 text-sm italic">Your engaging visual content goes here</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p><strong>Dimensions:</strong> 1200x630px (landscape) or 1080x1080px (square)</p>
              <p><strong>Format:</strong> JPG/PNG for images, MP4 for videos</p>
              <p><strong>Max size:</strong> 4MB images, 10GB videos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          Quick Start Workflow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              1
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Choose Platform</h4>
            <p className="text-sm text-gray-600">Select an AI platform based on your content type (image/video) and social media platform</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              2
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Copy & Generate</h4>
            <p className="text-sm text-gray-600">Copy the optimized prompt, paste it into the platform, and generate your media</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              3
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Embed & Share</h4>
            <p className="text-sm text-gray-600">Download or embed the generated media and combine with your social media post text</p>
          </div>
        </div>
      </div>
    </div>
  );
}