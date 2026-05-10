"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  BriefcaseBusiness,
  FileSearch,
  FileText,
  FileUp,
  ImageUp,
  Languages,
  type LucideIcon,
  Loader2,
  MessageSquareText,
  PenLine,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { MarkdownMessage } from "@/components/os/markdown-message";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

type ToolKey = "writer" | "translation" | "resume" | "caption" | "summarizer" | "pdf" | "screenshot" | "data";

type ToolItem = {
  key: ToolKey;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  placeholder: string;
  cta: string;
};

type ToolGroup = {
  title: string;
  description: string;
  tools: ToolItem[];
};

const toolGroups: Record<"en" | "ar", ToolGroup[]> = {
  en: [
    {
      title: "AI Productivity",
      description: "Write, rewrite, translate, summarize, and create polished professional content.",
      tools: [
        { key: "writer", title: "Smart Writer", subtitle: "Emails, messages, and polished rewrites", icon: PenLine, placeholder: "Paste an email or rough text. Example: Ask for a meeting politely.", cta: "Rewrite text" },
        { key: "translation", title: "Translation Assistant", subtitle: "Clear English and Arabic translation", icon: Languages, placeholder: "Paste text to translate. Example: Translate this message to Arabic.", cta: "Translate" },
        { key: "resume", title: "Resume Builder", subtitle: "Modern CV sections and role-focused bullets", icon: BriefcaseBusiness, placeholder: "Paste your skills, education, projects, and target role.", cta: "Generate CV" },
        { key: "caption", title: "Caption Generator", subtitle: "LinkedIn and social captions", icon: MessageSquareText, placeholder: "Describe your post or project result.", cta: "Create caption" },
        { key: "summarizer", title: "Summarizer", subtitle: "Turn long text into clear takeaways", icon: FileText, placeholder: "Paste notes, an article, or lecture content.", cta: "Summarize" },
      ],
    },
    {
      title: "Analysis",
      description: "Analyze screenshots, PDFs, data, and raw information with practical outputs.",
      tools: [
        { key: "pdf", title: "PDF Analyzer", subtitle: "Summary, key points, notes, and quizzes", icon: FileSearch, placeholder: "Upload a PDF to generate a study-ready summary.", cta: "Analyze PDF" },
        { key: "screenshot", title: "Screenshot Analysis", subtitle: "UI feedback, bugs, and debugging clues", icon: ImageUp, placeholder: "Upload a screenshot to analyze UI issues or errors.", cta: "Analyze image" },
        { key: "data", title: "Data Interpreter", subtitle: "Explain numbers, tables, and insights", icon: BarChart3, placeholder: "Paste CSV rows, metrics, or dashboard notes.", cta: "Interpret data" },
      ],
    },
  ],
  ar: [
    {
      title: "إنتاجية بالذكاء الاصطناعي",
      description: "اكتب، أعد الصياغة، ترجم، لخّص، وأنشئ محتوى احترافي بسرعة.",
      tools: [
        { key: "writer", title: "الكاتب الذكي", subtitle: "إيميلات ورسائل وصياغة احترافية", icon: PenLine, placeholder: "الصق نصًا أو رسالة. مثال: اكتب طلب اجتماع بشكل لبق.", cta: "أعد الصياغة" },
        { key: "translation", title: "مساعد الترجمة", subtitle: "ترجمة واضحة بين العربي والإنجليزي", icon: Languages, placeholder: "الصق النص المطلوب ترجمته.", cta: "ترجم" },
        { key: "resume", title: "منشئ السيرة الذاتية", subtitle: "سيرة حديثة ونقاط مناسبة للوظيفة", icon: BriefcaseBusiness, placeholder: "الصق مهاراتك، تعليمك، مشاريعك، والوظيفة المستهدفة.", cta: "أنشئ السيرة" },
        { key: "caption", title: "منشئ التعليقات", subtitle: "تعليقات LinkedIn ومنشورات احترافية", icon: MessageSquareText, placeholder: "صف المنشور أو المشروع.", cta: "أنشئ تعليق" },
        { key: "summarizer", title: "الملخّص", subtitle: "حوّل النصوص الطويلة إلى نقاط واضحة", icon: FileText, placeholder: "الصق ملاحظات أو مقال أو محتوى محاضرة.", cta: "لخّص" },
      ],
    },
    {
      title: "التحليل",
      description: "حلّل الصور والملفات والبيانات بمخرجات عملية ومفهومة.",
      tools: [
        { key: "pdf", title: "محلل PDF", subtitle: "ملخص، نقاط مهمة، ملاحظات، وأسئلة", icon: FileSearch, placeholder: "ارفع ملف PDF لتحصل على ملخص جاهز للمذاكرة.", cta: "حلّل PDF" },
        { key: "screenshot", title: "تحليل الصور", subtitle: "ملاحظات واجهة وأخطاء واقتراحات إصلاح", icon: ImageUp, placeholder: "ارفع لقطة شاشة لتحليل مشاكل الواجهة أو الأخطاء.", cta: "حلّل الصورة" },
        { key: "data", title: "مفسّر البيانات", subtitle: "شرح الأرقام والجداول والمؤشرات", icon: BarChart3, placeholder: "الصق أرقامًا أو مؤشرات أو ملاحظات لوحة بيانات.", cta: "فسّر البيانات" },
      ],
    },
  ],
};

