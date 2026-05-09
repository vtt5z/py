 "use client";

import { TerminalSquare } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { TerminalSection } from "@/components/os/terminal-section";

export default function TerminalPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="AI Terminal"
        title="Command-first intelligence with cinematic output."
        text="Use fast natural-language commands to summarize, debug, generate, explain, rewrite, and transform ideas into action."
        icon={TerminalSquare}
      >
        <pre className="rounded-3xl border border-cyan-200/15 bg-black/45 p-5 font-mono text-sm leading-7 text-cyan-100/80">
          {`> summarize pdf\n> fix flutter error\n> generate startup idea\n> explain sql joins\n\ncursor: online █`}
        </pre>
      </PageHero>
      <TerminalSection />
    </PageFrame>
  );
}
