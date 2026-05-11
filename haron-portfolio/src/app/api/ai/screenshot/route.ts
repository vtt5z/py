import { NextRequest, NextResponse } from "next/server";

import { analyzeImage, detectInputLanguage } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";
import {
  validateFileUpload,
  validateFormField,
  getSafeIP,
  getSafeErrorMessage,
} from "@/lib/security";
import { trackError, trackPerformance } from "@/lib/monitoring";

export const runtime = "nodejs";

/**
 * SECURITY: Screenshot analysis endpoint
 *
 * Implements:
 * - File size validation (max 6 MB)
 * - MIME type validation (images only)
 * - Prompt validation
 * - Rate limiting
 * - Safe error handling
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  try {
    // SECURITY: Rate limiting
    const ip = getSafeIP(
      request.ip,
      request.headers.get("x-forwarded-for"),
    );

    const usage = checkUsageLimit(
      `screenshot:${ip}`,
      20,
    );

    // 20 requests per hour
    if (!usage.allowed) {
      trackError(
        "rate_limit_exceeded",
        "Screenshot endpoint rate limit hit",
      );

      return NextResponse.json(
        {
          error: "Rate limit reached. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              usage.retryAfter ?? 3600,
            ),
          },
        },
      );
    }

    // SECURITY: Parse form data
    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      trackError(
        "invalid_form_data",
        "Failed to parse screenshot form data",
      );

      return NextResponse.json(
        {
          error: "Invalid form data",
        },
        {
          status: 400,
        },
      );
    }

    const file = formData.get("file");
    const promptField = formData.get("prompt");

    // SECURITY: Validate file
    const fileValidation = validateFileUpload(
      file,
      6 * 1024 * 1024,
      ["image/*"],
    );

    if (!fileValidation.valid) {
      trackError(
        "validation_error",
        `Screenshot file validation failed: ${fileValidation.error}`,
      );

      return NextResponse.json(
        {
          error: fileValidation.error,
        },
        {
          status: 400,
        },
      );
    }

    // SECURITY: Validate prompt
    const promptValidation = validateFormField(
      promptField ??
        "Analyze this screenshot for errors, UI problems, debugging suggestions, and concrete improvements.",
      1000,
      "prompt",
    );

    const prompt = promptValidation.value;

    // SECURITY: Analyze image
    const aiStartTime = performance.now();

    const arrayBuffer =
      await fileValidation.file!.arrayBuffer();

    const base64 =
      Buffer.from(arrayBuffer).toString("base64");

    const result = await analyzeImage(
      base64,
      fileValidation.file!.type || "image/png",
      prompt,
      detectInputLanguage(prompt),
    );

    const aiEndTime = performance.now();

    trackPerformance(
      "screenshot",
      aiEndTime - aiStartTime,
    );

    const responseTime =
      performance.now() - startTime;

    return NextResponse.json(
      {
        result,
        remaining: usage.remaining,
      },
      {
        headers: {
          "X-Response-Time":
            `${responseTime.toFixed(2)}ms`,
        },
      },
    );
  } catch (error) {
    trackError(
      "screenshot_endpoint_error",
      `Screenshot endpoint error: ${
        error instanceof Error
          ? error.message
          : "Unknown error"
      }`,
    );

    // SECURITY: Safe error response
    const isDev =
      process.env.NODE_ENV === "development";

    const message = getSafeErrorMessage(
      error,
      isDev,
    );

    const responseTime =
      performance.now() - startTime;

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
        headers: {
          "X-Response-Time":
            `${responseTime.toFixed(2)}ms`,
        },
      },
    );
  }
}