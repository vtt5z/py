"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";
import { useEffect, useState } from "react";

import { terminalCommands } from "@/lib/haron-os-content";

export function TerminalSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % terminalCommands.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  const active = terminalCommands[index];

  return (
    <section id="terminal" className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          AI Terminal Mode
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          A cinematic command layer for fast AI actions.
        </h2>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-black/50 shadow-[0_0_90px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <TerminalSquare className="size-5 text-cyan-100" />
            <span className="font-mono text-sm uppercase tracking-[0.28em] text-white/55">
              haron-os://terminal
            </span>
          </div>
          <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
        </div>
        <div className="min-h-[30rem] p-6 font-mono">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.command}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-lg text-cyan-100">
                <span className="text-violet-200">&gt;</span> {active.command}
                <span className="ml-2 inline-block h-5 w-2 animate-pulse bg-cyan-200 align-middle" />
              </p>
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/35">
                  Output
                </p>
                <p className="text-lg leading-8 text-white/72">{active.output}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {terminalCommands.map((item) => (
              <div key={item.command} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/48">
                &gt; {item.command}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
