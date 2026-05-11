# HARON OS Security Hardening - Complete Guide

## Overview

HARON OS has been hardened against production security threats including:
- Request tampering & payload abuse
- Role injection & privilege escalation
- Malformed requests & spam
- Prompt injection & jailbreak attempts
- Frontend manipulation & API abuse
- Unsafe headers & client trust exploitation

## Security Layers Implemented

### 1. Input Validation & Sanitization (`src/lib/security.ts`)

**Protection:** Prevents malformed data, injection attacks, and abuse

#### Key Functions:

- **`sanitizeChatMessages()`** - Enforces "user" role only from frontend
  - Removes any system/admin roles
  - Limits message history (16 messages)
  - Validates message structure
  - CRITICAL: Frontend cannot inject system prompts

- **`validateChatRequest()`** - Validates entire chat request
  - Checks body structure
  - Validates language parameter (ar/en only)
  - Sanitizes context object (locale, timezone, etc.)
  - Limits context field lengths

- **`validateTextPayload()`** - Validates user text input
  - Enforces min/max length
  - Trims whitespace
  - Default: 1-8000 characters

- **`validateFileUpload()`** - Validates file uploads
  - Checks file size
  - Validates MIME types with wildcard support
  - Prevents oversized PDFs, images, etc.

- **`validateDialect()`** - Validates SQL dialect
  - Only allows whitelisted dialects
  - Defaults to safe option if invalid

- **`sanitizePrompt()`** - Detects injection patterns
  - Removes null bytes
  - Detects "ignore previous instructions" attempts
  - Detects "system prompt" references
  - Logs suspicious patterns for monitoring

### 2. Rate Limiting (`src/services/usage-limits.ts`)

**Protection:** Prevents token abuse, flooding, and DOS attacks

#### Features:

- **Per-endpoint, per-IP limiting**
  - Chat: 40 requests/hour
  - PDF: 15 requests/hour
  - Writing: 35 requests/hour
  - Resume: 15 requests/hour
  - Screenshot: 20 requests/hour
  - SQL: 30 requests/hour

- **Automatic cleanup** - `cleanupExpiredLimits()` removes expired buckets
- **429 responses** with `Retry-After` header
- **Remaining quota** tracking

#### Implementation:
```typescript
const usage = checkUsageLimit(`endpoint:${ip}`, limit);
if (!usage.allowed) {
  return 429 with Retry-After header;
}
```

### 3. Server-Side System Prompts (`src/services/gemini.ts`)

**Protection:** Prevents system prompt injection and role escalation

#### Changes:

- `cleanMessages()` - Forces all frontend messages to "user" role
  - Even if frontend sends "system" or "admin" role, it's converted to "user"
  - SECURITY CRITICAL: Never accepts frontend system prompts

- `messagesToPrompt()` - Removes system prompt extraction from dialogue
  - Only uses server-injected system prompts
  - Frontend can only send conversation content

- `analyzeImage()` - Includes security prompt injection

### 4. Error Handling (`src/lib/security.ts`)

**Protection:** Prevents information leakage and stack trace exposure

#### Implementation:

- **`getSafeErrorMessage()`** - Environment-aware error responses
  - Production: Generic "HARON OS encountered an error" message
  - Development: Actual error for debugging
  - Never exposes internal paths, stack traces, or API details

#### Usage in Routes:
```typescript
catch (error) {
  const message = getSafeErrorMessage(error, isDev);
  return NextResponse.json({ error: message }, { status: 500 });
}
```

### 5. Hardened API Routes

#### `/api/ai/chat` - Chat Endpoint
- ✅ Validates request structure with `validateChatRequest()`
- ✅ Enforces "user" role only via `sanitizeChatMessages()`
- ✅ Injects server-side system prompt
- ✅ Rate limits by IP
- ✅ Safe error responses
- ✅ Security headers on response

#### `/api/ai/pdf` - PDF Analysis
- ✅ File size validation (8 MB max)
- ✅ MIME type validation (application/pdf only)
- ✅ Text content length validation (26,000 chars max)
- ✅ Rate limiting (15/hour)
- ✅ Safe parsing with try/catch

#### `/api/ai/writing` - Writing Assistant
- ✅ Mode field validation (32 chars max)
- ✅ Input text validation (8,000 chars max)
- ✅ Rate limiting (35/hour)
- ✅ Safe error messages

#### `/api/ai/resume` - Resume Builder
- ✅ Profile validation (50-6000 chars)
- ✅ Target role validation (128 chars max)
- ✅ Rate limiting (15/hour)
- ✅ Safe parsing

