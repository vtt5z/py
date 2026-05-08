"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [active, setActive] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 420, damping: 34 });
  const springY = useSpring(cursorY, { stiffness: 420, damping: 34 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      cursorX.set(event.clientX - 18);
      cursorY.set(event.clientY - 18);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      setActive(Boolean(target.closest("a, button, [data-magnetic], [data-tilt]")));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-9 rounded-full border border-cyan-200/70 mix-blend-screen shadow-[0_0_26px_rgba(34,211,238,0.7)] md:block"
      style={{ x: springX, y: springY }}
      animate={{ scale: active ? 1.85 : 1, opacity: active ? 0.72 : 0.42 }}
      transition={{ duration: 0.2 }}
    />
  );
}
