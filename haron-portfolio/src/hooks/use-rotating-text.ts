"use client";

import { useEffect, useState } from "react";

export function useRotatingText(items: string[], interval = 1800) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, items.length]);

  return items[index];
}
