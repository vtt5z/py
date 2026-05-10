import { NextRequest } from "next/server";

import {
  detectInputLanguage,
  streamChatCompletion,
  type AssistantLanguage,
  type ChatMessage,
} from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "local";
    const usage = checkUsageLimit(`chat:${ip}`, 40);

    if (!usage.allowed) {
      return Response.json({ error: "Usage limit reached. Try again later." }, { status: 429 });
    }

    const body = (await request.json()) as {
      language?: AssistantLanguage;
      context?: {
        locale?: string;
        timezone?: string;
        localTime?: string;
        device?: string;
      };
      messages?: ChatMessage[];
    };

    const userText = body.messages?.filter((message) => message.role === "user").at(-1)?.content ?? "";
    const language = body.language ?? detectInputLanguage(userText);
    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          [
            "You are the live HARON OS assistant.",
            "Keep responses concise, practical, warm, and product-grade.",
            "Avoid fake sci-fi theatrics and verbose filler.",
            "Prefer useful steps, clear formatting, and direct answers.",
            `Runtime context: locale=${body.context?.locale ?? "unknown"}, timezone=${body.context?.timezone ?? "unknown"}, localTime=${body.context?.localTime ?? "unknown"}, device=${body.context?.device ?? "unknown"}.`,
          ].join(" "),
      },
      ...(body.messages ?? []),
    ];

    const stream = await streamChatCompletion(messages, language);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Usage-Remaining": String(usage.remaining),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "HARON OS AI route failed.";

    return new Response(message, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
