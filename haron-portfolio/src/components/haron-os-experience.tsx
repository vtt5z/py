"use client";

import { AIChatAssistant } from "@/components/os/ai-chat-assistant";
import { AIToolsSection } from "@/components/os/ai-tools-section";
import { CommandPalette } from "@/components/os/command-palette";
import { OSContactSection } from "@/components/os/os-contact-section";
import { OSFooter } from "@/components/os/os-footer";
import { OSHero } from "@/components/os/os-hero";
import { OSNavbar } from "@/components/os/os-navbar";
import { StudentHubSection } from "@/components/os/student-hub-section";
import { TerminalSection } from "@/components/os/terminal-section";
import { WorkspaceSection } from "@/components/os/workspace-section";
import { DeveloperToolsSection } from "@/components/tools/developer-tools-section";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { HolographicBackground } from "@/components/effects/holographic-background";
import { LoadingScreen } from "@/components/effects/loading-screen";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

export function HaronOSExperience() {
  return (
    <SmoothScroll>
      <LoadingScreen />
      <CustomCursor />
      <HolographicBackground />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.13),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(139,92,246,0.16),transparent_25%),radial-gradient(circle_at_50%_95%,rgba(6,182,212,0.08),transparent_34%),linear-gradient(180deg,#02030a_0%,#050816_42%,#02030a_100%)]" />
      <div className="fixed inset-0 z-0 opacity-[0.18] futuristic-grid" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.04),transparent)] opacity-40" />
      <OSNavbar />
      <CommandPalette />
      <main className="relative z-10">
        <OSHero />
        <WorkspaceSection />
        <AIChatAssistant />
        <AIToolsSection />
        <DeveloperToolsSection />
        <StudentHubSection />
        <TerminalSection />
        <OSContactSection />
      </main>
      <OSFooter />
    </SmoothScroll>
  );
}
