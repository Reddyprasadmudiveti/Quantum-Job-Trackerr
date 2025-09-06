/**
 * Environment Configuration and Validation Module
 * Validates all required environment variables on startup
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Required environment variables for the application
 */
const REQUIRED_ENV_VARS = {
  // Server Configuration
  NODE_ENV: {
    required: true,
    description: 'Application environment (development, production, test)',
    validValues: ['development', 'production', 'test']
  },
  PORT: {
    required: false,
    description: 'Server port number',
    defaultValue: '3000',
    validator: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0
  },
  
  // Database Configuration
  MONGOURI: {
    required: true,
    description: 'MongoDB connection string',
    validator: (value) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://')
  },
  
  // Authentication Secrets
  JWT_SECRET: {
    required: true,
    description: 'JWT signing secret',
    validator: (value) => value.length >= 32
  },
  SESSION_SECRET: {
    required: true,
    description: 'Session signing secret',
    validator: (value) => value.length >= 32
  },
  
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: {
    required: true,
    description: 'Google OAuth client ID'
  },
  GOOGLE_CLIENT_SECRET: {
    required: true,
    description: 'Google OAuth client secret'
  },
  
  // Razorpay Configuration
  RAZORPAY_KEY_ID: {
    required: true,
    description: 'Razorpay API key ID',
    validator: (value) => value.startsWith('rzp_test_') || value.startsWith('rzp_live_')
  },
  RAZORPAY_KEY_SECRET: {
    required: true,
    description: 'Razorpay API key secret'
  },
  
  // Email Configuration
  MAIL_USER: {
    required: true,
    description: 'Email service username'
  },
  MAIL_PASS: {
    required: true,
    description: 'Email service password'
  },
  
  // Client Configuration
  CLIENT_URL: {
    required: true,
    description: 'Frontend client URL',
    validator: (value) => value.startsWith('http://') || value.startsWith('https://')
  }
};

/**
 * Validation errors collection
 */
class ValidationError extends Error {
  constructor(errors) {
    super(`Environment validation failed:\n${errors.join('\n')}`);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Validates a single environment variable
 * @param {string} key - Environment variable name
 * @param {object} config - Variable configuration
 * @returns {object} Validation result
 */
function validateEnvironmentVariable(key, config) {
  const value = process.env[key];
  const errors = [];
  
  // Check if required variable is missing
  if (config.required && (!value || value.trim() === '')) {
    errors.push(`${key} is required but not set. ${config.description}`);
    return { valid: false, errors, value: config.defaultValue };
  }
  
  // Use default value if not set and not required
  const finalValue = value || config.defaultValue;
  
  // Validate against allowed values
  if (config.validValues && finalValue && !config.validValues.includes(finalValue)) {
    errors.push(`${key} must be one of: ${config.validValues.join(', ')}. Got: ${finalValue}`);
  }
  
  // Run custom validator
  if (config.validator && finalValue && !config.validator(finalValue)) {
    errors.push(`${key} failed validation. ${config.description}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    value: finalValue
  };
}

/**
 * Validates all required environment variables
 * @returns {object} Validation result with config object
 */
export function validateEnvironment() {
  const errors = [];
  const config = {};
  
  console.log('🔍 Validating environment configuration...');
  
  // Validate each required environment variable
  for (const [key, varConfig] of Object.entries(REQUIRED_ENV_VARS)) {
    const result = validateEnvironmentVariable(key, varConfig);
    
    if (!result.valid) {
      errors.push(...result.errors);
    } else {
      config[key] = result.value;
      console.log(`✅ ${key}: configured`);
    }
  }
  
  // Check for production-specific requirements
  if (config.NODE_ENV === 'production') {
    console.log('🔒 Validating production-specific requirements...');
    
    // Ensure secrets are strong in production
    if (config.JWT_SECRET && config.JWT_SECRET.includes('default')) {
      errors.push('JWT_SECRET should not contain default values in production');
    }
    
    if (config.SESSION_SECRET && config.SESSION_SECRET.includes('default')) {
      errors.push('SESSION_SECRET should not contain default values in production');
    }
    
    // Ensure HTTPS in production
    if (config.CLIENT_URL && !config.CLIENT_URL.startsWith('https://')) {
      console.warn('⚠️  CLIENT_URL should use HTTPS in production');
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`   ${error}`));
    throw new ValidationError(errors);
  }
  
  console.log('✅ Environment validation passed');
  return {
    valid: true,
    config,
    errors: []
  };
}

/**
 * Gets configuration value by key
 * @param {string} key - Configuration key
 * @returns {string} Configuration value
 */
export function getConfig(key) {
  return process.env[key];
}

/**
 * Checks if running in development mode
 * @returns {boolean}
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Checks if running in production mode
 * @returns {boolean}
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Checks if running in test mode
 * @returns {boolean}
 */
export function isTest() {
  return process.env.NODE_ENV === 'test';
}

/**
 * Gets the current environment
 * @returns {string}
 */
export function getEnvironment() {
  return process.env.NODE_ENV || 'development';
}

/**
 * Gets all configuration as an object
 * @returns {object}
 */
export function getAllConfig() {
  const config = {};
  for (const key of Object.keys(REQUIRED_ENV_VARS)) {
    config[key] = process.env[key];
  }
  return config;
}

export default {
  validateEnvironment,
  getConfig,
  isDevelopment,
  isProduction,
  isTest,
  getEnvironment,
  getAllConfig
};