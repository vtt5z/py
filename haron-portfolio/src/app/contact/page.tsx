 "use client";

import { Mail } from "lucide-react";

import { OSContactSection } from "@/components/os/os-contact-section";
import { PageFrame } from "@/components/os/page-frame";
import { PageHero } from "@/components/os/page-hero";

export default function ContactPage() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Contact Signal"
        title="Open a professional channel with Haron."
        text="Reach out for software engineering, full-stack systems, data analytics, AI interfaces, dashboards, and future-focused digital products."
        icon={Mail}
      >
        <div className="space-y-3">
          {["mhamad2129@gmail.com", "+91 8699164650", "LinkedIn / Instagram / GitHub"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/28 p-4 font-bold text-white/72">
              {item}
            </div>
          ))}
        </div>
      </PageHero>
      <OSContactSection />
    </PageFrame>
  );
}
