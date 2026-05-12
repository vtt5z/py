"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";

import { UserMenu } from "@/components/auth/user-menu";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

const ids = ["hero", "about", "skills", "experience", "projects", "analytics", "contact"];

export function Navbar() {
  const { lang, dir, t, toggleLanguage } = useLanguage();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-4 z-50 px-4"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#050815]/70 px-4 py-3 shadow-[0_0_50px_rgba(34,211,238,0.08)] backdrop-blur-2xl",
          dir === "rtl" && "font-arabic",
        )}
      >
        <a href="#hero" className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full border border-cyan-200/30 bg-cyan-300/10 text-sm font-black text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
            HM
          </span>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-white/70 sm:block">
            {lang === "ar" ? "هارون" : "Haron OS"}
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {t.nav.map((item, index) => (
            <a
              key={item}
              href={`#${ids[index]}`}
              className="rounded-full px-4 py-2 text-sm text-white/62 transition hover:bg-white/10 hover:text-cyan-100"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <UserMenu compact />
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-violet-200/20 bg-white/[0.06] px-4 text-sm font-bold text-white transition hover:border-cyan-200/60 hover:bg-cyan-300/10"
          >
            <Languages className="size-4" />
            {lang === "en" ? "AR" : "EN"}
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
