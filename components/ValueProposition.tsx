import React, { useState } from 'react';
import { ChevronDown, Search, X } from './icons/Icons';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "What makes GBSEO different from other SEO tools?",
    answer: "GBSEO focuses on ROI-first approach with AI-powered strategy integration. We combine SEO, content marketing, and business strategy to prioritize activities that directly impact your bottom line.",
    category: "Features"
  },
  {
    question: "How does the pillar content creation work?",
    answer: "GBSEO creates comprehensive, authoritative content pieces designed to rank for competitive keywords and serve as the foundation for your content strategy. Each pillar targets high commercial intent keywords.",
    category: "Content"
  },
  {
    question: "Can GBSEO help with local SEO in India?",
    answer: "Yes! GBSEO specializes in Indian geographic targeting with hyperlocal (pincode level), neighborhood, city, and regional level optimization. We understand local search patterns and intent.",
    category: "Local SEO"
  },
  {
    question: "What kind of ROI can I expect?",
    answer: "GBSEO targets keywords with high commercial intent and conversion potential. Our revenue-driven keyword strategy focuses on measurable business outcomes, not just rankings.",
    category: "ROI"
  },
  {
    question: "How does the social media integration work?",
    answer: "GBSEO provides platform-specific post suggestions with ready-to-use content, hashtags, and CTAs. We amplify your SEO content across social channels for maximum reach.",
    category: "Social Media"
  },
  {
    question: "Is technical SEO included?",
    answer: "Absolutely! GBSEO includes automated technical SEO audits that identify and prioritize issues with actionable improvement recommendations, ensuring your content gets properly indexed.",
    category: "Technical"
  },
  {
    question: "How does the publishing calendar work?",
    answer: "Our strategic publishing calendar provides optimal timing for content release, coordinated across multiple channels to maximize content impact and reach.",
    category: "Strategy"
  },
  {
    question: "What support do you provide for Google Business Profile?",
    answer: "GBSEO includes Google Business Profile optimization with local SEO enhancement strategies, review management recommendations, and local search visibility improvements.",
    category: "Local SEO"
  }
];

export const ValueProposition: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [showFAQ, setShowFAQ] = useState(false);

  const categories = ['All', 'Features', 'Content', 'Local SEO', 'ROI', 'Social Media', 'Technical', 'Strategy'];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      {/* Value Proposition Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-6">
          🚀 Transform Your Business with AI-Powered SEO
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          GBSEO combines advanced SEO algorithms with Indian market intelligence to deliver 
          measurable business growth. Focus on ROI, not just rankings.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="text-3xl mb-3">🏗️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Pillar Content</h3>
            <p className="text-gray-400 text-sm">Authority-building content that ranks for competitive keywords</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="text-lg font-semibold text-white mb-2">Local SEO</h3>
            <p className="text-gray-400 text-sm">Hyperlocal targeting for Indian markets - pincode to city level</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">ROI Focus</h3>
            <p className="text-gray-400 text-sm">Revenue-driven strategy targeting high commercial intent keywords</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-gray-400 text-sm">Smart automation for technical audits and content optimization</p>
          </div>
        </div>

        <button
          onClick={() => setShowFAQ(!showFAQ)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          {showFAQ ? 'Hide FAQ' : 'Learn More'}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFAQ ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* FAQ Section */}
      {showFAQ && (
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
          
          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No FAQs found matching your search.
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg border border-gray-600">
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="w-full px-4 py-4 text-left flex justify-between items-center hover:bg-gray-600/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                      <span className="text-white font-medium">{faq.question}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedItems.includes(index) ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedItems.includes(index) && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-600">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};