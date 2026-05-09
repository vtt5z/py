 "use client";

import { Code2 } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { DeveloperToolsSection } from "@/components/tools/developer-tools-section";

export default function DeveloperPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Developer Mode"
        title="A neon engineering console for fast problem solving."
        text="Format JSON, test regex, generate SQL, inspect APIs, explain code, and debug errors inside a futuristic terminal-style interface."
        icon={Code2}
      >
        <pre className="min-h-72 rounded-3xl border border-white/10 bg-black/45 p-5 font-mono text-sm leading-7 text-cyan-100/80">
          {`> diagnose error --stack=nextjs\n> generate sql --dialect=postgres\n> explain code --level=senior\n\nSYSTEM: developer tools armed`}
        </pre>
      </PageHero>
      <DeveloperToolsSection />
    </PageFrame>
  );
}
