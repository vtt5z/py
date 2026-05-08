"use client";

import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { rotateX: 60, filter: "blur(10px)", opacity: 0 },
        {
          rotateX: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
        },
      );
    }

    let current = 0;
    const timer = window.setInterval(() => {
      current += Math.ceil(Math.random() * 11);
      if (current >= 100) {
        current = 100;
        window.clearInterval(timer);
        window.setTimeout(() => setDone(true), 420);
      }
      setProgress(current);
    }, 95);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#02030a]"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(18px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.23),transparent_34%),radial-gradient(circle_at_60%_70%,rgba(124,58,237,0.22),transparent_32%)]" />
          <div className="absolute h-[32rem] w-[32rem] animate-spin-slow rounded-full border border-cyan-300/10 border-t-cyan-200/60" />
          <div className="relative text-center">
            <div
              ref={logoRef}
              className="mx-auto grid size-28 place-items-center rounded-[2rem] border border-cyan-200/30 bg-white/[0.04] text-4xl font-black tracking-[0.18em] text-cyan-100 shadow-[0_0_80px_rgba(34,211,238,0.24)] backdrop-blur-2xl"
            >
              HM
            </div>
            <div className="mt-8 h-1 w-72 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
            <p className="mt-4 font-mono text-sm tracking-[0.45em] text-cyan-100/80">
              {progress}% INITIALIZING
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
