interface SecurityConfig {
  enableCSP: boolean;
  enableXSSProtection: boolean;
  enableClickjackingProtection: boolean;
  enableHTTPSRedirect: boolean;
  enableRateLimiting: boolean;
  enableCSRFProtection: boolean;
  enableHSTS: boolean;
  securityHeaders: Record<string, string>;
}

interface SecurityViolation {
  type: 'csp' | 'xss' | 'csrf' | 'rate_limit' | 'auth' | 'data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class SecurityService {
  private config: SecurityConfig;
  private violations: SecurityViolation[] = [];
  private requestCount = new Map<string, { count: number; resetTime: number }>();
  private csrfToken: string | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.initializeSecurity();
  }

  private loadConfig(): SecurityConfig {
    const defaultConfig: SecurityConfig = {
      enableCSP: true,
      enableXSSProtection: true,
      enableClickjackingProtection: true,
      enableHTTPSRedirect: true,
      enableRateLimiting: true,
      enableCSRFProtection: true,
      enableHSTS: true,
      securityHeaders: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.google-analytics.com https://*.hotjar.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    };

    return defaultConfig;
  }

  private initializeSecurity() {
    // Apply security headers
    if (this.config.enableCSP) {
      this.applySecurityHeaders();
    }

    // Initialize CSRF protection
    if (this.config.enableCSRFProtection) {
      this.initializeCSRFProtection();
    }

    // Set up rate limiting
    if (this.config.enableRateLimiting) {
      this.setupRateLimiting();
    }

    // Monitor for security violations
    this.monitorSecurityViolations();

    // Set up HTTPS redirect
    if (this.config.enableHTTPSRedirect) {
      this.setupHTTPSRedirect();
    }
  }

  private applySecurityHeaders() {
    if (typeof document !== 'undefined') {
      // Apply CSP to document
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = this.config.securityHeaders['Content-Security-Policy'];
      document.head.appendChild(cspMeta);
    }

    // Apply headers to fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options = {}] = args;
      
      // Add security headers
      const headers = {
        ...options.headers,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      };

      // Add CSRF token if available
      if (this.csrfToken && this.config.enableCSRFProtection) {
        headers['X-CSRF-Token'] = this.csrfToken;
      }

      return originalFetch(url, { ...options, headers });
    };
  }

  private initializeCSRFProtection() {
    // Generate CSRF token
    this.csrfToken = this.generateCSRFToken();
    
    // Store token in a cookie
    if (typeof document !== 'undefined') {
      document.cookie = `csrf_token=${this.csrfToken}; path=/; secure; HttpOnly; SameSite=Strict`;
    }

    // Add CSRF token to forms
    this.addCSRFTokenToForms();
  }

  private generateCSRFToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private addCSRFTokenToForms() {
    if (typeof document === 'undefined') return;

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = 'csrf_token';
      csrfInput.value = this.csrfToken || '';
      form.appendChild(csrfInput);
    });
  }

  private setupRateLimiting() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url] = args;
      const clientIP = this.getClientIP();
      
      // Check rate limit
      if (this.isRateLimited(clientIP)) {
        this.addSecurityViolation({
          type: 'rate_limit',
          severity: 'medium',
          message: 'Rate limit exceeded',
          context: { url, clientIP },
        });
        
        throw new Error('Rate limit exceeded');
      }

      // Increment request count
      this.incrementRequestCount(clientIP);

      return originalFetch(...args);
    };
  }

  private getClientIP(): string {
    // In a real implementation, you'd get the IP from the server
    // For client-side, we'll use a placeholder
    return 'client-ip-placeholder';
  }

  private isRateLimited(clientIP: string): boolean {
    const now = Date.now();
    const clientData = this.requestCount.get(clientIP);
    
    if (!clientData || now > clientData.resetTime) {
      return false;
    }

    return clientData.count > 100; // 100 requests per window
  }

  private incrementRequestCount(clientIP: string) {
    const now = Date.now();
    const windowTime = 15 * 60 * 1000; // 15 minutes
    const resetTime = now + windowTime;

    const clientData = this.requestCount.get(clientIP) || {
      count: 0,
      resetTime,
    };

    clientData.count++;
    clientData.resetTime = resetTime;
    this.requestCount.set(clientIP, clientData);
  }

  private setupHTTPSRedirect() {
    if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
      window.location.href = window.location.href.replace('http://', 'https://');
    }
  }

  private monitorSecurityViolations() {
    // Monitor for CSP violations
    if (typeof window !== 'undefined') {
      window.addEventListener('securitypolicyviolation', (event) => {
        this.addSecurityViolation({
          type: 'csp',
          severity: 'high',
          message: `CSP violation: ${event.disposition}`,
          context: {
            blockedURL: event.blockedURL,
            violatedDirective: event.violatedDirective,
            originalPolicy: event.originalPolicy,
          },
        });
      });

      // Monitor for XSS attempts
      window.addEventListener('error', (event) => {
        if (event.message.includes('XSS') || event.message.includes('script')) {
          this.addSecurityViolation({
            type: 'xss',
            severity: 'critical',
            message: 'Potential XSS attack detected',
            context: {
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
            },
          });
        }
      });
    }
  }

  private addSecurityViolation(violation: SecurityViolation) {
    this.violations.push({
      ...violation,
      timestamp: new Date().toISOString(),
    });

    // Log to console in development
    if (import.meta.env.MODE === 'development') {
      console.warn('Security Violation:', violation);
    }

    // Send to security monitoring service in production
    if (import.meta.env.MODE === 'production') {
      this.sendSecurityViolation(violation);
    }
  }

  private async sendSecurityViolation(violation: SecurityViolation) {
    try {
      await fetch('/api/security/violations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(violation),
      });
    } catch (error) {
      console.error('Failed to send security violation:', error);
    }
  }

  // Public methods
  sanitizeInput(input: string): string {
    // Basic HTML sanitization
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  encryptData(data: string): string {
    // In a real implementation, you'd use proper encryption
    // This is a placeholder
    return btoa(data);
  }

  decryptData(encryptedData: string): string {
    // In a real implementation, you'd use proper decryption
    // This is a placeholder
    return atob(encryptedData);
  }

  getSecurityViolations(): SecurityViolation[] {
    return [...this.violations];
  }

  clearSecurityViolations() {
    this.violations = [];
  }

  getCSRFToken(): string | null {
    return this.csrfToken;
  }

  refreshCSRFToken(): void {
    this.csrfToken = this.generateCSRFToken();
    this.addCSRFTokenToForms();
  }

  // Security audit utilities
  runSecurityAudit(): SecurityViolation[] {
    const auditViolations: SecurityViolation[] = [];

    // Check for exposed sensitive data
    if (typeof document !== 'undefined') {
      const bodyText = document.body.innerText;
      const sensitivePatterns = [
        /password\s*[:=]\s*\S+/i,
        /api[_-]?key\s*[:=]\s*\S+/i,
        /secret\s*[:=]\s*\S+/i,
        /token\s*[:=]\s*\S+/i,
      ];

      sensitivePatterns.forEach(pattern => {
        if (pattern.test(bodyText)) {
          auditViolations.push({
            type: 'data',
            severity: 'high',
            message: 'Potential sensitive data exposure',
            context: { pattern: pattern.toString() },
          });
        }
      });
    }

    // Check for insecure HTTP
    if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
      auditViolations.push({
        type: 'auth',
        severity: 'high',
        message: 'Using insecure HTTP protocol',
        context: { protocol: window.location.protocol },
      });
    }

    this.violations = [...this.violations, ...auditViolations];
    return auditViolations;
  }
}

export const securityService = new SecurityService();

// React hook for security
export function useSecurity() {
  const sanitizeInput = (input: string) => {
    return securityService.sanitizeInput(input);
  };

  const validateEmail = (email: string) => {
    return securityService.validateEmail(email);
  };

  const validateUrl = (url: string) => {
    return securityService.validateUrl(url);
  };

  const getCSRFToken = () => {
    return securityService.getCSRFToken();
  };

  const refreshCSRFToken = () => {
    securityService.refreshCSRFToken();
  };

  const runSecurityAudit = () => {
    return securityService.runSecurityAudit();
  };

  return {
    sanitizeInput,
    validateEmail,
    validateUrl,
    getCSRFToken,
    refreshCSRFToken,
    runSecurityAudit,
    violations: securityService.getSecurityViolations(),
  };
}