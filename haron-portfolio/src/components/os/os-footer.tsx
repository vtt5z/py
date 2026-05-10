import { useLanguage } from "@/components/providers/language-provider";

export function OSFooter() {
  const { lang } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-white/10 px-5 py-10 text-center text-sm text-white/45">
      {lang === "ar"
        ? "هارون أو إس — نظام تشغيل ذكي من هارون محمد"
        : "HARON OS — AI-powered digital operating system by Haron Mohammed"}
    </footer>
  );
}
