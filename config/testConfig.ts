/**
 * Test Configuration for Architectural Improvements
 * Provides safe testing environment for new features
 */

import { FEATURE_FLAGS } from './featureFlags';

export interface TestConfig {
  // Feature testing modes
  enableAllFeatures: boolean;
  enableSecurityFeatures: boolean;
  enablePerformanceFeatures: boolean;
  enableUXFeatures: boolean;
  
  // Test data
  testApiKey: string;
  testFormData: any;
  testUser: any;
  
  // Monitoring
  enableErrorTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableUserTracking: boolean;
  
  // Rollback settings
  autoRollbackOnError: boolean;
  rollbackThreshold: number; // Number of errors before rollback
  
  // Feature flags for testing
  featureFlags: typeof FEATURE_FLAGS;
}

// Test configuration with safe defaults
export const TEST_CONFIG: TestConfig = {
  enableAllFeatures: false,
  enableSecurityFeatures: false,
  enablePerformanceFeatures: false,
  enableUXFeatures: false,
  
  // Test data (non-sensitive)
  testApiKey: 'AIzaTestKey123456789012345678901234567890',
  testFormData: {
    businessName: 'Test Business',
    pincode: '123456',
    businessDescription: 'This is a test business description for testing purposes.',
    targetAudience: 'Test audience in test location',
    campaignData: 'Test campaign data',
    websiteUrl: 'https://testbusiness.com',
    brandVoice: 'Professional',
    socialMediaHandles: '@testbusiness',
  },
  testUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
  },
  
  // Monitoring disabled by default for testing
  enableErrorTracking: false,
  enablePerformanceMonitoring: false,
  enableUserTracking: false,
  
  // Safe rollback settings
  autoRollbackOnError: true,
  rollbackThreshold: 3,
  
  // Copy current feature flags
  featureFlags: { ...FEATURE_FLAGS },
};

/**
 * Environment-specific test configurations
 */
export const getTestConfig = (environment: 'development' | 'staging' | 'production'): TestConfig => {
  const baseConfig = { ...TEST_CONFIG };
  
  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        enableAllFeatures: true,
        enableSecurityFeatures: true,
        enablePerformanceFeatures: true,
        enableUXFeatures: true,
        enableErrorTracking: true,
        enablePerformanceMonitoring: true,
      };
      
    case 'staging':
      return {
        ...baseConfig,
        enableSecurityFeatures: true,
        enablePerformanceFeatures: true,
        enableUXFeatures: true,
        enableErrorTracking: true,
        enablePerformanceMonitoring: true,
      };
      
    case 'production':
      return {
        ...baseConfig,
        // Production uses environment variables
        enableSecurityFeatures: FEATURE_FLAGS.SECURE_API_STORAGE,
        enablePerformanceFeatures: FEATURE_FLAGS.CODE_SPLITTING,
        enableUXFeatures: FEATURE_FLAGS.LOADING_STATES,
        enableErrorTracking: true,
        enablePerformanceMonitoring: false, // Disable in production for privacy
      };
      
    default:
      return baseConfig;
  }
};

/**
 * Feature testing utilities
 */
export class FeatureTester {
  private errorCount: number = 0;
  private startTime: number = Date.now();
  private metrics: Map<string, any> = new Map();
  
  constructor(private config: TestConfig) {}
  
  /**
   * Test a feature with automatic rollback on failure
   */
  async testFeature<T>(
    featureName: string,
    testFunction: () => Promise<T>,
    rollbackFunction?: () => Promise<void>
  ): Promise<{ success: boolean; result?: T; error?: Error }> {
    try {
      console.log(`Testing feature: ${featureName}`);
      const result = await testFunction();
      
      this.recordSuccess(featureName);
      console.log(`Feature test passed: ${featureName}`);
      
      return { success: true, result };
    } catch (error) {
      this.recordFailure(featureName, error as Error);
      console.error(`Feature test failed: ${featureName}`, error);
      
      this.errorCount++;
      
      // Auto-rollback if enabled and threshold reached
      if (this.config.autoRollbackOnError && this.errorCount >= this.config.rollbackThreshold) {
        console.warn(`Error threshold reached, attempting rollback for: ${featureName}`);
        if (rollbackFunction) {
          try {
            await rollbackFunction();
            console.log(`Rollback completed for: ${featureName}`);
          } catch (rollbackError) {
            console.error(`Rollback failed for: ${featureName}`, rollbackError);
          }
        }
      }
      
      return { success: false, error: error as Error };
    }
  }
  
