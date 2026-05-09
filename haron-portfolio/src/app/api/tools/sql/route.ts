import { NextRequest } from "next/server";

import { completeText } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "local";
  const usage = checkUsageLimit(`sql:${ip}`, 30);

  if (!usage.allowed) {
    return Response.json({ error: "Usage limit reached. Try again later." }, { status: 429 });
  }

  const body = (await request.json()) as { prompt?: string; dialect?: string };
  const result = await completeText(
    `Dialect: ${body.dialect ?? "PostgreSQL"}\nTask: ${body.prompt ?? ""}`,
    "You are HARON OS SQL generator. Return optimized SQL, explain assumptions, and include index or performance notes when relevant.",
  );

  return Response.json({ result, remaining: usage.remaining });
}
