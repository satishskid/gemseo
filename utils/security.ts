/**
 * Security utilities for API key handling and data sanitization
 * Implements secure storage and XSS prevention
 */

import { FEATURE_FLAGS } from '../config/featureFlags';

// Encryption utilities (simplified for demo - use proper crypto in production)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'dev-key-change-in-production';

/**
 * Simple encryption for API keys (use proper crypto library in production)
 */
export const encryptApiKey = (apiKey: string): string => {
  if (!FEATURE_FLAGS.SECURE_API_STORAGE) {
    return apiKey; // Fallback to plaintext for backward compatibility
  }
  
  try {
    // Simple XOR encryption (replace with proper crypto in production)
    return btoa(apiKey.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    ).join(''));
  } catch (error) {
    console.error('Encryption failed:', error);
    return apiKey; // Fallback to plaintext
  }
};

/**
 * Decrypt API key
 */
export const decryptApiKey = (encryptedKey: string): string => {
  if (!FEATURE_FLAGS.SECURE_API_STORAGE || !encryptedKey) {
    return encryptedKey;
  }
  
  try {
    // Decrypt XOR encryption
    return atob(encryptedKey).split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    ).join('');
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedKey;
  }
};

/**
 * Securely store API key with fallback
 */
export const secureStoreApiKey = (apiKey: string): void => {
  if (FEATURE_FLAGS.SECURE_API_STORAGE) {
    try {
      const encrypted = encryptApiKey(apiKey);
      localStorage.setItem('encrypted_gemini_api_key', encrypted);
      // Remove old plaintext key for security
      localStorage.removeItem('gemini_api_key');
    } catch (error) {
      console.error('Secure storage failed:', error);
      // Fallback to plaintext storage
      localStorage.setItem('gemini_api_key', apiKey);
    }
  } else {
    // Backward compatibility mode
    localStorage.setItem('gemini_api_key', apiKey);
  }
};

/**
 * Retrieve API key securely with fallback
 */
export const secureRetrieveApiKey = (): string | null => {
  if (FEATURE_FLAGS.SECURE_API_STORAGE) {
    try {
      const encrypted = localStorage.getItem('encrypted_gemini_api_key');
      if (encrypted) {
        return decryptApiKey(encrypted);
      }
    } catch (error) {
      console.error('Secure retrieval failed:', error);
    }
  }
  
  // Fallback to old storage method
  return localStorage.getItem('gemini_api_key');
};

/**
 * Input sanitization to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  if (!FEATURE_FLAGS.INPUT_VALIDATION) {
    return input; // No sanitization if feature disabled
  }
  
  // Basic HTML entity encoding
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate business description for common attack patterns
 */
export const validateBusinessDescription = (description: string): { isValid: boolean; error?: string } => {
  if (!FEATURE_FLAGS.INPUT_VALIDATION) {
    return { isValid: true };
  }
  
  // Check for potential XSS patterns
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(description)) {
      return { 
        isValid: false, 
        error: 'Business description contains potentially unsafe content' 
      };
    }
  }
  
  // Length validation
  if (description.length > 5000) {
    return { 
      isValid: false, 
      error: 'Business description is too long (max 5000 characters)' 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate API key format
 */
export const validateApiKey = (apiKey: string): { isValid: boolean; error?: string } => {
  if (!apiKey || typeof apiKey !== 'string') {
    return { isValid: false, error: 'API key is required' };
  }
  
  // Basic format validation for Gemini API keys
  if (!apiKey.startsWith('AIza')) {
    return { isValid: false, error: 'Invalid API key format' };
  }
  
  if (apiKey.length < 30) {
    return { isValid: false, error: 'API key appears to be too short' };
  }
  
  return { isValid: true };
};