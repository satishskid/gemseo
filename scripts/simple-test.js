#!/usr/bin/env node

/**
 * Simple Test Script for Architectural Improvements
 * Basic validation of all improvements
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printBanner() {
  console.log('\n' + '='.repeat(60));
  log('🧪 ARCHITECTURAL IMPROVEMENTS TEST SUITE', colors.cyan + colors.bright);
  console.log('='.repeat(60) + '\n');
}

function printResults(tests) {
  console.log('\n' + '-'.repeat(40));
  log('📊 TEST RESULTS SUMMARY', colors.yellow);
  console.log('-'.repeat(40));
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    if (test.passed) {
      log(`✅ ${test.name}`, colors.green);
      passed++;
    } else {
      log(`❌ ${test.name}`, colors.red);
      if (test.error) {
        log(`   Error: ${test.error}`, colors.red);
      }
      failed++;
    }
  });
  
  console.log('\n' + '-'.repeat(40));
  log(`Total: ${tests.length} | Passed: ${passed} | Failed: ${failed}`, colors.cyan);
  console.log('-'.repeat(40) + '\n');
  
  return failed === 0;
}

// Test functions
function testFileExists(filePath, description) {
  try {
    const exists = existsSync(filePath);
    return {
      name: description,
      passed: exists,
      error: exists ? null : `File not found: ${filePath}`
    };
  } catch (error) {
    return {
      name: description,
      passed: false,
      error: error.message
    };
  }
}

function testFeatureFlags() {
  try {
    const featureFlagsPath = join(__dirname, '..', 'config', 'featureFlags.ts');
    if (!existsSync(featureFlagsPath)) {
      return {
        name: 'Feature Flags Configuration',
        passed: false,
        error: 'Feature flags file not found'
      };
    }
    
    const content = readFileSync(featureFlagsPath, 'utf8');
    const hasFlags = content.includes('SECURE_API_STORAGE') && 
                    content.includes('INPUT_VALIDATION') &&
                    content.includes('ENHANCED_ERROR_HANDLING');
    
    return {
      name: 'Feature Flags Configuration',
      passed: hasFlags,
      error: hasFlags ? null : 'Missing required feature flags'
    };
  } catch (error) {
    return {
      name: 'Feature Flags Configuration',
      passed: false,
      error: error.message
    };
  }
}

function testSecurityUtils() {
  try {
    const securityPath = join(__dirname, '..', 'utils', 'security.ts');
    if (!existsSync(securityPath)) {
      return {
        name: 'Security Utilities',
        passed: false,
        error: 'Security utilities file not found'
      };
    }
    
    const content = readFileSync(securityPath, 'utf8');
    const hasFunctions = content.includes('secureStoreApiKey') && 
                      content.includes('secureRetrieveApiKey') &&
                      content.includes('validateApiKey') &&
                      content.includes('validateBusinessDescription');
    
    return {
      name: 'Security Utilities',
      passed: hasFunctions,
      error: hasFunctions ? null : 'Missing required security functions'
    };
  } catch (error) {
    return {
      name: 'Security Utilities',
      passed: false,
      error: error.message
    };
  }
}

function testErrorBoundary() {
  try {
    const errorBoundaryPath = join(__dirname, '..', 'components', 'ErrorBoundary.tsx');
    if (!existsSync(errorBoundaryPath)) {
      return {
        name: 'Error Boundary Component',
        passed: false,
        error: 'Error boundary file not found'
      };
    }
    
    const content = readFileSync(errorBoundaryPath, 'utf8');
    const hasFeatures = content.includes('getDerivedStateFromError') && 
                       content.includes('componentDidCatch') &&
                       content.includes('ErrorBoundary');
    
    return {
      name: 'Error Boundary Component',
      passed: hasFeatures,
      error: hasFeatures ? null : 'Missing required error boundary features'
    };
  } catch (error) {
    return {
      name: 'Error Boundary Component',
      passed: false,
      error: error.message
    };
  }
}

function testLoadingStates() {
  try {
    const loadingPath = join(__dirname, '..', 'components', 'LoadingStates.tsx');
    if (!existsSync(loadingPath)) {
      return {
        name: 'Loading States Component',
        passed: false,
        error: 'Loading states file not found'
      };
    }
    
    const content = readFileSync(loadingPath, 'utf8');
    const hasComponents = content.includes('LoadingSpinner') && 
                         content.includes('LoadingState') &&
                         content.includes('ProgressBar') &&
                         content.includes('useLoadingState');
    
    return {
      name: 'Loading States Component',
      passed: hasComponents,
      error: hasComponents ? null : 'Missing required loading state components'
    };
  } catch (error) {
    return {
      name: 'Loading States Component',
      passed: false,
      error: error.message
    };
  }
}

function testOfflineSupport() {
  try {
    const swPath = join(__dirname, '..', 'public', 'sw.js');
    const offlinePath = join(__dirname, '..', 'public', 'offline.html');
    const serviceWorkerUtilsPath = join(__dirname, '..', 'utils', 'serviceWorker.ts');
    
    const hasSW = existsSync(swPath);
    const hasOffline = existsSync(offlinePath);
    const hasUtils = existsSync(serviceWorkerUtilsPath);
    
    return {
      name: 'Offline Support',
      passed: hasSW && hasOffline && hasUtils,
      error: (hasSW && hasOffline && hasUtils) ? null : 
             `Missing: ${!hasSW ? 'Service Worker ' : ''}${!hasOffline ? 'Offline Page ' : ''}${!hasUtils ? 'Service Worker Utils' : ''}`
    };
  } catch (error) {
    return {
      name: 'Offline Support',
      passed: false,
      error: error.message
    };
  }
}

function testEnhancedAppPage() {
  try {
    const enhancedPath = join(__dirname, '..', 'pages', 'AppPageEnhanced.tsx');
    if (!existsSync(enhancedPath)) {
      return {
        name: 'Enhanced App Page',
        passed: false,
        error: 'Enhanced AppPage file not found'
      };
    }
    
    const content = readFileSync(enhancedPath, 'utf8');
    const checks = [
      { name: 'Feature flags integration', pattern: /FEATURE_FLAGS\./ },
      { name: 'Secure API key handling', pattern: /secureRetrieveApiKey/ },
      { name: 'Input validation', pattern: /validateBusinessDescription/ },
      { name: 'Enhanced loading states', pattern: /useLoadingState/ },
      { name: 'Error boundary integration', pattern: /ErrorBoundary/ }
    ];
    
    const missing = checks.filter(check => !check.pattern.test(content));
    if (missing.length > 0) {
      return {
        name: 'Enhanced App Page',
        passed: false,
        error: `Missing features: ${missing.map(m => m.name).join(', ')}`
      };
    }
    
    return {
      name: 'Enhanced App Page',
      passed: true,
      error: null
    };
  } catch (error) {
    return {
      name: 'Enhanced App Page',
      passed: false,
      error: `Error: ${error.message}`
    };
  }
}

function testDeploymentScript() {
  try {
    const deployPath = join(__dirname, 'deploy-feature-branch.sh');
    if (!existsSync(deployPath)) {
      return {
        name: 'Deployment Script',
        passed: false,
        error: 'Deployment script not found'
      };
    }
    
    const content = readFileSync(deployPath, 'utf8');
    const hasFeatures = content.includes('FEATURE_BRANCH') && 
                       content.includes('STAGING_SITE_NAME') &&
                       content.includes('rollback');
    
    return {
      name: 'Deployment Script',
      passed: hasFeatures,
      error: hasFeatures ? null : 'Missing required deployment features'
    };
  } catch (error) {
    return {
      name: 'Deployment Script',
      passed: false,
      error: error.message
    };
  }
}

function testTestConfiguration() {
  try {
    const testConfigPath = join(__dirname, '..', 'config', 'testConfig.ts');
    if (!existsSync(testConfigPath)) {
      return {
        name: 'Test Configuration',
        passed: false,
        error: 'Test configuration file not found'
      };
    }
    
    const content = readFileSync(testConfigPath, 'utf8');
    const hasFeatures = content.includes('TestConfig') && 
                       content.includes('FeatureTester') &&
                       content.includes('RolloutManager');
    
    return {
      name: 'Test Configuration',
      passed: hasFeatures,
      error: hasFeatures ? null : 'Missing required test configuration features'
    };
  } catch (error) {
    return {
      name: 'Test Configuration',
      passed: false,
      error: error.message
    };
  }
}

// Main test runner
function runAllTests() {
  printBanner();
  
  const tests = [
    testFileExists('config/featureFlags.ts', 'Feature Flags File'),
    testFeatureFlags(),
    testFileExists('utils/security.ts', 'Security Utils File'),
    testSecurityUtils(),
    testFileExists('components/ErrorBoundary.tsx', 'Error Boundary File'),
    testErrorBoundary(),
    testFileExists('components/LoadingStates.tsx', 'Loading States File'),
    testLoadingStates(),
    testOfflineSupport(),
    testFileExists('pages/AppPageEnhanced.tsx', 'Enhanced App Page File'),
    testEnhancedAppPage(),
    testFileExists('scripts/deploy-feature-branch.sh', 'Deployment Script File'),
    testDeploymentScript(),
    testFileExists('config/testConfig.ts', 'Test Configuration File'),
    testTestConfiguration(),
    testFileExists('TESTING_GUIDE.md', 'Testing Guide'),
    testFileExists('scripts/start-local-test-server.js', 'Local Test Server'),
  ];
  
  const allPassed = printResults(tests);
  
  if (allPassed) {
    log('\n🎉 ALL TESTS PASSED! Architectural improvements are ready for deployment.', colors.green + colors.bright);
    log('📖 Next step: Review the TESTING_GUIDE.md for deployment instructions.', colors.cyan);
  } else {
    log('\n❌ SOME TESTS FAILED. Please review the errors above.', colors.red + colors.bright);
    log('🔧 Fix the issues before proceeding with deployment.', colors.yellow);
  }
  
  return allPassed;
}

// Run tests
const success = runAllTests();
process.exit(success ? 0 : 1);