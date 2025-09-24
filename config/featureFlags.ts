/**
 * Feature Flags for Safe Rollout of Architectural Improvements
 * All new features are disabled by default and can be enabled gradually
 */

export const FEATURE_FLAGS = {
  // Security Features
  SECURE_API_STORAGE: import.meta.env.VITE_SECURE_API_STORAGE === 'true' || false,
  INPUT_VALIDATION: import.meta.env.VITE_INPUT_VALIDATION === 'true' || false,
  ENHANCED_ERROR_HANDLING: import.meta.env.VITE_ENHANCED_ERROR_HANDLING === 'true' || true, // Always enabled for safety
  
  // Performance Features
  CODE_SPLITTING: import.meta.env.VITE_CODE_SPLITTING === 'true' || false,
  OFFLINE_SUPPORT: import.meta.env.VITE_OFFLINE_SUPPORT === 'true' || false,
  
  // UX Features
  LOADING_STATES: import.meta.env.VITE_LOADING_STATES === 'true' || false,
  ACCESSIBILITY_ENHANCED: import.meta.env.VITE_ACCESSIBILITY_ENHANCED === 'true' || false,
  
  // Development Helpers
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || false,
} as const;

// Feature flag helper functions
export const isFeatureEnabled = (flag: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[flag];
};

export const enableFeature = (flag: keyof typeof FEATURE_FLAGS): void => {
  if (typeof window !== 'undefined') {
    console.warn(`Feature ${flag} would be enabled in production via environment variables`);
  }
};

// Export for debugging
export const getEnabledFeatures = (): string[] => {
  return Object.entries(FEATURE_FLAGS)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);
};