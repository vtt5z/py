"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function OSCard({
  title,
  text,
  icon: Icon,
  className,
  children,
}: {
  title: string;
  text?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_0_50px_rgba(34,211,238,0.06)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/45 hover:shadow-[0_0_70px_rgba(34,211,238,0.14)]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_0%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_85%_100%,rgba(139,92,246,0.15),transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative">
        {Icon && (
          <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.14)]">
            <Icon className="size-5" />
          </div>
        )}
        <h3 className="text-xl font-black tracking-tight text-white">{title}</h3>
        {text && <p className="mt-3 text-sm leading-6 text-white/58">{text}</p>}
        {children}
      </div>
    </motion.div>
  );
}
