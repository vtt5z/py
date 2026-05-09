 "use client";

import { Gauge } from "lucide-react";

import { DashboardSection } from "@/components/os/dashboard-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";

export default function DashboardPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Live System Monitoring"
        title="AI statistics and operating-system intelligence."
        text="Monitor activity, tool runs, storage readiness, AI usage, performance signals, and live widgets in a premium dashboard."
        icon={Gauge}
      >
        <div className="grid grid-cols-2 gap-3">
          {["AI: 96%", "Tools: 72", "Storage: Ready", "Health: Live"].map((stat) => (
            <div key={stat} className="rounded-2xl border border-white/10 bg-black/28 p-5 text-xl font-black text-white">
              {stat}
            </div>
          ))}
        </div>
      </PageHero>
      <DashboardSection />
    </PageFrame>
  );
}
