 "use client";

import { Bot } from "lucide-react";

import { AIChatAssistant } from "@/components/os/ai-chat-assistant";
import { AIToolsSection } from "@/components/os/ai-tools-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";

export default function AIPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="HARON AI Core"
        title="Streaming intelligence for every workflow."
        text="Chat, reason, debug, write, summarize, and generate through a premium AI assistant built for engineering and analytics."
        icon={Bot}
      >
        <div className="grid gap-3">
          {["Streaming responses", "Markdown and code highlighting", "Local conversation memory", "Copy-ready answers"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-bold text-white/68">
              {item}
            </div>
          ))}
        </div>
      </PageHero>
      <AIChatAssistant />
      <AIToolsSection />
    </PageFrame>
  );
}
