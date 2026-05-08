"use client";

import { motion } from "framer-motion";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { dir } = useLanguage();

  return (
    <section
      id={id}
      className={cn(
        "snap-section relative z-10 mx-auto min-h-screen w-full max-w-7xl px-5 py-28 sm:px-8 lg:px-10",
        dir === "rtl" && "font-arabic",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn("mb-12 max-w-3xl", dir === "rtl" && "ml-0 mr-auto text-right")}
      >
        {eyebrow && (
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
            {eyebrow}
          </p>
        )}
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}
