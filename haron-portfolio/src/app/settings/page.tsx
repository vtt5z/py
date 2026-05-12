 "use client";

import { Settings } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { SettingsSection } from "@/components/os/settings-section";

export default function SettingsPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "Secure Configuration", ar: "إعدادات آمنة" }}
        title={{ en: "Environment, Firebase auth, storage, and deployment readiness.", ar: "البيئة والمصادقة والتخزين وجاهزية النشر." }}
        text={{
          en: "HARON OS is structured for Gemini server routes, Firebase Authentication, Firestore profiles, Storage uploads, usage limits, and Vercel deployment without hardcoded secrets.",
          ar: "هارون أو إس مبني لمسارات Gemini الآمنة، ومصادقة Firebase، وملفات Firestore، ورفع Storage، وحدود الاستخدام، ونشر Vercel بدون أسرار داخل الكود.",
        }}
        icon={Settings}
      >
        <div className="space-y-3 font-mono text-sm">
          {["GEMINI_API_KEY", "NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_PROJECT_ID"].map((env) => (
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
