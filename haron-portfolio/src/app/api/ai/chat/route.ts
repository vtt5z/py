import { NextRequest } from "next/server";

import { streamChatCompletion, type ChatMessage } from "@/services/openai";
import { checkUsageLimit } from "@/services/usage-limits";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "local";
  const usage = checkUsageLimit(`chat:${ip}`, 40);

  if (!usage.allowed) {
    return Response.json({ error: "Usage limit reached. Try again later." }, { status: 429 });
  }

  const body = (await request.json()) as {
    messages?: ChatMessage[];
  };

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are HARON OS, a premium AI operating system built for a software engineer and data analyst. Be concise, cinematic, technically sharp, helpful, and format answers with markdown. When code is useful, provide clean code blocks.",
    },
    ...(body.messages ?? []),
  ];

  const stream = await streamChatCompletion(messages);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Usage-Remaining": String(usage.remaining),
    },
  });
}
