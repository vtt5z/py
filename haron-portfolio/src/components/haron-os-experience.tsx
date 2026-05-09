"use client";

import { AIChatAssistant } from "@/components/os/ai-chat-assistant";
import { AIToolsSection } from "@/components/os/ai-tools-section";
import { OSHero } from "@/components/os/os-hero";
import { PageFrame } from "@/components/os/page-frame";
import { OSContactSection } from "@/components/os/os-contact-section";
import { StudentHubSection } from "@/components/os/student-hub-section";
import { TerminalSection } from "@/components/os/terminal-section";
import { WorkspaceSection } from "@/components/os/workspace-section";
import { DeveloperToolsSection } from "@/components/tools/developer-tools-section";

export function HaronOSExperience() {
  return (
    <PageFrame loading>
      <OSHero />
      <WorkspaceSection />
      <AIChatAssistant />
      <AIToolsSection />
      <DeveloperToolsSection />
      <StudentHubSection />
      <TerminalSection />
      <OSContactSection />
    </PageFrame>
  );
}
