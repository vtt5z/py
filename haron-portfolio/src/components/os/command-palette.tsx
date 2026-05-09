"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { commandPaletteItems } from "@/lib/haron-os-content";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(
    () =>
      commandPaletteItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 hidden rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/80 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl transition hover:border-cyan-200/50 hover:text-cyan-100 md:inline-flex"
      >
        Ctrl K
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-start bg-black/55 px-4 pt-24 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              className="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-cyan-200/20 bg-[#050816]/95 shadow-[0_0_90px_rgba(34,211,238,0.22)] backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <Search className="size-5 text-cyan-100" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tools, pages, AI actions..."
                  className="w-full bg-transparent text-lg text-white outline-none placeholder:text-white/34"
                />
                <button type="button" onClick={() => setOpen(false)} className="text-white/50">
                  <X className="size-5" />
                </button>
              </div>
              <div className="max-h-[25rem] overflow-y-auto p-3">
                {filtered.map((item) => (
                  <a
                    key={item.label}
                    href={item.target}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3 text-white/75 transition hover:bg-cyan-300/10 hover:text-cyan-100"
                  >
                    <item.icon className="size-5" />
                    <span className="font-semibold">{item.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
