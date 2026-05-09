 "use client";

import { LayoutDashboard } from "lucide-react";

import { DashboardSection } from "@/components/os/dashboard-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { WorkspaceSection } from "@/components/os/workspace-section";

export default function WorkspacePage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Workspace Matrix"
        title="The central command room for HARON OS."
        text="A premium operating surface where AI, tools, student workflows, developer utilities, and system activity converge."
        icon={LayoutDashboard}
      >
        <div className="h-72 rounded-3xl border border-cyan-200/15 bg-black/30 p-4">
          <div className="h-full rounded-2xl hologram-grid bg-cyan-300/[0.04]" />
        </div>
      </PageHero>
      <WorkspaceSection />
      <DashboardSection />
    </PageFrame>
  );
}
