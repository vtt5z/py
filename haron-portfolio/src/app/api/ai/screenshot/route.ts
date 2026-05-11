import { NextRequest, NextResponse } from "next/server";

import { analyzeImage, detectInputLanguage } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";
import {
  validateFileUpload,
  validateFormField,
  getSafeIP,
  getSafeErrorMessage,
} from "@/lib/security";

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
  try {
    // SECURITY: Rate limiting
    const ip = getSafeIP(request.ip, request.headers.get("x-forwarded-for"));
    const usage = checkUsageLimit(`screenshot:${ip}`, 20); // 20 requests per hour

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

    // SECURITY: Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 },
      );
    }

    const file = formData.get("file");
    const promptField = formData.get("prompt");

    // SECURITY: Validate file
    const fileValidation = validateFileUpload(file, 6 * 1024 * 1024, [
      "image/*",
    ]);

    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 },
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
    const arrayBuffer = await fileValidation.file!.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const result = await analyzeImage(
      base64,
      fileValidation.file!.type || "image/png",
      prompt,
      detectInputLanguage(prompt),
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
