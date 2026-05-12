 "use client";

import { Bot } from "lucide-react";

import { AIChatAssistant } from "@/components/os/ai-chat-assistant";
import { AIToolsSection } from "@/components/os/ai-tools-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { useLanguage } from "@/components/providers/language-provider";

export default function AIPage() {
  const { lang } = useLanguage();

  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "HARON AI Core", ar: "نواة هارون الذكية" }}
        title={{ en: "A dedicated assistant workspace for every workflow.", ar: "مساحة مساعد مخصصة لكل سير عمل." }}
        text={{
          en: "Chat, reason, debug, write, summarize, and generate inside a premium AI operating-system experience.",
          ar: "حادث، حلّل، صحّح، اكتب، لخّص، وولّد النتائج داخل تجربة نظام ذكي فاخرة.",
        }}
        icon={Bot}
      >
        <div className="grid gap-3">
          {[
            { en: "Streaming responses", ar: "استجابات بتدفق سلس" },
            { en: "Markdown and code highlighting", ar: "ماركداون وتلوين الأكواد" },
            { en: "Conversation memory", ar: "ذاكرة المحادثات" },
            { en: "Copy-ready answers", ar: "إجابات جاهزة للنسخ" },
          ].map((item) => (
            <div key={item.en} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-bold text-white/68">
              {item[lang]}
            </div>
          ))}
        </div>
      </PageHero>
      <AIChatAssistant />
      <AIToolsSection />
    </PageFrame>
  );
}
