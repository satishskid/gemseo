#!/usr/bin/env node

/**
 * Local Test Server for Architectural Improvements
 * Sets up a local development environment with feature flags enabled
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configuration
const TEST_CONFIG = {
  port: 3001, // Different from default dev port
  host: 'localhost',
  featureFlags: {
    SECURE_API_STORAGE: true,
    INPUT_VALIDATION: true,
    ENHANCED_ERROR_HANDLING: true,
    LOADING_STATES: true,
    OFFLINE_SUPPORT: true,
    ACCESSIBILITY_IMPROVEMENTS: true,
    BUNDLE_OPTIMIZATION: true,
  },
  environment: 'development',
  enableHotReload: true,
};

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
  log('🏗️  ARCHITECTURAL IMPROVEMENTS TEST SERVER', colors.cyan + colors.bright);
  console.log('='.repeat(60));
  log(`Environment: ${TEST_CONFIG.environment}`, colors.green);
  log(`Port: ${TEST_CONFIG.port}`, colors.green);
  log(`Host: ${TEST_CONFIG.host}`, colors.green);
  console.log('-'.repeat(60));
  log('Enabled Feature Flags:', colors.yellow);
  Object.entries(TEST_CONFIG.featureFlags).forEach(([flag, enabled]) => {
    const status = enabled ? colors.green + '✅' : colors.red + '❌';
    log(`  ${status} ${flag}`, colors.cyan);
  });
  console.log('='.repeat(60) + '\n');
}

function createEnvFile() {
  const envContent = `
# Test Environment Configuration
REACT_APP_ENVIRONMENT=${TEST_CONFIG.environment}
REACT_APP_TEST_PORT=${TEST_CONFIG.port}
REACT_APP_ENABLE_HOT_RELOAD=${TEST_CONFIG.enableHotReload}

# Feature Flags
REACT_APP_FEATURE_FLAGS_SECURE_API_STORAGE=${TEST_CONFIG.featureFlags.SECURE_API_STORAGE}
REACT_APP_FEATURE_FLAGS_INPUT_VALIDATION=${TEST_CONFIG.featureFlags.INPUT_VALIDATION}
REACT_APP_FEATURE_FLAGS_ENHANCED_ERROR_HANDLING=${TEST_CONFIG.featureFlags.ENHANCED_ERROR_HANDLING}
REACT_APP_FEATURE_FLAGS_LOADING_STATES=${TEST_CONFIG.featureFlags.LOADING_STATES}
REACT_APP_FEATURE_FLAGS_OFFLINE_SUPPORT=${TEST_CONFIG.featureFlags.OFFLINE_SUPPORT}
REACT_APP_FEATURE_FLAGS_ACCESSIBILITY_IMPROVEMENTS=${TEST_CONFIG.featureFlags.ACCESSIBILITY_IMPROVEMENTS}
REACT_APP_FEATURE_FLAGS_BUNDLE_OPTIMIZATION=${TEST_CONFIG.featureFlags.BUNDLE_OPTIMIZATION}

# Test Configuration
REACT_APP_TEST_MODE=true
REACT_APP_ENABLE_ROLLBACK=true
REACT_APP_ENABLE_METRICS=true
  `.trim();

  fs.writeFileSync('.env.test', envContent);
  log('✅ Created test environment file: .env.test', colors.green);
}

function startViteDevServer() {
  log('🚀 Starting Vite development server...', colors.blue);
  
  const viteProcess = spawn('npx', [
    'vite',
    '--port', TEST_CONFIG.port,
    '--host', TEST_CONFIG.host,
    '--mode', 'test',
    '--strictPort'
  ], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      ...Object.fromEntries(
        Object.entries(TEST_CONFIG.featureFlags).map(([key, value]) => [
          `REACT_APP_FEATURE_FLAGS_${key}`,
          value.toString()
        ])
      ),
      REACT_APP_ENVIRONMENT: TEST_CONFIG.environment,
      REACT_APP_TEST_MODE: 'true',
      REACT_APP_ENABLE_ROLLBACK: 'true',
      REACT_APP_ENABLE_METRICS: 'true',
    }
  });

  viteProcess.on('error', (error) => {
    log(`❌ Failed to start Vite server: ${error.message}`, colors.red);
    process.exit(1);
  });

  viteProcess.on('exit', (code) => {
    if (code !== 0) {
      log(`❌ Vite server exited with code ${code}`, colors.red);
      process.exit(code);
    }
  });

  return viteProcess;
}

function startTestRunner() {
  log('🧪 Starting test runner...', colors.blue);
  
  const testProcess = spawn('npx', [
    'ts-node',
    'scripts/testArchitecturalImprovements.ts',
    '--watch'
  ], {
    stdio: 'inherit',
    shell: true,
  });

  testProcess.on('error', (error) => {
    log(`❌ Failed to start test runner: ${error.message}`, colors.red);
  });

  return testProcess;
}

function setupGracefulShutdown(serverProcess, testProcess) {
  const shutdown = () => {
    log('\n🛑 Shutting down test server...', colors.yellow);
    
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
    
    if (testProcess) {
      testProcess.kill('SIGTERM');
    }
    
    // Clean up environment file
    if (fs.existsSync('.env.test')) {
      fs.unlinkSync('.env.test');
      log('🧹 Cleaned up test environment file', colors.green);
    }
    
    log('✅ Test server shutdown complete', colors.green);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', shutdown);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  printBanner();
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    log('❌ No package.json found. Please run this from the project root.', colors.red);
    process.exit(1);
  }

  // Create environment file
  createEnvFile();

  // Start development server
  const serverProcess = startViteDevServer();
  
  // Optionally start test runner
  let testProcess;
  if (process.argv.includes('--with-tests')) {
    testProcess = startTestRunner();
  }

  // Setup graceful shutdown
  setupGracefulShutdown(serverProcess, testProcess);

  log(`\n🌟 Test server is starting...`, colors.green);
  log(`📍 Local: http://${TEST_CONFIG.host}:${TEST_CONFIG.port}`, colors.cyan);
  log(`📊 Metrics: http://${TEST_CONFIG.host}:${TEST_CONFIG.port}/metrics`, colors.cyan);
  log(`🧪 Tests: ${process.argv.includes('--with-tests') ? 'Running' : 'Use --with-tests flag to enable'}`, colors.cyan);
  log(`\n💡 Press Ctrl+C to stop the server`, colors.yellow);
  log(`🔧 Use --help for more options`, colors.yellow);
}

// Handle command line arguments
if (process.argv.includes('--help')) {
  console.log(`
Usage: node scripts/start-local-test-server.js [options]

Options:
  --with-tests    Start with automated test runner
  --port <port>   Specify custom port (default: 3001)
  --help          Show this help message

Examples:
  node scripts/start-local-test-server.js
  node scripts/start-local-test-server.js --with-tests
  node scripts/start-local-test-server.js --port 8080 --with-tests
  `);
  process.exit(0);
}

if (process.argv.includes('--port')) {
  const portIndex = process.argv.indexOf('--port');
  const port = parseInt(process.argv[portIndex + 1]);
  if (port && port > 0 && port < 65536) {
    TEST_CONFIG.port = port;
  }
}

// Run main function
main();