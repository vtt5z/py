"use client";

import { motion } from "framer-motion";

import { SectionShell } from "@/components/layout/section-shell";
import { useLanguage } from "@/components/providers/language-provider";
import { contactCards } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const { t, dir } = useLanguage();

  return (
    <SectionShell id="contact" eyebrow="Encrypted Channels" title={t.sections.contact}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contactCards.map((card, index) => (
          <motion.a
            key={card.key}
            href={card.href}
            target={card.href.startsWith("http") ? "_blank" : undefined}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.05 }}
            className={cn(
              "group rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-200/50 hover:shadow-[0_0_45px_rgba(34,211,238,0.16)]",
              dir === "rtl" && "text-right",
            )}
          >
            <card.icon className={cn("mb-8 size-8 text-cyan-200", dir === "rtl" && "mr-auto")} />
            <p className="text-sm uppercase tracking-[0.2em] text-white/42">
              {t.contact[card.key as keyof typeof t.contact]}
            </p>
            <p className="mt-3 break-words text-xl font-black text-white">{card.value}</p>
          </motion.a>
        ))}
      </div>
    </SectionShell>
  );
}
