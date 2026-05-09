import { NextRequest } from "next/server";

import { analyzeImage } from "@/services/openai";
import { checkUsageLimit } from "@/services/usage-limits";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "local";
  const usage = checkUsageLimit(`screenshot:${ip}`, 20);

  if (!usage.allowed) {
    return Response.json({ error: "Usage limit reached. Try again later." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const prompt = String(
    formData.get("prompt") ??
      "Analyze this screenshot for errors, UI problems, debugging suggestions, and concrete improvements.",
  );

  if (!(file instanceof File)) {
    return Response.json({ error: "Upload a screenshot image." }, { status: 400 });
  }

  if (file.size > 6 * 1024 * 1024) {
    return Response.json({ error: "Image is too large. Maximum size is 6 MB." }, { status: 413 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const result = await analyzeImage(base64, file.type || "image/png", prompt);

  return Response.json({ result, remaining: usage.remaining });
}
