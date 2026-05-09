import { NextRequest } from "next/server";

import { getSupabaseAdminClient } from "@/services/supabase";
import { checkUsageLimit } from "@/services/usage-limits";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "local";
  const usage = checkUsageLimit(`storage:${ip}`, 20);

  if (!usage.allowed) {
    return Response.json({ error: "Usage limit reached. Try again later." }, { status: 429 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return Response.json(
      {
        error:
          "Supabase storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable uploads.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const bucket = String(formData.get("bucket") ?? "haron-os-files");

  if (!(file instanceof File)) {
    return Response.json({ error: "Upload a file." }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: "File is too large. Maximum size is 10 MB." }, { status: 413 });
  }

  const path = `${Date.now()}-${file.name.replaceAll(" ", "-")}`;
  const { error, data } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ path: data.path, remaining: usage.remaining });
}
