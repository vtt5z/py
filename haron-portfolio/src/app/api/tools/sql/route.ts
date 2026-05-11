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
  try {
    // SECURITY: Rate limiting
    const ip = getSafeIP(request.ip, request.headers.get("x-forwarded-for"));
    const usage = checkUsageLimit(`sql:${ip}`, 30); // 30 requests per hour

    if (!usage.allowed) {
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
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    const req = body as Record<string, unknown>;

    // SECURITY: Validate prompt
    const promptValidation = validateTextPayload(req.prompt, 4000, 10);
    if (!promptValidation.valid) {
      return NextResponse.json(
        { error: promptValidation.error },
        { status: 400 },
      );
    }

    // SECURITY: Validate dialect
    const dialectValidation = validateDialect(req.dialect);
    const { dialect } = dialectValidation;

    // SECURITY: Generate SQL with safe system prompt
    const language = detectInputLanguage(promptValidation.text);
    const result = await completeText(
      `Dialect: ${dialect}\nTask: ${promptValidation.text}`,
      "You are HARON OS SQL generator. Return optimized SQL, explain assumptions, and include index or performance notes when relevant.",
      language,
    );

    return NextResponse.json({
      result,
      remaining: usage.remaining,
    });
  } catch (error) {
    // SECURITY: Safe error response
    const isDev = process.env.NODE_ENV === "development";
    const message = getSafeErrorMessage(error, isDev);

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
