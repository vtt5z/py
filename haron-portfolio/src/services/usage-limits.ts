/**
 * HARON OS Rate Limiting
 * 
 * Prevents:
 * - Token abuse
 * - API flooding
 * - Spam attacks
 * - DOS attempts
 */

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const memoryWindow = new Map<string, RateLimitBucket>();

/**
 * SECURITY: Track rate limits by endpoint + IP
 * Returns remaining quota and allowed status
 */
export function checkUsageLimit(
  key: string,
  limit = 25,
  windowMs = 60 * 60 * 1000, // 1 hour default
): {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const current = memoryWindow.get(key);

  // Reset window if expired
  if (!current || current.resetAt < now) {
    memoryWindow.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  // Check if limit exceeded
  if (current.count >= limit) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  // Increment and allow
  current.count += 1;
  memoryWindow.set(key, current);
  return {
    allowed: true,
    remaining: limit - current.count,
  };
}

/**
 * SECURITY: Cleanup old entries to prevent memory leaks
 * Call periodically (e.g., every 5 minutes in production)
 */
export function cleanupExpiredLimits(): number {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, bucket] of memoryWindow.entries()) {
    if (bucket.resetAt < now) {
      memoryWindow.delete(key);
      cleaned++;
    }
  }

  return cleaned;
}

/**
 * SECURITY: Get current limit stats (for monitoring)
 */
export function getRateLimitStats(): {
  activeBuckets: number;
  memoryUsage: string;
} {
  return {
    activeBuckets: memoryWindow.size,
    memoryUsage: `~${(memoryWindow.size * 64) / 1024}KB`, // Rough estimate
  };
}

/**
 * SECURITY: Reset limit for testing/admin
 * Only use in protected admin endpoints
 */
export function resetRateLimit(key: string): boolean {
  return memoryWindow.delete(key);
}
