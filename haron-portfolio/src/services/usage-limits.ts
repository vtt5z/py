const memoryWindow = new Map<string, { count: number; resetAt: number }>();

export function checkUsageLimit(key: string, limit = 25, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const current = memoryWindow.get(key);

  if (!current || current.resetAt < now) {
    memoryWindow.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  memoryWindow.set(key, current);
  return { allowed: true, remaining: limit - current.count };
}
