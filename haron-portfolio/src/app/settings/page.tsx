 "use client";

import { Settings } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { SettingsSection } from "@/components/os/settings-section";

export default function SettingsPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Secure Configuration"
        title="Environment, storage, auth, and deployment readiness."
        text="HARON OS is structured for Gemini server routes, Supabase auth and storage, usage limits, and Vercel deployment without hardcoded secrets."
        icon={Settings}
      >
        <div className="space-y-3 font-mono text-sm">
          {["GEMINI_API_KEY", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].map((env) => (
            <div key={env} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-cyan-100">
              {env}=
            </div>
          ))}
        </div>
      </PageHero>
      <SettingsSection />
    </PageFrame>
  );
}
