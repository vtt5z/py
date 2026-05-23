"use client";

import { Bot, House, Radar } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/providers/language-provider";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  const router = useRouter();
  const { dir, t } = useLanguage();

  return (
    <main dir={dir} className="grid min-h-screen place-items-center bg-[#02030a] px-5 text-white">
      <div className="w-full max-w-xl space-y-4">
        <EmptyState
          icon={Radar}
          title={t("notFound.title")}
          description={t("notFound.description")}
          actionLabel={t("common.goHome")}
          onAction={() => router.push("/")}
          hint="404"
        />
        <button
          type="button"
          onClick={() => router.push("/ai")}
          className="mx-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-white/62 transition hover:text-cyan-100"
        >
          <Bot className="size-4" />
          {t("notFound.suggestion")}
        </button>
      </div>
    </main>
  );
}