  /**
   * Record performance metrics
   */
  recordMetric(name: string, value: any): void {
    this.metrics.set(name, {
      value,
      timestamp: Date.now(),
      duration: Date.now() - this.startTime,
    });
  }
  
  /**
   * Record successful feature test
   */
  private recordSuccess(featureName: string): void {
    this.recordMetric(`${featureName}_success`, true);
  }
  
  /**
   * Record failed feature test
   */
  private recordFailure(featureName: string, error: Error): void {
    this.recordMetric(`${featureName}_failure`, {
      error: error.message,
      stack: error.stack,
    });
  }
  
  /**
   * Get all recorded metrics
   */
  getMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};
    this.metrics.forEach((value, key) => {
      metrics[key] = value;
    });
    return metrics;
  }
  
  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.errorCount;
  }
  
  /**
   * Reset tester state
   */
  reset(): void {
    this.errorCount = 0;
    this.startTime = Date.now();
    this.metrics.clear();
  }
}

/**
 * Safe feature rollout manager
 */
export class RolloutManager {
  private enabledFeatures: Set<string> = new Set();
  private testResults: Map<string, boolean> = new Map();
  
  constructor(private config: TestConfig) {}
  
  /**
   * Gradually enable a feature for a percentage of users
   */
  enableFeatureGradually(featureName: string, percentage: number, userId: string): boolean {
    // Simple hash-based percentage rollout
    const hash = this.simpleHash(userId + featureName);
    const shouldEnable = (hash % 100) < percentage;
    
    if (shouldEnable) {
      this.enabledFeatures.add(featureName);
      console.log(`Feature ${featureName} enabled for user ${userId} (${percentage}%)`);
    }
    
    return shouldEnable;
  }
  
  /**
   * Simple hash function for consistent percentage rollout
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  /**
   * Record test result for a feature
   */
  recordTestResult(featureName: string, success: boolean): void {
    this.testResults.set(featureName, success);
  }
  
  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    return this.enabledFeatures.has(featureName);
  }
  
  /**
   * Get all test results
   */
  getTestResults(): Record<string, boolean> {
    const results: Record<string, boolean> = {};
    this.testResults.forEach((value, key) => {
      results[key] = value;
    });
    return results;
  }
}

/**
 * Test utilities
 */
export const TestUtils = {
  /**
   * Create a mock API response
   */
  createMockResponse<T>(data: T, delay: number = 100): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  },
  
  /**
   * Create a mock error response
   */
  createMockError(message: string = 'Test error', delay: number = 100): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), delay);
    });
  },
  
  /**
   * Simulate network conditions
   */
  simulateNetworkConditions(online: boolean = true, speed: 'fast' | 'slow' | 'offline' = 'fast'): void {
    if (!online || speed === 'offline') {
      // @ts-ignore - for testing only
      window.navigator.onLine = false;
    } else {
      // @ts-ignore - for testing only
      window.navigator.onLine = true;
    }
    
    // You could also mock fetch here for different speeds
    console.log(`Network conditions simulated: ${online ? 'online' : 'offline'}, speed: ${speed}`);
  },
  
  /**
   * Clean up test data
   */
  cleanupTestData(): void {
    // Clean up localStorage test data
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('test_') || key.includes('test')
    );
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clean up sessionStorage
    sessionStorage.clear();
    
    console.log(`Cleaned up ${keysToRemove.length} test items`);
  },
};