import { NextRequest, NextResponse } from "next/server";

import { completeText, detectInputLanguage } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";
import {
  validateFormField,
  validateTextPayload,
  getSafeIP,
  getSafeErrorMessage,
} from "@/lib/security";

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
  try {
    // SECURITY: Rate limiting
    const ip = getSafeIP(request.ip, request.headers.get("x-forwarded-for"));
    const usage = checkUsageLimit(`writing:${ip}`, 35); // 35 requests per hour

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

    // SECURITY: Validate mode
    const modeValidation = validateFormField(req.mode, 32, "mode");
    const mode = modeValidation.value || "professional rewrite";

    // SECURITY: Validate input text
    const inputValidation = validateTextPayload(req.input, 8000, 10);
    if (!inputValidation.valid) {
      return NextResponse.json(
        { error: inputValidation.error },
        { status: 400 },
      );
    }

    // SECURITY: Process with safe system prompt
    const language = detectInputLanguage(inputValidation.text);
    const result = await completeText(
      `Mode: ${mode}\n\nText:\n${inputValidation.text}`,
      "You are HARON OS writing assistant. Produce polished, professional, high-signal writing. Include 2-3 variants when useful.",
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
