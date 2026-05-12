"use client";

import { CheckCircle2, DatabaseZap, KeyRound, LockKeyhole, UploadCloud } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";

export function SettingsSection() {
  const { lang } = useLanguage();
  const settings = lang === "ar"
    ? [
        { title: "واجهة Gemini", value: "GEMINI_API_KEY", text: "مفتاح خادم فقط للمحادثة والكتابة وPDF والصور والسيرة وتوليد SQL.", icon: KeyRound },
        { title: "مشروع Firebase", value: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", text: "معرّف مشروع Firebase للمصادقة وملفات Firestore وخدمات العميل الفورية.", icon: DatabaseZap },
        { title: "مصادقة Firebase", value: "NEXT_PUBLIC_FIREBASE_API_KEY", text: "مفتاح آمن للمتصفح يعمل مع النطاقات المصرّح بها وقواعد Firestore.", icon: LockKeyhole },
        { title: "نظام التخزين", value: "Firebase Storage", text: "جاهز للصور الشخصية وملفات PDF والصور والسير الذاتية وملفات المستخدم.", icon: UploadCloud },
      ]
    : [
        { title: "Gemini API", value: "GEMINI_API_KEY", text: "Server-only key for chat, writing, PDF, screenshot, resume, and SQL generation.", icon: KeyRound },
        { title: "Firebase Project", value: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", text: "Public Firebase project ID for Auth, Firestore profiles, and realtime client services.", icon: DatabaseZap },
        { title: "Firebase Auth", value: "NEXT_PUBLIC_FIREBASE_API_KEY", text: "Browser-safe Firebase key used with protected Auth domains and Firestore rules.", icon: LockKeyhole },
        { title: "Storage System", value: "Firebase Storage", text: "Ready for avatars, uploaded PDFs, screenshots, generated resumes, and user files.", icon: UploadCloud },
      ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid gap-5 lg:grid-cols-4">
        {settings.map((setting) => (
          <div key={setting.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl">
            <setting.icon className="mb-8 size-8 text-cyan-100" />
            <h3 className="text-xl font-black text-white">{setting.title}</h3>
            <code className="mt-4 block rounded-2xl border border-white/10 bg-black/35 p-3 text-xs text-cyan-100">
              {setting.value}
            </code>
            <p className="mt-4 text-sm leading-7 text-white/58">{setting.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[2rem] border border-emerald-200/15 bg-emerald-300/[0.06] p-6 backdrop-blur-2xl">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="mt-1 size-6 text-emerald-200" />
          <div>
            <h3 className="text-2xl font-black text-white">{lang === "ar" ? "آمن افتراضيًا" : "Secure by default"}</h3>
            <p className="mt-3 max-w-4xl text-white/60">
              {lang === "ar"
                ? "مفاتيح API لا تُكتب داخل الكود. هارون أو إس يقرأ الأسرار من متغيرات البيئة ويشغّل Gemini من مسارات آمنة على الخادم."
                : "API keys are never hardcoded. HARON OS reads secrets from environment variables, keeps Gemini API calls on server routes, and includes `.env.local.example` for deployment setup."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
