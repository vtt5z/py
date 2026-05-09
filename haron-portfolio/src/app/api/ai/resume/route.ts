import { NextRequest } from "next/server";

import { completeText } from "@/services/openai";
import { checkUsageLimit } from "@/services/usage-limits";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "local";
  const usage = checkUsageLimit(`resume:${ip}`, 15);

  if (!usage.allowed) {
    return Response.json({ error: "Usage limit reached. Try again later." }, { status: 429 });
  }

  const body = (await request.json()) as {
    profile?: string;
    targetRole?: string;
  };

  const result = await completeText(
    `Target role: ${body.targetRole ?? "Software Engineer / Data Analyst"}\n\nProfile:\n${body.profile ?? ""}`,
    "You are HARON OS resume builder. Create a modern ATS-friendly CV in markdown with headline, summary, skills, projects, experience, education, and measurable bullets. Keep it premium and truthful to the supplied profile.",
  );

  return Response.json({ result, remaining: usage.remaining });
}
