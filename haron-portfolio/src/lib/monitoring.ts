/**
 * HARON OS - Performance & Error Monitoring
 * 
 * Tracks:
 * - API errors
 * - Response times
 * - Rate limit hits
 * - AI request failures
 */

interface ErrorMetric {
  type: string;
  count: number;
  lastOccurrence: number;
  message?: string;
}

interface PerformanceMetric {
  endpoint: string;
  avgResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  totalRequests: number;
}

const errorMetrics = new Map<string, ErrorMetric>();
const performanceMetrics = new Map<string, PerformanceMetric>();

/**
 * PRODUCTION: Track API errors
 */
export function trackError(type: string, message?: string) {
  const existing = errorMetrics.get(type);
  
  if (existing) {
    existing.count++;
    existing.lastOccurrence = Date.now();
    if (message) existing.message = message;
  } else {
    errorMetrics.set(type, {
      type,
      count: 1,
      lastOccurrence: Date.now(),
      message,
    });
  }

  // Log in production for monitoring
  if (process.env.NODE_ENV === "production") {
    console.warn(`[ERROR METRIC] ${type}: ${message || "Unknown error"}`);
  }
}

/**
 * PRODUCTION: Track endpoint performance
 */
export function trackPerformance(endpoint: string, responseTimeMs: number) {
  const existing = performanceMetrics.get(endpoint);
  
  if (existing) {
    existing.totalRequests++;
    existing.avgResponseTime = 
      (existing.avgResponseTime * (existing.totalRequests - 1) + responseTimeMs) / 
      existing.totalRequests;
    existing.maxResponseTime = Math.max(existing.maxResponseTime, responseTimeMs);
    existing.minResponseTime = Math.min(existing.minResponseTime, responseTimeMs);
  } else {
    performanceMetrics.set(endpoint, {
      endpoint,
      avgResponseTime: responseTimeMs,
      maxResponseTime: responseTimeMs,
      minResponseTime: responseTimeMs,
      totalRequests: 1,
    });
  }
}

/**
 * PRODUCTION: Get error metrics snapshot
 */
export function getErrorMetrics(): Record<string, ErrorMetric> {
  const result: Record<string, ErrorMetric> = {};
  
  for (const [key, value] of errorMetrics.entries()) {
    result[key] = value;
  }
  
  return result;
}

/**
 * PRODUCTION: Get performance metrics snapshot
 */
export function getPerformanceMetrics(): Record<string, PerformanceMetric> {
  const result: Record<string, PerformanceMetric> = {};
  
  for (const [key, value] of performanceMetrics.entries()) {
    result[key] = value;
  }
  
  return result;
}

/**
 * PRODUCTION: Check if error rate is critical
 */
export function isErrorRateCritical(threshold = 0.1): boolean {
  let totalRequests = 0;
  let totalErrors = 0;

  for (const metric of errorMetrics.values()) {
    totalErrors += metric.count;
  }

  for (const metric of performanceMetrics.values()) {
    totalRequests += metric.totalRequests;
  }

  const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;
  return errorRate > threshold;
}

/**
 * PRODUCTION: Reset metrics (for testing or manual reset)
 */
export function resetMetrics() {
  errorMetrics.clear();
  performanceMetrics.clear();
}

/**
 * PRODUCTION: Generate performance report
 */
export function generateReport(): {
  errors: Record<string, ErrorMetric>;
  performance: Record<string, PerformanceMetric>;
  summary: {
    criticalErrorRate: boolean;
    avgResponseTime: number;
    totalRequests: number;
  };
} {
  const errors = getErrorMetrics();
  const performance = getPerformanceMetrics();
  
  let totalResponseTime = 0;
  let totalRequests = 0;

  for (const metric of Object.values(performance)) {
    totalResponseTime += metric.avgResponseTime * metric.totalRequests;
    totalRequests += metric.totalRequests;
  }

  return {
    errors,
    performance,
    summary: {
      criticalErrorRate: isErrorRateCritical(),
      avgResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      totalRequests,
    },
  };
}
