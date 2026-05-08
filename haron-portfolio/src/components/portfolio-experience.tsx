"use client";

import { AboutSection } from "@/components/sections/about-section";
import { AnalyticsSection } from "@/components/sections/analytics-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { HolographicBackground } from "@/components/effects/holographic-background";
import { LoadingScreen } from "@/components/effects/loading-screen";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { LanguageProvider } from "@/components/providers/language-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

export function PortfolioExperience() {
  return (
    <LanguageProvider>
      <SmoothScroll>
        <LoadingScreen />
        <CustomCursor />
        <HolographicBackground />
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.16),transparent_25%),linear-gradient(180deg,#02030a_0%,#050819_46%,#02030a_100%)]" />
        <div className="fixed inset-0 z-0 opacity-[0.17] futuristic-grid" />
        <Navbar />
        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <AnalyticsSection />
          <ContactSection />
        </main>
        <Footer />
      </SmoothScroll>
    </LanguageProvider>
  );
}
