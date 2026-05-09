"use client";

import { motion } from "framer-motion";
import { Bot, Command, Cpu } from "lucide-react";

const links = [
  ["Workspace", "#workspace"],
  ["AI", "#ai-assistant"],
  ["Tools", "#developer-tools"],
  ["Student", "#student-hub"],
  ["Terminal", "#terminal"],
];

export function OSNavbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed left-0 right-0 top-4 z-50 px-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#050816]/75 px-4 py-3 shadow-[0_0_55px_rgba(34,211,238,0.08)] backdrop-blur-2xl">
        <a href="#hero" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full border border-cyan-200/30 bg-cyan-300/10 text-cyan-100">
            <Cpu className="size-5" />
          </span>
          <span className="text-sm font-black uppercase tracking-[0.28em] text-white">
            HARON OS
          </span>
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white/56 transition hover:bg-white/10 hover:text-cyan-100"
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="#ai-assistant"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/10 px-4 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950"
        >
          <Bot className="size-4" />
          <span className="hidden sm:inline">Launch AI</span>
          <Command className="size-4 sm:hidden" />
        </a>
      </nav>
    </motion.header>
  );
}