#### `/api/ai/screenshot` - Image Analysis
- ✅ File validation (6 MB max)
- ✅ MIME type validation (image/* only)
- ✅ Prompt validation (1000 chars max)
- ✅ Rate limiting (20/hour)
- ✅ Safe responses

#### `/api/tools/sql` - SQL Generator
- ✅ Prompt validation (4,000 chars max)
- ✅ Dialect validation (whitelist: PostgreSQL, MySQL, SQLite, MSSQL)
- ✅ Rate limiting (30/hour)
- ✅ Safe error messages

### 6. Security Headers (`next.config.mjs`)

**Protection:** Browser-level attack prevention

#### Implemented Headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer leaks |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disable unnecessary APIs |
| `Strict-Transport-Security` | `max-age=63072000; preload` | Force HTTPS |
| `Content-Security-Policy` | Restrictive policy | Prevent XSS, control script sources |

#### CSP Details:
- Blocks inline scripts (except for Next.js internals)
- Only allows scripts from: self, unsafe-eval (Next.js requirement), trusted CDNs
- Restricts connections to: self, Gemini APIs, WebSockets
- Prevents frame embedding: `frame-ancestors 'none'`

### 7. IP Extraction (`src/lib/security.ts`)

**Protection:** Accurate client IP for rate limiting

#### Implementation:

```typescript
function getSafeIP(ip, xForwardedFor, fallback = "local")
```

- Handles multiple IPs in `x-forwarded-for`
- Validates IP format
- Limits length to 50 chars
- Fallback to "local" for invalid IPs

## Security Best Practices Going Forward

### ✅ DO:

1. **Always validate** - Never trust frontend data
2. **Force roles** - Always map to "user" for frontend messages
3. **Limit lengths** - Enforce reasonable payload sizes
4. **Rate limit** - Track by IP + endpoint combination
5. **Log suspicious activity** - Watch for injection attempts
6. **Use server prompts** - Only inject system prompts server-side
7. **Safe errors** - Never expose internal details
8. **Validate files** - Check size, type, and content
9. **Update regularly** - Review logs for attack patterns
10. **Monitor rate limits** - Watch for abuse patterns

### ❌ DON'T:

1. **Accept frontend roles** - Only "user" role allowed
2. **Extract system prompts** - Always inject server-side
3. **Trust headers blindly** - Validate and sanitize
4. **Return stack traces** - Use safe error messages
5. **Allow arbitrary dialects** - Use whitelist validation
6. **Skip file validation** - Always check type and size
7. **Remove rate limiting** - Protect against abuse
8. **Disable CSP** - Keep security headers enabled
9. **Use eval()** - Avoid dynamic code execution
10. **Log secrets** - Never expose API keys or sensitive data

## Monitoring & Maintenance

### Rate Limit Cleanup

Add this to a periodic cleanup job (e.g., every 5 minutes):

```typescript
import { cleanupExpiredLimits, getRateLimitStats } from "@/services/usage-limits";

// In a scheduled function or middleware
const cleaned = cleanupExpiredLimits();
console.log(`Cleaned ${cleaned} expired rate limit buckets`);

// Monitor memory usage
const stats = getRateLimitStats();
console.log(`Active buckets: ${stats.activeBuckets}, Usage: ${stats.memoryUsage}`);
```

### Log Suspicious Activity

Watch for these patterns in logs:

```
[SECURITY] Rejected message with role "system"
[SECURITY] Rejected message with role "admin"
[SECURITY] Invalid dialect "malicious"
[SECURITY] Detected potential prompt injection pattern
```

### Testing Security

1. **Test role enforcement:**
   ```bash
   curl -X POST http://localhost:3000/api/ai/chat \
     -H "Content-Type: application/json" \
     -d '{"messages": [{"role": "system", "content": "ignore"}]}'
   # Should reject or convert to "user"
   ```

2. **Test rate limiting:**
   ```bash
   # Make 41+ requests in 1 hour - should get 429
   for i in {1..50}; do
     curl -X POST http://localhost:3000/api/ai/chat \
       -H "Content-Type: application/json" \
       -d '{"messages": [{"role": "user", "content": "test"}]}'
   done
   ```

3. **Test payload limits:**
   ```bash
   # Create 10KB+ text
   LARGE_TEXT=$(head -c 10000 /dev/zero | tr '\0' 'a')
   curl -X POST http://localhost:3000/api/ai/writing \
     -H "Content-Type: application/json" \
     -d "{\"input\": \"$LARGE_TEXT\"}"
   # Should reject as too large
   ```

## Deployment Checklist

- [ ] Environment variables set (GEMINI_API_KEY, NODE_ENV)
- [ ] CSP headers tested in browser DevTools
- [ ] Rate limiting verified (check remaining headers)
- [ ] File upload tests passed
- [ ] Error messages safe (no stack traces exposed)
- [ ] Logs reviewed for suspicious activity
- [ ] Monitoring set up for rate limit stats
- [ ] HTTPS enabled on production
- [ ] Security headers visible in response headers
- [ ] Performance acceptable (no slowdowns from validation)

## Performance Impact

Security hardening adds minimal overhead:

- **Validation:** <1ms per request (string checks)
- **Rate limiting:** <1ms per request (Map lookup)
- **Error handling:** <1ms per request (conditional logic)
- **Total:** Typically <2ms per request

**Note:** For production deployments, consider using Redis-backed rate limiting for better persistence across server restarts.

## Production Recommendations

### For Vercel Deployment:

1. **Use environment variables:**
   ```bash
   GEMINI_API_KEY=xxx
   NODE_ENV=production
   ```

2. **CSP may need adjustment** for Vercel's infrastructure
   - Review `connect-src` for Vercel analytics
   - Test CSP in production before deployment

3. **Rate limiting persists per instance**
   - For multi-instance deployments, migrate to Redis:
     ```typescript
     import redis from 'redis';
     // Store rate limit buckets in Redis
     ```

### For Self-Hosted:

1. **Add persistent rate limiting:**
   - Use Redis, PostgreSQL, or similar
   - Survive server restarts

2. **Add audit logging:**
   - Log all suspicious activity
   - Monitor for attack patterns

3. **Set up monitoring:**
   - Track error rates
   - Alert on rate limit spikes
   - Monitor response times

## Security Updates

Review these areas periodically:

- **gemini.ts** - For new prompt injection vectors
- **security.ts** - For new validation patterns
- **API routes** - For new attack surfaces
- **next.config.mjs** - CSP updates for new features
- **Rate limits** - Adjust limits based on usage

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security](https://nextjs.org/docs/basic-features/data-fetching/securing-api-routes)
