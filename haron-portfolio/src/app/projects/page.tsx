 "use client";

import { Rocket } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";
import { ProjectsGridSection } from "@/components/os/projects-grid-section";

export default function ProjectsPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Project Systems"
        title="Cinematic builds across AI, analytics, apps, and dashboards."
        text="A premium project archive presented like a technology company product lab, with each system designed for clarity, scale, and visual impact."
        icon={Rocket}
      >
        <div className="grid grid-cols-3 gap-3">
          {["AI", "Data", "Apps", "UX", "Cloud", "Viz"].map((item) => (
            <div key={item} className="grid aspect-square place-items-center rounded-2xl border border-white/10 bg-black/28 text-xl font-black text-cyan-100">
              {item}
            </div>
          ))}
        </div>
      </PageHero>
      <ProjectsGridSection />
    </PageFrame>
  );
}
