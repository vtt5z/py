"use client";

import { AlertTriangle } from "lucide-react";

import { PageFrame } from "@/components/os/page-frame";
import { useLanguage } from "@/components/providers/language-provider";
import { EmptyState } from "@/components/ui/empty-state";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang, t } = useLanguage();

  return (
    <PageFrame>
      <main className="grid min-h-[70vh] place-items-center px-4 py-24">
        <EmptyState
          icon={AlertTriangle}
          title={t("common.error")}
          description={
            lang === "ar"
              ? "تعذر عرض هذه الواجهة في هارون أو إس. أعد المحاولة بأمان بدون فقدان جلستك."
              : "HARON OS could not render this view. Retry safely without losing your session."
          }
          actionLabel={t("common.retry")}
          onAction={reset}
          hint={lang === "ar" ? "إعادة آمنة" : "Safe retry"}
        />
      </main>
    </PageFrame>
  );
}
