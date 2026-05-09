import { NextRequest } from "next/server";

import { completeText } from "@/services/gemini";
import { checkUsageLimit } from "@/services/usage-limits";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "local";
  const usage = checkUsageLimit(`pdf:${ip}`, 15);

  if (!usage.allowed) {
    return Response.json({ error: "Usage limit reached. Try again later." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const pastedText = String(formData.get("text") ?? "");
  let sourceText = pastedText;

  if (file instanceof File) {
    if (file.size > 8 * 1024 * 1024) {
      return Response.json({ error: "PDF is too large. Maximum size is 8 MB." }, { status: 413 });
    }

    const pdfParse = (await import("pdf-parse")).default;
    const arrayBuffer = await file.arrayBuffer();
    const parsed = await pdfParse(Buffer.from(arrayBuffer));
    sourceText = parsed.text;
  }

  if (!sourceText.trim()) {
    return Response.json({ error: "Upload a PDF or paste text to summarize." }, { status: 400 });
  }

  const result = await completeText(
    sourceText.slice(0, 26000),
    [
      "You are HARON OS PDF intelligence.",
      "Return markdown with these exact sections:",
      "Summary, Key Points, Simplified Explanation, Quiz Questions.",
      "Be useful for students and professionals.",
    ].join(" "),
  );

  return Response.json({ result, remaining: usage.remaining });
}
