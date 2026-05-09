 "use client";

import { WandSparkles } from "lucide-react";

import { AIToolsSection } from "@/components/os/ai-tools-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { DeveloperToolsSection } from "@/components/tools/developer-tools-section";

export default function ToolsPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Smart Utility Deck"
        title="AI tools with one cinematic control surface."
        text="Upload PDFs, analyze screenshots, rewrite text, generate resumes, test utilities, and move between tasks with operating-system speed."
        icon={WandSparkles}
      >
        <div className="grid grid-cols-2 gap-3">
          {["PDF", "Screenshot", "Writing", "Resume", "JSON", "SQL"].map((tool) => (
            <div key={tool} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-center font-black text-white">
              {tool}
            </div>
          ))}
        </div>
      </PageHero>
      <AIToolsSection />
      <DeveloperToolsSection />
    </PageFrame>
  );
}
