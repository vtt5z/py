"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14 });
  const springY = useSpring(y, { stiffness: 180, damping: 14 });

  const props = {
    "data-magnetic": true,
    className: cn(
      "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-cyan-200/30 bg-white/[0.06] px-6 text-sm font-bold text-white shadow-[0_0_28px_rgba(34,211,238,0.2)] backdrop-blur-xl transition hover:border-cyan-200/70",
      className,
    ),
    style: { x: springX, y: springY },
    onMouseMove: (event: React.MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
      y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
    },
    onMouseLeave: () => {
      x.set(0);
      y.set(0);
    },
  };

  if (href) {
    return (
      <motion.a href={href} {...props}>
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-300/0 via-cyan-200/20 to-fuchsia-300/0 opacity-0 transition group-hover:opacity-100" />
        {children}
      </motion.a>
    );
  }

  return <motion.button {...props}>{children}</motion.button>;
}
