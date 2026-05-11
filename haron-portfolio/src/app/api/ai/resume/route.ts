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
 * SECURITY: Resume builder endpoint
 * 
 * Implements:
 * - Input validation (profile, targetRole)
 * - Length limits
 * - Rate limiting
 * - Safe error handling
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    // SECURITY: Rate limiting
    const ip = getSafeIP(request.ip, request.headers.get("x-forwarded-for"));
    const usage = checkUsageLimit(`resume:${ip}`, 15); // 15 requests per hour

    if (!usage.allowed) {
      trackError("rate_limit_exceeded", "Resume endpoint rate limit hit");
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
      trackError("invalid_json", "Failed to parse resume request JSON");
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null) {
      trackError("validation_error", "Invalid resume request format");
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    const req = body as Record<string, unknown>;

    // SECURITY: Validate profile
    const profileValidation = validateTextPayload(req.profile, 6000, 50);
    if (!profileValidation.valid) {
      trackError("validation_error", `Resume profile validation failed: ${profileValidation.error}`);
      return NextResponse.json(
        { error: profileValidation.error },
        { status: 400 },
      );
    }

    // SECURITY: Validate target role
    const roleValidation = validateFormField(req.targetRole, 128, "targetRole");
    const targetRole = roleValidation.value || "Software Engineer / Data Analyst";

    // SECURITY: Process with safe system prompt
    const aiStartTime = performance.now();
    const language = detectInputLanguage(profileValidation.text);
    const result = await completeText(
      `Target role: ${targetRole}\n\nProfile:\n${profileValidation.text}`,
      "You are HARON OS resume builder. Create a modern ATS-friendly CV in markdown with headline, summary, skills, projects, experience, education, and measurable bullets. Keep it premium and truthful to the supplied profile.",
      language,
    );
    const aiEndTime = performance.now();
    
    trackPerformance("resume", aiEndTime - aiStartTime);
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
    trackError("resume_endpoint_error", `Resume endpoint error: ${error instanceof Error ? error.message : "Unknown error"}`);
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
