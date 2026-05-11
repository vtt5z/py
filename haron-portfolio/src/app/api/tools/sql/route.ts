import { NextRequest, NextResponse } from "next/server";

import { completeText, detectInputLanguage } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";
import {
  validateFormField,
  validateTextPayload,
  validateDialect,
  getSafeIP,
  getSafeErrorMessage,
} from "@/lib/security";
import { trackError, trackPerformance } from "@/lib/monitoring";

export const runtime = "nodejs";

/**
 * SECURITY: SQL generation endpoint
 * 
 * Implements:
 * - Prompt validation
 * - Dialect validation
 * - Rate limiting
 * - Safe error handling
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    // SECURITY: Rate limiting
    const ip = getSafeIP(request.ip, request.headers.get("x-forwarded-for"));
    const usage = checkUsageLimit(`sql:${ip}`, 30); // 30 requests per hour

    if (!usage.allowed) {
      trackError("rate_limit_exceeded", "SQL endpoint rate limit hit");
      return NextResponse.json(
        { error: "Rate limit reached. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(usage.retryAfter ?? 3600),
          },
        },
      );
    }

    // SECURITY: Parse JSON body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      trackError("invalid_json", "Failed to parse SQL request JSON");
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null) {
      trackError("validation_error", "Invalid SQL request format");
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    const req = body as Record<string, unknown>;

    // SECURITY: Validate prompt
    const promptValidation = validateTextPayload(req.prompt, 4000, 10);
    if (!promptValidation.valid) {
      trackError("validation_error", `SQL prompt validation failed: ${promptValidation.error}`);
      return NextResponse.json(
        { error: promptValidation.error },
        { status: 400 },
      );
    }

    // SECURITY: Validate dialect
    const dialectValidation = validateDialect(req.dialect);
    const { dialect } = dialectValidation;

    // SECURITY: Generate SQL with safe system prompt
    const aiStartTime = performance.now();
    const language = detectInputLanguage(promptValidation.text);
    const result = await completeText(
      `Dialect: ${dialect}\nTask: ${promptValidation.text}`,
      "You are HARON OS SQL generator. Return optimized SQL, explain assumptions, and include index or performance notes when relevant.",
      language,
    );
    const aiEndTime = performance.now();
    
    trackPerformance("sql", aiEndTime - aiStartTime);
    const responseTime = performance.now() - startTime;

    return NextResponse.json(
      {
        result,
        remaining: usage.remaining,
      },
      {
        headers: {
          "X-Response-Time": `${responseTime.toFixed(2)}ms`,
        },
      },
    );
  } catch (error) {
    trackError("sql_endpoint_error", `SQL endpoint error: ${error instanceof Error ? error.message : "Unknown error"}`);
    // SECURITY: Safe error response
    const isDev = process.env.NODE_ENV === "development";
    const message = getSafeErrorMessage(error, isDev);

    const responseTime = performance.now() - startTime;
    return NextResponse.json(
      { error: message },
      {
        status: 500,
        headers: {
          "X-Response-Time": `${responseTime.toFixed(2)}ms`,
        },
      },
    );
  }
}
