 "use client";

import { TerminalSquare } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { TerminalSection } from "@/components/os/terminal-section";
import { useLanguage } from "@/components/providers/language-provider";

export default function TerminalPage() {
  const { lang } = useLanguage();

  return (
    <PageFrame>
      <PageHero
        eyebrow={{ en: "AI Terminal", ar: "الطرفية الذكية" }}
        title={{ en: "Command-first intelligence with cinematic output.", ar: "ذكاء تشغيلي بالأوامر مع تجربة سينمائية." }}
        text={{
          en: "Use fast natural-language commands to summarize, debug, generate, explain, rewrite, and transform ideas into action.",
          ar: "استخدم أوامر طبيعية سريعة للتلخيص والتصحيح والتوليد والشرح وإعادة الصياغة وتحويل الأفكار إلى تنفيذ.",
        }}
        icon={TerminalSquare}
      >
        <pre className="rounded-3xl border border-cyan-200/15 bg-black/45 p-5 font-mono text-sm leading-7 text-cyan-100/80">
          {lang === "ar"
            ? `> لخّص pdf\n> حل خطأ flutter\n> ولّد فكرة مشروع\n> اشرح sql joins\n\nالمؤشر: متصل █`
            : `> summarize pdf\n> fix flutter error\n> generate startup idea\n> explain sql joins\n\ncursor: online █`}
        </pre>
      </PageHero>
      <TerminalSection />
    </PageFrame>
  );
}
