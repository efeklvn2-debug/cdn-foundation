interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
  };
}

class AnalyticsService {
  private initialized = false;
  private userId: string | null = null;

  initialize() {
    if (this.initialized) return;

    // Initialize Google Analytics
    if (typeof window !== 'undefined' && import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
      this.loadGoogleAnalytics();
    }

    // Initialize Hotjar
    if (typeof window !== 'undefined' && import.meta.env.VITE_HOTJAR_ID) {
      this.loadHotjar();
    }

    // Initialize Sentry for error tracking
    if (typeof window !== 'undefined' && import.meta.env.VITE_SENTRY_DSN) {
      this.loadSentry();
    }

    this.initialized = true;
  }

  private loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
      page_title: document.title,
      page_path: window.location.pathname,
      send_page_view: true,
    });
  }

  private loadHotjar() {
    (function(h, o, t, j, a, r) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments) };
      h._hjSettings = { hjid: import.meta.env.VITE_HOTJAR_ID, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  private loadSentry() {
    import('@sentry/react').then(({ init, BrowserTracing }) => {
      init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          new BrowserTracing({
            tracingOrigins: ['localhost', /^\//],
          }),
        ],
        tracesSampleRate: 1.0,
      });
    });
  }

  // Track page views
  trackPageView(path?: string, title?: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '', {
        page_title: title || document.title,
        page_path: path || window.location.pathname,
        send_page_view: true,
      });
    }
  }

  // Track custom events
  trackEvent(event: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }

    // Track with Hotjar if available
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('event', event, properties);
    }
  }

  // Track user interactions
  trackUserInteraction(action: string, element?: string, properties?: Record<string, any>) {
    this.trackEvent('user_interaction', {
      action,
      element,
      ...properties,
    });
  }

  // Track form submissions
  trackFormSubmission(formType: string, success: boolean, properties?: Record<string, any>) {
    this.trackEvent('form_submission', {
      form_type: formType,
      success,
      ...properties,
    });
  }

  // Track donations
  trackDonation(amount: number, paymentMethod: string, success: boolean) {
    this.trackEvent('donation', {
      amount,
      payment_method: paymentMethod,
      success,
      currency: 'NGN',
    });
  }

  // Set user ID for analytics
  setUserId(id: string) {
    this.userId = id;
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '', {
        user_id: id,
      });
    }
  }

  // Track performance metrics
  trackPerformance() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.trackEvent('performance', {
        page_load_time: navigation.loadEventEnd - navigation.startTime,
        dom_interactive_time: navigation.domInteractive - navigation.startTime,
        first_contentful_paint: navigation.responseStart - navigation.startTime,
      });
    }
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context,
      });
    }

    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }
}

export const analytics = new AnalyticsService();

// React hook for analytics
export function useAnalytics() {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    analytics.trackEvent(event, properties);
  };

  const trackUserInteraction = (action: string, element?: string, properties?: Record<string, any>) => {
    analytics.trackUserInteraction(action, element, properties);
  };

  const trackFormSubmission = (formType: string, success: boolean, properties?: Record<string, any>) => {
    analytics.trackFormSubmission(formType, success, properties);
  };

  const trackDonation = (amount: number, paymentMethod: string, success: boolean) => {
    analytics.trackDonation(amount, paymentMethod, success);
  };

  return {
    trackEvent,
    trackUserInteraction,
    trackFormSubmission,
    trackDonation,
  };
}