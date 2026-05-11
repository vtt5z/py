import { NextRequest, NextResponse } from "next/server";

import { completeText, detectInputLanguage } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";
import {
  validateFormField,
  validateTextPayload,
  getSafeIP,
  getSafeErrorMessage,
} from "@/lib/security";
import { trackError, trackPerformance } from "@/lib/monitoring";

export const runtime = "nodejs";

/**
 * SECURITY: Writing assistant endpoint
 * 
 * Implements:
 * - Input length validation
 * - Mode validation
 * - Rate limiting
 * - Safe error handling
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    // SECURITY: Rate limiting
    const ip = getSafeIP(request.ip, request.headers.get("x-forwarded-for"));
    const usage = checkUsageLimit(`writing:${ip}`, 35); // 35 requests per hour

    if (!usage.allowed) {
      trackError("rate_limit_exceeded", "Writing endpoint rate limit hit");
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
      trackError("invalid_json", "Failed to parse writing request JSON");
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null) {
      trackError("validation_error", "Invalid writing request format");
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    const req = body as Record<string, unknown>;

    // SECURITY: Validate mode
    const modeValidation = validateFormField(req.mode, 32, "mode");
    const mode = modeValidation.value || "professional rewrite";

    // SECURITY: Validate input text
    const inputValidation = validateTextPayload(req.input, 8000, 10);
    if (!inputValidation.valid) {
      trackError("validation_error", `Writing text validation failed: ${inputValidation.error}`);
      return NextResponse.json(
        { error: inputValidation.error },
        { status: 400 },
      );
    }

    // SECURITY: Process with safe system prompt
    const aiStartTime = performance.now();
    const language = detectInputLanguage(inputValidation.text);
    const result = await completeText(
      `Mode: ${mode}\n\nText:\n${inputValidation.text}`,
      "You are HARON OS writing assistant. Produce polished, professional, high-signal writing. Include 2-3 variants when useful.",
      language,
    );
    const aiEndTime = performance.now();
    
    trackPerformance("writing", aiEndTime - aiStartTime);
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
    trackError("writing_endpoint_error", `Writing endpoint error: ${error instanceof Error ? error.message : "Unknown error"}`);
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
