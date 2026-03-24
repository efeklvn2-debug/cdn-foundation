interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = import.meta.env.MODE === 'development';

  private createLogEntry(level: LogEntry['level'], message: string, context?: Record<string, any>, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (error) {
      entry.stack = error.stack;
      entry.context = {
        ...context,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      };
    }

    return entry;
  }

  private log(entry: LogEntry) {
    // Add to in-memory logs
    this.logs.push(entry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (this.isDevelopment) {
      const logMethod = entry.level === 'error' ? 'error' : entry.level;
      console[logMethod](`[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`, entry.context || '');
    }

    // Send to error tracking service in production
    if (import.meta.env.MODE === 'production' && entry.level === 'error') {
      this.sendToErrorTracking(entry);
    }
  }

  private async sendToErrorTracking(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Don't log recursively
      console.error('Failed to send error to tracking service:', error);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log(this.createLogEntry('info', message, context));
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(this.createLogEntry('warn', message, context));
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(this.createLogEntry('error', message, context, error));
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log(this.createLogEntry('debug', message, context));
    }
  }

  // Log API requests
  logApiRequest(url: string, method: string, status: number, duration: number, context?: Record<string, any>) {
    this.info(`API ${method} ${url}`, {
      status,
      duration,
      ...context,
    });
  }

  // Log user interactions
  logUserInteraction(action: string, element?: string, context?: Record<string, any>) {
    this.debug('User interaction', {
      action,
      element,
      ...context,
    });
  }

  // Log form submissions
  logFormSubmission(formType: string, success: boolean, duration: number, context?: Record<string, any>) {
    this.info(`Form submission: ${formType}`, {
      success,
      duration,
      ...context,
    });
  }

  // Log performance metrics
  logPerformance(metric: string, value: number, context?: Record<string, any>) {
    this.debug(`Performance: ${metric}`, {
      value,
      ...context,
    });
  }

  // Log errors with context
  logError(error: Error, context?: Record<string, any>) {
    this.error('Application error', error, context);
  }

  // Get logs for debugging
  getLogs(level?: LogEntry['level']): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Error boundary for React components
export function createErrorHandler(componentName: string) {
  return (error: Error, errorInfo: React.ErrorInfo) => {
    logger.error(`Error in ${componentName}`, error, {
      componentStack: errorInfo.componentStack,
    });
  };
}

// Async error wrapper
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string,
  logger: Logger
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    logger.error(`Error in ${context}`, error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}