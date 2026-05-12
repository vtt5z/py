"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export type LocalizedText = string | { en: string; ar: string };

export function PageHero({
  eyebrow,
  title,
  text,
  icon: Icon,
  children,
  compact = false,
}: {
  eyebrow: LocalizedText;
  title: LocalizedText;
  text: LocalizedText;
  icon: LucideIcon;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  const { lang, dir } = useLanguage();
  const localizedEyebrow = localizeBrand(resolveText(eyebrow, lang), lang);
  const localizedTitle = localizeBrand(resolveText(title, lang), lang);
  const localizedText = localizeBrand(resolveText(text, lang), lang);

  return (
    <section
      className={cn(
        "relative z-10 mx-auto flex max-w-7xl items-end px-5 pb-12 pt-28 sm:px-8 lg:px-10",
        compact ? "min-h-[34rem]" : "min-h-[48rem]",
        dir === "rtl" && "font-arabic text-right",
      )}
    >
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, x: -36, filter: "blur(12px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-200/20 bg-white/[0.045] px-4 py-2 text-sm font-bold text-cyan-100/76 backdrop-blur-xl">
            <Icon className="size-4" />
            {localizedEyebrow}
          </div>
          <h1 className="max-w-5xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {localizedTitle}
          </h1>
          <p className="mt-7 max-w-3xl text-lg font-semibold leading-8 text-white/64 sm:text-xl">
            {localizedText}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(34,211,238,0.18),transparent_42%),radial-gradient(circle_at_75%_85%,rgba(139,92,246,0.18),transparent_38%)]" />
          <div className="relative">{children}</div>
        </motion.div>
      </div>
    </section>
  );
}

function localizeBrand(value: string, lang: "en" | "ar") {
  return lang === "ar" ? value.replaceAll("HARON OS", "هارون أو إس") : value;
}

function resolveText(value: LocalizedText, lang: "en" | "ar") {
  return typeof value === "string" ? value : value[lang];
}
