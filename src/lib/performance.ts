interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  apiResponseTime: number;
  renderTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    timeToInteractive: 0,
    apiResponseTime: 0,
    renderTime: 0,
  };

  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.initializeWebVitals();
    this.initializeAPIMonitoring();
    this.initializeRenderMonitoring();
  }

  private initializeWebVitals() {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[0];
        this.metrics.firstContentfulPaint = fcp.startTime;
        this.logMetric('firstContentfulPaint', fcp.startTime);
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lcp.startTime;
        this.logMetric('largestContentfulPaint', lcp.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[0];
        this.metrics.firstInputDelay = fid.processingStart - fid.startTime;
        this.logMetric('firstInputDelay', this.metrics.firstInputDelay);
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let cls = 0;
        entries.forEach((entry) => {
          cls += entry.value;
        });
        this.metrics.cumulativeLayoutShift = cls;
        this.logMetric('cumulativeLayoutShift', cls);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to Interactive
      const ttiObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const tti = entries[0];
        this.metrics.timeToInteractive = tti.startTime;
        this.logMetric('timeToInteractive', tti.startTime);
      });
      ttiObserver.observe({ entryTypes: ['navigation'] });
    }
  }

  private initializeAPIMonitoring() {
    // Monitor fetch API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.metrics.apiResponseTime = duration;
        this.logMetric('apiResponseTime', duration);
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.logMetric('apiResponseTime', duration, { error: true });
        throw error;
      }
    };
  }

  private initializeRenderMonitoring() {
    // Monitor React render performance
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      let lastFrameTime = 0;
      let frameCount = 0;
      let renderStartTime = 0;

      const measureRender = (time: number) => {
        if (renderStartTime) {
          const renderDuration = time - renderStartTime;
          this.metrics.renderTime = renderDuration;
          this.logMetric('renderTime', renderDuration);
        }
        renderStartTime = time;
        frameCount++;
        
        if (frameCount % 60 === 0) {
          this.logFrameRate();
        }
        
        window.requestAnimationFrame(measureRender);
      };

      window.requestAnimationFrame(measureRender);
    }
  }

  private logMetric(name: keyof PerformanceMetrics, value: number, context?: Record<string, any>) {
    console.log(`Performance Metric - ${name}: ${value}ms`, context || '');
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackEvent('performance_metric', {
        metric: name,
        value,
        ...context,
      });
    }
  }

  private logFrameRate() {
    if ('Performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.startTime;
      this.metrics.loadTime = loadTime;
      this.logMetric('loadTime', loadTime);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getPerformanceScore(): number {
    const weights = {
      loadTime: 0.2,
      firstContentfulPaint: 0.15,
      largestContentfulPaint: 0.15,
      firstInputDelay: 0.2,
      cumulativeLayoutShift: 0.15,
      timeToInteractive: 0.15,
    };

    const scores = {
      loadTime: Math.max(0, 100 - (this.metrics.loadTime / 3000) * 100),
      firstContentfulPaint: Math.max(0, 100 - (this.metrics.firstContentfulPaint / 2000) * 100),
      largestContentfulPaint: Math.max(0, 100 - (this.metrics.largestContentfulPaint / 4000) * 100),
      firstInputDelay: Math.max(0, 100 - (this.metrics.firstInputDelay / 100) * 100),
      cumulativeLayoutShift: Math.max(0, 100 - (this.metrics.cumulativeLayoutShift / 0.1) * 100),
      timeToInteractive: Math.max(0, 100 - (this.metrics.timeToInteractive / 5000) * 100),
    };

    let totalScore = 0;
    Object.keys(weights).forEach((key) => {
      const metricKey = key as keyof typeof weights;
      totalScore += scores[metricKey] * weights[metricKey];
    });

    return Math.round(totalScore);
  }

  stopMonitoring() {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Performance optimization utilities
  optimizeImages() {
    // Lazy load images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  }

  optimizeFonts() {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter-var.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
  }

  optimizeCSS() {
    // Remove unused CSS
    if ('CSS' in window && 'StyleSheetList' in window) {
      // This would require a more sophisticated CSS analysis
      console.log('CSS optimization not implemented');
    }
  }

  // Cache utilities
  enableCaching() {
    // Service Worker registration would go here
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered:', registration);
      }).catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformance() {
  const startMonitoring = () => {
    performanceMonitor.startMonitoring();
  };

  const stopMonitoring = () => {
    performanceMonitor.stopMonitoring();
  };

  const getMetrics = () => {
    return performanceMonitor.getMetrics();
  };

  const getPerformanceScore = () => {
    return performanceMonitor.getPerformanceScore();
  };

  return {
    startMonitoring,
    stopMonitoring,
    getMetrics,
    getPerformanceScore,
  };
}