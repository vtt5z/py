import { NextRequest, NextResponse } from "next/server";

import {
  detectInputLanguage,
  streamChatCompletion,
  type AssistantLanguage,
  type ChatMessage,
} from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";
import {
  validateChatRequest,
  getSafeIP,
  getSafeErrorMessage,
} from "@/lib/security";

export const runtime = "nodejs";

/**
 * SECURITY: Chat endpoint
 * 
 * Implements:
 * - Frontend role enforcement (user role only)
 * - Request validation
 * - Rate limiting
 * - Safe error handling
 * - Secure headers
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Get safe IP for rate limiting
  const forwardedFor = request.headers.get("x-forwarded-for");

const ip = getSafeIP(
  typeof request.ip === "string" ? request.ip : null,
  forwardedFor
);
    const rateLimitKey = `chat:${ip}`;
    const usage = checkUsageLimit(rateLimitKey, 40); // 40 requests per hour

    if (!usage.allowed) {
      return new Response(
        JSON.stringify({
          error: "Rate limit reached. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(usage.retryAfter ?? 3600),
          },
        },
      );
    }

    // SECURITY: Parse and validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // SECURITY: Validate request structure
    const validation = validateChatRequest(body);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error ?? "Invalid request" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { language, messages, context } = validation;

    // SECURITY: Inject server-side system prompt only
    // Never trust frontend for system instructions
    const systemPrompt = [
      "You are the live HARON OS assistant.",
      "Keep responses concise, practical, warm, and product-grade.",
      "Avoid fake sci-fi theatrics and verbose filler.",
      "Prefer useful steps, clear formatting, and direct answers.",
      context
        ? `Runtime context: locale=${context.locale ?? "unknown"}, timezone=${context.timezone ?? "unknown"}, localTime=${context.localTime ?? "unknown"}, device=${context.device ?? "unknown"}.`
        : "Runtime context: unknown",
    ].join(" ");

    const safeMessages: ChatMessage[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ];

    // SECURITY: Generate stream with validated data
    const stream = await streamChatCompletion(safeMessages, language);

    // SECURITY: Return response with security headers
    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-Usage-Remaining": String(usage.remaining),
      },
    });
  } catch (error) {
    // SECURITY: Don't expose internal errors
    const isDev = process.env.NODE_ENV === "development";
    const message = getSafeErrorMessage(error, isDev);

    return new Response(
      JSON.stringify({
        error: message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  }
}
