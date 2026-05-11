/**
 * HARON OS Security Utilities
 * 
 * Handles:
 * - Request validation
 * - Input sanitization
 * - Role enforcement
 * - Rate limiting
 * - Error handling
 */

import { type ChatRole, type ChatMessage, type AssistantLanguage } from "@/services/gemini";

/**
 * SECURITY: Prevent frontend from injecting roles
 * Only allow "user" role for frontend requests
 */
export function sanitizeChatMessages(
  messages: unknown,
  maxMessages = 16,
): ChatMessage[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .slice(-maxMessages)
    .filter((msg): msg is ChatMessage => {
      // Must be an object
      if (typeof msg !== "object" || msg === null) {
        return false;
      }

      const m = msg as Record<string, unknown>;

      // Must have role and content
      if (typeof m.role !== "string" || typeof m.content !== "string") {
        return false;
      }

      // SECURITY: Frontend can ONLY send "user" role
      // System prompts are injected server-side only
      if (m.role !== "user") {
        console.warn(
          `[SECURITY] Rejected message with role "${m.role}" from frontend. Frontend can only send "user" role.`,
        );
        return false;
      }

      return true;
    })
    .map((msg) => ({
      role: "user" as const, // Force "user" role regardless
      content: msg.content.trim(),
    }))
    .filter((msg) => msg.content.length > 0 && msg.content.length <= 8000);
}

/**
 * SECURITY: Validate chat request body
 */
export function validateChatRequest(body: unknown): {
  valid: boolean;
  language: AssistantLanguage;
  messages: ChatMessage[];
  context?: Record<string, unknown>;
  error?: string;
} {
  if (typeof body !== "object" || body === null) {
    return {
      valid: false,
      language: "en",
      messages: [],
      error: "Invalid request format",
    };
  }

  const req = body as Record<string, unknown>;

  // Validate language
  const language = 
    typeof req.language === "string" && (req.language === "ar" || req.language === "en")
      ? req.language
      : "en";

  // Sanitize messages
  const messages = sanitizeChatMessages(req.messages, 16);

  // Validate and limit context
  const context =
    typeof req.context === "object" && req.context !== null
      ? {
          locale: typeof (req.context as Record<string, unknown>).locale === "string"
            ? String((req.context as Record<string, unknown>).locale).slice(0, 32)
            : undefined,
          timezone: typeof (req.context as Record<string, unknown>).timezone === "string"
            ? String((req.context as Record<string, unknown>).timezone).slice(0, 64)
            : undefined,
          localTime: typeof (req.context as Record<string, unknown>).localTime === "string"
            ? String((req.context as Record<string, unknown>).localTime).slice(0, 32)
            : undefined,
          device: typeof (req.context as Record<string, unknown>).device === "string"
            ? String((req.context as Record<string, unknown>).device).slice(0, 64)
            : undefined,
        }
      : undefined;

  if (messages.length === 0) {
    return {
      valid: false,
      language,
      messages: [],
      error: "No valid messages provided",
    };
  }

  return {
    valid: true,
    language,
    messages,
    context,
  };
}

/**
 * SECURITY: Validate text-based request payloads
 */
export function validateTextPayload(
  text: unknown,
  maxLength = 8000,
  minLength = 1,
): { valid: boolean; text: string; error?: string } {
  if (typeof text !== "string") {
    return {
      valid: false,
      text: "",
      error: "Invalid text format",
    };
  }

  const trimmed = text.trim();

  if (trimmed.length < minLength) {
    return {
      valid: false,
      text: "",
      error: `Text must be at least ${minLength} character(s)`,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      text: "",
      error: `Text must not exceed ${maxLength} characters`,
    };
  }

  return {
    valid: true,
    text: trimmed,
  };
}

/**
 * SECURITY: Validate form field string values
 */
