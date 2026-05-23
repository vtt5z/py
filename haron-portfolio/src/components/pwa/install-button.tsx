"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallButton({ compact = false }: { compact?: boolean }) {
  const { lang } = useLanguage();
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!promptEvent || installed) return null;

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setPromptEvent(null);
  }

  return (
    <button
      type="button"
      onClick={install}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white/65 transition hover:border-cyan-200/50 hover:text-cyan-100",
        compact && "grid size-11 shrink-0 place-items-center rounded-2xl px-0",
      )}
      title={lang === "ar" ? "ثبّت هارون أو إس" : "Install HARON OS"}
    >
      <Download className="size-4" />
      {!compact && <span className="hidden xl:inline">{lang === "ar" ? "ثبّت التطبيق" : "Install"}</span>}
    </button>
  );
}
