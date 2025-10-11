/**
 * Application Configuration
 * Centralized environment variables and configuration
 */

export const config = {
  // Base URL - automatically uses environment variable or falls back to localhost
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001',
  
  // API Base URL (for internal API calls, usually relative)
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  
  // Email/SMTP
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  
  // App Info
  app: {
    name: 'Corpulate',
    description: 'Business Management Platform',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@corpulate.com',
  },
};

/**
 * Get full URL for a path
 * @param {string} path - The path to append to base URL
 * @returns {string} Full URL
 */
export function getFullUrl(path = '') {
  const baseUrl = config.baseUrl.endsWith('/') 
    ? config.baseUrl.slice(0, -1) 
    : config.baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get API endpoint URL
 * @param {string} endpoint - The API endpoint path
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint = '') {
  const apiUrl = config.apiUrl.endsWith('/') 
    ? config.apiUrl.slice(0, -1) 
    : config.apiUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${apiUrl}${cleanEndpoint}`;
}

export default config;