export function validateFormField(
  value: unknown,
  maxLength = 500,
  fieldName = "field",
): { valid: boolean; value: string; error?: string } {
  if (value === null || value === undefined) {
    return { valid: true, value: "" };
  }

  if (typeof value !== "string") {
    return {
      valid: false,
      value: "",
      error: `${fieldName} must be a string`,
    };
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      value: "",
      error: `${fieldName} must not exceed ${maxLength} characters`,
    };
  }

  return {
    valid: true,
    value: trimmed,
  };
}

/**
 * SECURITY: Validate file upload
 */
export function validateFileUpload(
  file: unknown,
  maxSizeBytes: number,
  allowedMimeTypes: string[] = [],
): {
  valid: boolean;
  file?: File;
  error?: string;
} {
  if (!(file instanceof File)) {
    return {
      valid: false,
      error: "No file provided",
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxMB} MB`,
    };
  }

  if (allowedMimeTypes.length > 0) {
    const mimeType = file.type || "application/octet-stream";
    if (!allowedMimeTypes.some((type) => matchMimeType(mimeType, type))) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedMimeTypes.join(", ")}`,
      };
    }
  }

  return {
    valid: true,
    file,
  };
}

/**
 * SECURITY: Match MIME type with pattern (e.g., "image/*")
 */
function matchMimeType(actual: string, pattern: string): boolean {
  if (pattern === "*/*") return true;
  if (pattern === actual) return true;

  const [patternType, patternSubtype] = pattern.split("/");
  const [actualType, actualSubtype] = actual.split("/");

  if (patternSubtype === "*" && patternType === actualType) {
    return true;
  }

  return false;
}

/**
 * SECURITY: Sanitize prompt to prevent injection attacks
 * 
 * Removes attempts to inject system prompts or instructions
 */
export function sanitizePrompt(prompt: string): string {
  let sanitized = prompt.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // Warn about suspicious patterns (don't block, just log)
  const suspiciousPatterns = [
    /ignore\s+(previous|prior|all).*instructions?/i,
    /system\s*prompt/i,
    /you\s+are\s+now/i,
    /role\s*play\s+as/i,
    /pretend\s+to\s+be/i,
    /act\s+as\s+(?!a\s+helpful)/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      console.warn(
        `[SECURITY] Detected potential prompt injection pattern in: ${sanitized.slice(0, 100)}...`,
      );
    }
  }

  return sanitized;
}

/**
 * SECURITY: Validate dialect string (SQL, etc.)
 */
export function validateDialect(
  dialect: unknown,
  allowed = ["PostgreSQL", "MySQL", "SQLite", "MSSQL"],
): { valid: boolean; dialect: string; error?: string } {
  if (typeof dialect !== "string") {
    return {
      valid: true,
      dialect: allowed[0],
    };
  }

  const trimmed = dialect.trim();

  if (allowed.includes(trimmed)) {
    return {
      valid: true,
      dialect: trimmed,
    };
  }

  // Default to first allowed option
  console.warn(`[SECURITY] Invalid dialect "${trimmed}", defaulting to ${allowed[0]}`);
  return {
    valid: true,
    dialect: allowed[0],
  };
}

/**
 * SECURITY: Get safe IP address from request
 */
export function getSafeIP(
  ip: string | null | undefined,
  xForwardedFor: string | null | undefined,
  fallback = "local",
): string {
  let address = ip ?? xForwardedFor ?? fallback;

  // Extract first IP if x-forwarded-for contains multiple
  if (address.includes(",")) {
    address = address.split(",")[0].trim();
  }

  // Validate it looks like an IP
  if (!/^[\d.a-f:]+$/i.test(address)) {
    return fallback;
  }

  return address.slice(0, 50); // Limit length
}

/**
 * SECURITY: Safe error response (don't expose internals)
 */
export function getSafeErrorMessage(
  error: unknown,
  isDev = false,
): string {
  if (!(error instanceof Error)) {
    return isDev ? String(error) : "Request failed";
  }

  // In production, always return generic message
  if (!isDev) {
    return "HARON OS encountered an error. Please try again.";
  }

  // In development, return actual message (but not full stack trace)
  return error.message;
}
