"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-white/10 px-5 py-10 text-center text-sm text-white/50">
      {t.footer}
    </footer>
  );
}
