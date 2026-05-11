/**
 * HARON OS - Request retry and timeout utilities
 * 
 * Handles:
 * - API request retries
 * - Timeout management
 * - Graceful fallbacks
 * - Error recovery
 */

export interface RetryConfig {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  timeoutMs?: number;
}

/**
 * PRODUCTION: Retry logic with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {},
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 5000,
    backoffMultiplier = 2,
    timeoutMs = 30000,
  } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await withTimeout(fn(), timeoutMs);
    } catch (error) {
      lastError = error as Error;

      // Log retry attempt
      console.warn(
        `[HARON] Request attempt ${attempt + 1}/${maxRetries + 1} failed:`,
        lastError.message,
      );

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate exponential backoff
      const delay = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt),
        maxDelayMs,
      );

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Request failed after all retries");
}

/**
 * PRODUCTION: Timeout wrapper
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timeout after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ]);
}

/**
 * PRODUCTION: Graceful fallback for failed requests
 */
export function getFallbackResponse(context: string): string {
  const fallbacks: Record<string, string> = {
    chat: "I'm experiencing temporary issues. Please try again in a moment.",
    pdf: "Unable to process the document right now. Please try again.",
    writing: "The writing assistant is temporarily unavailable.",
    resume: "Resume builder is temporarily offline.",
    screenshot: "Image analysis is currently unavailable.",
    sql: "SQL generator encountered an issue.",
  };

  return (
    fallbacks[context] ||
    "HARON OS encountered a temporary issue. Please try again."
  );
}

/**
 * PRODUCTION: Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  // Retryable errors
  const retryable = [
    "timeout",
    "network",
    "econnrefused",
    "enotfound",
    "429", // Rate limit
    "503", // Service unavailable
    "502", // Bad gateway
    "504", // Gateway timeout
  ];

  return retryable.some((pattern) => message.includes(pattern));
}
