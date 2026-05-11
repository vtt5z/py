import { NextRequest } from "next/server";

import { getSupabaseAdminClient } from "@/services/supabase";
import { checkUsageLimit } from "@/services/usage-limits";
import { getSafeIP, getSafeErrorMessage } from "@/lib/security";
import { trackError, trackPerformance } from "@/lib/monitoring";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  try {
    const ip = getSafeIP(request.ip, request.headers.get("x-forwarded-for"));
    const usage = checkUsageLimit(`storage:${ip}`, 20);

    if (!usage.allowed) {
      trackError("rate_limit_exceeded", "Storage endpoint rate limit hit");
      return Response.json(
        { error: "Usage limit reached. Try again later." },
        { status: 429, headers: { "X-Response-Time": `${(performance.now() - startTime).toFixed(2)}ms` } }
      );
    }

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      trackError("storage_not_configured", "Supabase not configured for storage");
      return Response.json(
        {
          error:
            "Supabase storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable uploads.",
        },
        { status: 503, headers: { "X-Response-Time": `${(performance.now() - startTime).toFixed(2)}ms` } }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      trackError("invalid_form_data", "Failed to parse storage form data");
      return Response.json(
        { error: "Invalid form data" },
        { status: 400, headers: { "X-Response-Time": `${(performance.now() - startTime).toFixed(2)}ms` } }
      );
    }

    const file = formData.get("file");
    const bucket = String(formData.get("bucket") ?? "haron-os-files");

    if (!(file instanceof File)) {
      trackError("validation_error", "Storage upload missing file");
      return Response.json(
        { error: "Upload a file." },
        { status: 400, headers: { "X-Response-Time": `${(performance.now() - startTime).toFixed(2)}ms` } }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      trackError("validation_error", `Storage file too large: ${file.size} bytes`);
      return Response.json(
        { error: "File is too large. Maximum size is 10 MB." },
        { status: 413, headers: { "X-Response-Time": `${(performance.now() - startTime).toFixed(2)}ms` } }
      );
    }

    const uploadStartTime = performance.now();
    const path = `${Date.now()}-${file.name.replaceAll(" ", "-")}`;
    const { error, data } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false });

    const uploadEndTime = performance.now();
    trackPerformance("storage", uploadEndTime - uploadStartTime);

    if (error) {
      trackError("storage_upload_error", `Supabase upload error: ${error.message}`);
      return Response.json(
        { error: error.message },
        { status: 500, headers: { "X-Response-Time": `${(performance.now() - startTime).toFixed(2)}ms` } }
      );
    }

    const responseTime = performance.now() - startTime;
    return Response.json(
      { path: data.path, remaining: usage.remaining },
      { headers: { "X-Response-Time": `${responseTime.toFixed(2)}ms` } }
    );
  } catch (error) {
    trackError("storage_endpoint_error", `Storage endpoint error: ${error instanceof Error ? error.message : "Unknown error"}`);
    const isDev = process.env.NODE_ENV === "development";
    const message = getSafeErrorMessage(error, isDev);

    const responseTime = performance.now() - startTime;
    return Response.json(
      { error: message },
      { status: 500, headers: { "X-Response-Time": `${responseTime.toFixed(2)}ms` } }
    );
  }
}
