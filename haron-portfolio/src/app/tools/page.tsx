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
        eyebrow="Tool Center"
        title="AI tools organized by real work."
        text="Upload PDFs, analyze screenshots, rewrite text, generate resumes, format JSON, generate SQL, and test API workflows from one clear product surface."
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
