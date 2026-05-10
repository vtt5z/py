import { NextRequest } from "next/server";

import { completeText, detectInputLanguage } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "local";
  const usage = checkUsageLimit(`writing:${ip}`, 35);

  if (!usage.allowed) {
    return Response.json({ error: "Usage limit reached. Try again later." }, { status: 429 });
  }

  const body = (await request.json()) as {
    mode?: string;
    input?: string;
  };

  const input = body.input ?? "";
  const result = await completeText(
    `Mode: ${body.mode ?? "professional rewrite"}\n\nText:\n${input}`,
    "You are HARON OS writing assistant. Produce polished, professional, high-signal writing. Include 2-3 variants when useful.",
    detectInputLanguage(input),
  );

  return Response.json({ result, remaining: usage.remaining });
}
