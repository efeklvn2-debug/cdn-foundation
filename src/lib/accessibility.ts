interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'light' | 'dark' | 'auto';
}

interface AccessibilityViolation {
  element: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

class AccessibilityService {
  private config: AccessibilityConfig;
  private violations: AccessibilityViolation[] = [];

  constructor() {
    this.config = this.loadConfig();
    this.initializeAccessibility();
  }

  private loadConfig(): AccessibilityConfig {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('accessibility-config');
    const defaultConfig: AccessibilityConfig = {
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      fontSize: 'medium',
      colorScheme: 'auto',
    };

    return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
  }

  private initializeAccessibility() {
    // Apply accessibility settings
    this.applyHighContrast();
    this.applyReducedMotion();
    this.applyFontSize();
    this.applyColorScheme();

    // Set up keyboard navigation
    this.setupKeyboardNavigation();
    
    // Set up ARIA live regions
    this.setupLiveRegions();

    // Monitor for accessibility violations
    this.monitorAccessibility();
  }

  private applyHighContrast() {
    if (this.config.highContrast) {
      document.documentElement.classList.add('high-contrast');
      document.documentElement.style.filter = 'contrast(1.5)';
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.documentElement.style.filter = '';
    }
  }

  private applyReducedMotion() {
    if (this.config.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
      document.documentElement.style.animationDuration = '0.01ms';
      document.documentElement.style.transitionDuration = '0.01ms';
    } else {
      document.documentElement.classList.remove('reduce-motion');
      document.documentElement.style.animationDuration = '';
      document.documentElement.style.transitionDuration = '';
    }
  }

  private applyFontSize() {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };

    document.documentElement.style.fontSize = sizes[this.config.fontSize];
  }

  private applyColorScheme() {
    if (this.config.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (this.config.colorScheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto: follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  private setupKeyboardNavigation() {
    // Add keyboard event listeners
    document.addEventListener('keydown', (e) => {
      // Skip to main content (0 key)
      if (e.key === '0') {
        const main = document.querySelector('main');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
        }
      }

      // Escape key to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          if (modal instanceof HTMLElement) {
            modal.close();
          }
        });
      }
    });

    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      *:focus:not(:focus-visible) {
        outline: none;
      }
      *:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  private setupLiveRegions() {
    // Create ARIA live region for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('data-live-region', 'true');
    document.body.appendChild(liveRegion);

    // Store reference for later use
    (window as any).accessibilityLiveRegion = liveRegion;
  }

  private monitorAccessibility() {
    // Monitor for common accessibility issues
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              this.checkElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private checkElement(element: Element) {
    // Check for missing alt text on images
    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        this.addViolation({
          element: 'img',
          rule: 'alt-text',
          message: 'Image missing alt text',
          severity: 'error',
        });
      }
    }

    // Check for missing labels on inputs
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      const input = element as HTMLInputElement | HTMLTextAreaElement;
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        this.addViolation({
          element: input.tagName,
          rule: 'label',
          message: 'Input missing label',
          severity: 'error',
        });
      }
    }

    // Check for color contrast
    if (element.hasAttribute('style')) {
      const style = element.getAttribute('style');
      if (style && style.includes('color:')) {
        this.checkColorContrast(element);
      }
    }
  }

  private checkColorContrast(element: Element) {
    // Simplified color contrast check
    // In a real implementation, you'd use a proper color contrast library
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    // Basic check (simplified)
    if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
      this.addViolation({
        element: element.tagName,
        rule: 'color-contrast',
        message: 'Poor color contrast detected',
        severity: 'warning',
      });
    }
  }

  private addViolation(violation: AccessibilityViolation) {
    this.violations.push(violation);
    console.warn(`Accessibility Violation: ${violation.message}`, violation);
  }

  // Public methods
  updateConfig(newConfig: Partial<AccessibilityConfig>) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('accessibility-config', JSON.stringify(this.config));
    
    // Reapply settings
    this.applyHighContrast();
    this.applyReducedMotion();
    this.applyFontSize();
    this.applyColorScheme();
  }

  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  announceToScreenReader(message: string) {
    const liveRegion = (window as any).accessibilityLiveRegion;
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after a delay
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  skipToContent() {
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      this.announceToScreenReader('Skipped to main content');
    }
  }

  getViolations(): AccessibilityViolation[] {
    return [...this.violations];
  }

  clearViolations() {
    this.violations = [];
  }

  // Accessibility testing utilities
  runAccessibilityCheck(): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];

    // Check all images
    document.querySelectorAll('img').forEach((img) => {
      if (!img.getAttribute('alt')) {
        violations.push({
          element: 'img',
          rule: 'alt-text',
          message: 'Image missing alt text',
          severity: 'error',
        });
      }
    });

    // Check all forms
    document.querySelectorAll('form').forEach((form) => {
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach((input) => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
          violations.push({
            element: input.tagName,
            rule: 'label',
            message: 'Form input missing label',
            severity: 'error',
          });
        }
      });
    });

    // Check for heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        violations.push({
          element: heading.tagName,
          rule: 'heading-structure',
          message: 'Heading level skipped',
          severity: 'warning',
        });
      }
      lastLevel = level;
    });

    this.violations = violations;
    return violations;
  }
}

export const accessibilityService = new AccessibilityService();

// React hook for accessibility
export function useAccessibility() {
  const updateConfig = (newConfig: Partial<AccessibilityConfig>) => {
    accessibilityService.updateConfig(newConfig);
  };

  const announceToScreenReader = (message: string) => {
    accessibilityService.announceToScreenReader(message);
  };

  const skipToContent = () => {
    accessibilityService.skipToContent();
  };

  const runAccessibilityCheck = () => {
    return accessibilityService.runAccessibilityCheck();
  };

  return {
    config: accessibilityService.getConfig(),
    updateConfig,
    announceToScreenReader,
    skipToContent,
    runAccessibilityCheck,
  };
}

// Accessibility utilities
export const accessibilityUtils = {
  // Generate unique IDs for aria-labelledby
  generateId: (prefix: string = 'id'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create accessible labels
  createLabel: (text: string, htmlFor?: string): string => {
    return htmlFor ? `${text} (${htmlFor})` : text;
  },

  // Check if element is visible
  isElementVisible: (element: Element): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  },

  // Get element position for screen readers
  getElementPosition: (element: Element): { top: number; left: number } => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
  },
};