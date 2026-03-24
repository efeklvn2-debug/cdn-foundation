// Environment configuration and validation
export interface EnvironmentConfig {
  VITE_API_BASE_URL: string;
  VITE_GOOGLE_ANALYTICS_ID?: string;
  VITE_HOTJAR_ID?: string;
  VITE_SENTRY_DSN?: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

// Validate environment variables
function validateEnvironment(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
    VITE_GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    VITE_HOTJAR_ID: import.meta.env.VITE_HOTJAR_ID,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    NODE_ENV: import.meta.env.MODE || 'development',
  };

  // Validate required environment variables
  if (!config.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not set, using default: /api');
    config.VITE_API_BASE_URL = '/api';
  }

  // Log environment in development
  if (config.NODE_ENV === 'development') {
    console.log('Environment Configuration:', {
      VITE_API_BASE_URL: config.VITE_API_BASE_URL,
      VITE_GOOGLE_ANALYTICS_ID: config.VITE_GOOGLE_ANALYTICS_ID ? '***' : undefined,
      VITE_HOTJAR_ID: config.VITE_HOTJAR_ID ? '***' : undefined,
      VITE_SENTRY_DSN: config.VITE_SENTRY_DSN ? '***' : undefined,
      NODE_ENV: config.NODE_ENV,
    });
  }

  return config;
}

export const environment = validateEnvironment();

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.hotjar.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.google-analytics.com https://*.hotjar.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
};

// CORS configuration
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://emerhana-foundation.org', 'https://www.emerhana-foundation.org']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Email service configuration
export const emailConfig = {
  from: 'noreply@emerhana-foundation.org',
  to: 'info@emerhana-foundation.org',
  replyTo: 'info@emerhana-foundation.org',
};

// API response configuration
export const apiConfig = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
};

// Performance monitoring configuration
export const performanceConfig = {
  sampleRate: 0.1, // 10% of users
  trackWebVitals: true,
  trackUserInteractions: true,
  trackFormSubmissions: true,
  trackPageLoads: true,
};

// Error handling configuration
export const errorConfig = {
  logErrors: true,
  sendToSentry: true,
  showUserFriendlyMessage: true,
  maxErrorReports: 100,
  errorReportInterval: 60000, // 1 minute
};