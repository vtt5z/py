import { NextRequest, NextResponse } from "next/server";

import { completeText, detectInputLanguage } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";
import {
  validateFileUpload,
  validateTextPayload,
  getSafeIP,
  getSafeErrorMessage,
} from "@/lib/security";

export const runtime = "nodejs";

/**
 * SECURITY: PDF analysis endpoint
 * 
 * Implements:
 * - File size validation (max 8 MB)
 * - MIME type validation
 * - Text content length limits
 * - Rate limiting
 * - Safe error handling
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Rate limiting
    const ip = getSafeIP(request.ip, request.headers.get("x-forwarded-for"));
    const usage = checkUsageLimit(`pdf:${ip}`, 15); // 15 requests per hour

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
    const pastedText = String(formData.get("text") ?? "");

    // SECURITY: Get text source
    let sourceText = pastedText;

    if (file) {
      // SECURITY: Validate file
      const fileValidation = validateFileUpload(file, 8 * 1024 * 1024, [
        "application/pdf",
        "application/x-pdf",
      ]);

      if (!fileValidation.valid) {
        return NextResponse.json(
          { error: fileValidation.error },
          { status: 400 },
        );
      }

      try {
        const pdfParse = (await import("pdf-parse")).default;
        const arrayBuffer = await fileValidation.file!.arrayBuffer();
        const parsed = await pdfParse(Buffer.from(arrayBuffer));
        sourceText = parsed.text;
      } catch (error) {
        return NextResponse.json(
          {
            error: "Failed to parse PDF. Please ensure it's a valid PDF file.",
          },
          { status: 400 },
        );
      }
    }

    // SECURITY: Validate extracted text
    const textValidation = validateTextPayload(sourceText, 26000, 10);
    if (!textValidation.valid) {
      return NextResponse.json(
        { error: textValidation.error },
        { status: 400 },
      );
    }

    // SECURITY: Analyze with proper system prompt
    const language = detectInputLanguage(textValidation.text);
    const result = await completeText(
      textValidation.text,
      [
        "You are HARON OS PDF intelligence.",
        "Return markdown with these exact sections:",
        "Summary, Key Points, Simplified Explanation, Quiz Questions.",
        "Be useful for students and professionals.",
      ].join(" "),
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