export function AIToolsSection() {
  const { lang, dir } = useLanguage();
  const groups = toolGroups[lang];
  const [activeKey, setActiveKey] = useState<ToolKey>("writer");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState("");
  const [textInput, setTextInput] = useState("");
  const [fileName, setFileName] = useState("");

  const activeTool = useMemo(
    () => groups.flatMap((group) => group.tools).find((tool) => tool.key === activeKey) ?? groups[0].tools[0],
    [activeKey, groups],
  );

  async function submitFile(endpoint: string, file: File | null, prompt?: string) {
    if (!file) return;
    setLoading(activeTool.key);
    setResult("");
    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    if (prompt) formData.append("prompt", prompt);

    try {
      const response = await fetch(endpoint, { method: "POST", body: formData });
      const data = (await response.json()) as { result?: string; error?: string };
      setResult(data.result ?? data.error ?? fallbackText(lang));
    } catch {
      setResult(fallbackText(lang));
    } finally {
      setLoading("");
    }
  }

  async function runTextTool() {
    if (!textInput.trim()) {
      setResult(lang === "ar" ? "أضف نصًا أولًا حتى أقدر أساعدك." : "Add some input first so HARON OS can help.");
      return;
    }

    setLoading(activeTool.key);
    setResult("");
    const endpoint = activeKey === "resume" ? "/api/ai/resume" : "/api/ai/writing";
    const mode = modeFor(activeKey);
    const body =
      activeKey === "resume"
        ? { profile: textInput, targetRole: "Software Engineer / Data Analyst" }
        : { input: textInput, mode };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { result?: string; error?: string };
      setResult(data.result ?? data.error ?? fallbackText(lang));
    } catch {
      setResult(fallbackText(lang));
    } finally {
      setLoading("");
    }
  }

  return (
    <section
      id="ai-tools"
      className={cn(
        "relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10",
        dir === "rtl" && "font-arabic text-right",
      )}
    >
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.32em] text-cyan-200/70">
          {lang === "ar" ? "مركز الأدوات" : "Tool Center"}
        </p>
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
          {lang === "ar" ? "أدوات واضحة حسب نوع العمل." : "Organized tools for real workflows."}
        </h2>
        <p className="mt-4 text-white/56">
          {lang === "ar"
            ? "اختر الأداة، أضف المحتوى، واحصل على مخرجات قابلة للاستخدام مباشرة."
            : "Pick a tool, provide input, and get a usable output without guessing what each panel does."}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-2xl">
              <div className="mb-4">
                <h3 className="text-xl font-black text-white">{group.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/50">{group.description}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {group.tools.map((tool) => (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => {
                      setActiveKey(tool.key);
                      setResult("");
                      setTextInput("");
                      setFileName("");
                    }}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 rtl:text-right",
                      activeKey === tool.key
                        ? "border-cyan-200/55 bg-cyan-300/10"
                        : "border-white/10 bg-black/20 hover:border-white/20",
                    )}
                  >
                    <tool.icon className="mb-4 size-5 text-cyan-100" />
                    <p className="font-black text-white">{tool.title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/48">{tool.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-start gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
                <activeTool.icon className="size-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">{activeTool.title}</h3>
                <p className="mt-1 text-sm text-white/52">{activeTool.subtitle}</p>
              </div>
            </div>
            {loading && <Loader2 className="size-5 animate-spin text-cyan-100" />}
          </div>

          <div className="mt-5">
            {activeKey === "pdf" || activeKey === "screenshot" ? (
              <label className="block rounded-2xl border border-dashed border-cyan-200/25 bg-black/25 p-5 transition hover:border-cyan-200/50">
                <div className="flex items-center gap-3">
                  <FileUp className="size-5 text-cyan-100" />
                  <div>
                    <p className="font-bold text-white">
                      {activeKey === "pdf"
                        ? lang === "ar" ? "ارفع ملف PDF" : "Upload a PDF"
                        : lang === "ar" ? "ارفع لقطة شاشة" : "Upload a screenshot"}
                    </p>
                    <p className="mt-1 text-sm text-white/45">{activeTool.placeholder}</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept={activeKey === "pdf" ? "application/pdf" : "image/*"}
                  className="mt-5 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:font-bold file:text-slate-950 rtl:file:ml-4 rtl:file:mr-0"
                  onChange={(event) =>
                    submitFile(
                      activeKey === "pdf" ? "/api/ai/pdf" : "/api/ai/screenshot",
                      event.target.files?.[0] ?? null,
                      activeKey === "screenshot"
                        ? "Analyze UI issues, errors, accessibility, and practical fixes."
                        : undefined,
                    )
                  }
                />
                {fileName && <p className="mt-3 text-xs text-cyan-100/70">{fileName}</p>}
              </label>
            ) : (
              <>
                <textarea
                  value={textInput}
                  onChange={(event) => setTextInput(event.target.value)}
                  placeholder={activeTool.placeholder}
                  className="min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none placeholder:text-white/34 focus:border-cyan-200/45"
                />
                <button
                  type="button"
                  onClick={runTextTool}
                  disabled={Boolean(loading)}
                  className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-white disabled:opacity-50"
                >
                  <WandSparkles className="size-4" />
                  {activeTool.cta}
                </button>
              </>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/28 p-4">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-100/60">
                {lang === "ar" ? "النتيجة" : "Output"}
              </p>
              {result && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/45 transition hover:text-white"
                >
                  {lang === "ar" ? "نسخ" : "Copy"}
                </button>
              )}
            </div>
            <div className="max-h-[28rem] min-h-52 overflow-y-auto">
              {loading ? (
                <LoadingState label={lang === "ar" ? "جاري إنشاء النتيجة..." : "Generating output..."} />
              ) : result ? (
                <MarkdownMessage content={result} />
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title={lang === "ar" ? "ابدأ من الأعلى" : "Ready when you are"}
                  text={activeTool.placeholder}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function modeFor(key: ToolKey) {
  const modes: Record<ToolKey, string> = {
    writer: "Rewrite into clear, professional text",
    translation: "Translate naturally between English and Arabic",
    resume: "Generate a modern resume",
    caption: "Create concise professional captions",
    summarizer: "Summarize into useful key points",
    data: "Interpret data and extract insights",
    pdf: "PDF analysis",
    screenshot: "Screenshot analysis",
  };

  return modes[key];
}

function fallbackText(lang: "en" | "ar") {
  return lang === "ar"
    ? "تعذر تشغيل الأداة الآن. جرّب مرة ثانية أو تأكد من إعداد Gemini."
    : "This tool could not run right now. Try again or check Gemini configuration.";
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100/70">
        <Loader2 className="size-4 animate-spin" />
        {label}
      </div>
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-4 animate-pulse rounded-full bg-white/10" style={{ width: `${90 - item * 16}%` }} />
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="grid min-h-52 place-items-center text-center">
      <div className="max-w-sm">
        <Icon className="mx-auto mb-4 size-9 text-cyan-100/55" />
        <p className="font-black text-white">{title}</p>
        <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
      </div>
    </div>
  );
}
