"use client";

import { motion } from "framer-motion";
import { Copy, Loader2, Play } from "lucide-react";
import { useMemo, useState } from "react";

import { OSCard } from "@/components/os/os-card";
import { useLanguage } from "@/components/providers/language-provider";
import { developerTools } from "@/lib/haron-os-content";
import { cn } from "@/lib/utils";

type ToolMode = "json" | "regex" | "sql" | "api" | "code" | "debug";

export function DeveloperToolsSection() {
  const { lang, dir } = useLanguage();
  const [mode, setMode] = useState<ToolMode>("json");
  const [input, setInput] = useState('{"name":"HARON OS","type":"AI workspace"}');
  const [pattern, setPattern] = useState("\\w+");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const activeTool = useMemo(
    () => developerTools.find((tool) => tool.id === mode) ?? developerTools[0],
    [mode],
  );

  async function runTool() {
    if (!input.trim()) {
      setOutput(lang === "ar" ? "أضف محتوى أولًا لتشغيل الأداة." : "Add input first to run this tool.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "json") {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (mode === "regex") {
        const regex = new RegExp(pattern, "g");
        const matches = [...input.matchAll(regex)].map((match) => match[0]);
        setOutput(matches.length ? matches.join("\n") : "No matches found.");
      } else if (mode === "api") {
        if (!/^https?:\/\//i.test(input.trim())) {
          setOutput(lang === "ar" ? "أدخل رابط API يبدأ بـ http أو https." : "Enter an API URL starting with http or https.");
          return;
        }
        const response = await fetch(input);
        const text = await response.text();
        setOutput(text.slice(0, 6000));
      } else {
        const endpoint = mode === "sql" ? "/api/tools/sql" : "/api/ai/writing";
        const body =
          mode === "sql"
            ? { prompt: input, dialect: "PostgreSQL" }
            : {
                input,
                mode:
                  mode === "code"
                    ? "Explain this code like a senior engineer"
                    : "Debug this error with root cause and fixes",
              };
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await response.json()) as { result?: string; error?: string };
        setOutput(data.result ?? data.error ?? "No output.");
      }
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Tool failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="developer-tools"
      className={cn(
        "relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10",
        dir === "rtl" && "font-arabic text-right",
      )}
    >
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          {lang === "ar" ? "أدوات المطور" : "Developer Tools"}
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          {lang === "ar"
            ? "مساحة واضحة لتنسيق الكود، اختبار API، وتوليد SQL."
            : "Clear utilities for code, APIs, SQL, regex, and debugging."}
        </h2>
        <p className="mt-4 text-white/56">
          {lang === "ar"
            ? "اختر الأداة، الصق المدخلات، وشغّلها. النتيجة تظهر بشكل مباشر وقابل للنسخ."
            : "Choose a tool, paste input, and run it. Results are readable, copyable, and practical."}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {developerTools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => {
              setMode(tool.id as ToolMode);
              setInput(defaultInput(tool.id as ToolMode, lang));
              setOutput("");
            }}
            className="text-left rtl:text-right"
          >
            <OSCard
              title={tool.title}
              text={tool.action}
              icon={tool.icon}
              className={mode === tool.id ? "border-cyan-200/60 bg-cyan-300/10" : ""}
            />
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
          <div className="mb-4 flex items-center gap-3">
            <activeTool.icon className="size-6 text-cyan-100" />
            <div>
              <p className="font-bold text-white">{activeTool.title}</p>
              <p className="text-sm text-white/42">{activeTool.action}</p>
              <p className="mt-2 text-xs leading-5 text-white/38">{hintFor(mode, lang)}</p>
            </div>
          </div>
          {mode === "regex" && (
            <input
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              className="mb-4 h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 font-mono text-cyan-100 outline-none"
              placeholder="Regex pattern"
            />
          )}
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-[24rem] w-full rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-sm leading-7 text-white outline-none placeholder:text-white/34"
            placeholder={placeholderFor(mode, lang)}
          />
          <button
            type="button"
            onClick={runTool}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-white"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            {lang === "ar" ? "تشغيل الأداة" : "Run Tool"}
          </button>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 backdrop-blur-2xl">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-100/60">
              {lang === "ar" ? "النتيجة" : "Output"}
            </p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(output)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/45 transition hover:text-white"
            >
              <Copy className="size-3" />
              {lang === "ar" ? "نسخ" : "Copy"}
            </button>
          </div>
          <pre className="max-h-[32rem] min-h-64 overflow-auto whitespace-pre-wrap rounded-2xl bg-black/30 p-4 font-mono text-sm leading-7 text-cyan-50/80">
            {loading
              ? lang === "ar" ? "جاري التشغيل..." : "Running..."
              : output || (lang === "ar" ? "شغّل الأداة لعرض النتيجة هنا." : "Run the tool to see output here.")}
          </pre>
        </div>
      </div>
    </section>
  );
}

function defaultInput(mode: ToolMode, lang: "en" | "ar") {
  const en: Record<ToolMode, string> = {
    json: '{"project":"HARON OS","status":"production-ready"}',
    regex: "Email: haron@example.com\nPhone: +91 8699164650",
    sql: "Create a SQL query for monthly revenue by customer segment.",
    api: "https://jsonplaceholder.typicode.com/todos/1",
    code: "function total(items) { return items.reduce((sum, item) => sum + item.price, 0); }",
    debug: "FirebaseAuthException: user-not-found while signing in with email/password",
  };

  const ar: Record<ToolMode, string> = {
    json: '{"project":"هارون أو إس","status":"جاهز"}',
    regex: "البريد: haron@example.com\nالهاتف: +91 8699164650",
    sql: "أنشئ استعلام SQL يحسب الإيرادات الشهرية حسب نوع العميل.",
    api: "https://jsonplaceholder.typicode.com/todos/1",
    code: "function total(items) { return items.reduce((sum, item) => sum + item.price, 0); }",
    debug: "FirebaseAuthException: user-not-found أثناء تسجيل الدخول بالبريد وكلمة المرور",
  };

  return (lang === "ar" ? ar : en)[mode];
}

function placeholderFor(mode: ToolMode, lang: "en" | "ar") {
  const en: Record<ToolMode, string> = {
    json: "Paste JSON to format and validate...",
    regex: "Paste sample text to test against your regex...",
    sql: "Describe the query you need or paste a schema...",
    api: "Paste an API endpoint URL...",
    code: "Paste code you want explained...",
    debug: "Paste an error message or stack trace...",
  };
  const ar: Record<ToolMode, string> = {
    json: "الصق JSON لتنسيقه والتحقق منه...",
    regex: "الصق نصًا لاختبار Regex عليه...",
    sql: "اكتب الاستعلام المطلوب أو الصق schema...",
    api: "الصق رابط API...",
    code: "الصق الكود المطلوب شرحه...",
    debug: "الصق رسالة الخطأ أو stack trace...",
  };
  return (lang === "ar" ? ar : en)[mode];
}

function hintFor(mode: ToolMode, lang: "en" | "ar") {
  const en: Record<ToolMode, string> = {
    json: "Formats JSON and shows parsing errors clearly.",
    regex: "Use the regex pattern field, then paste sample text below.",
    sql: "Generates a query and explains assumptions.",
    api: "Fetches a public endpoint and previews the response.",
    code: "Explains intent, flow, and improvement ideas.",
    debug: "Finds likely causes, fixes, and verification steps.",
  };
  const ar: Record<ToolMode, string> = {
    json: "ينسّق JSON ويعرض أخطاء التحليل بوضوح.",
    regex: "اكتب النمط في الحقل ثم الصق نص التجربة.",
    sql: "ينشئ الاستعلام ويشرح الافتراضات.",
    api: "يجلب رابط API عام ويعرض الاستجابة.",
    code: "يشرح الفكرة والتدفق والتحسينات.",
    debug: "يحدد السبب المحتمل وخطوات الإصلاح والتحقق.",
  };
  return (lang === "ar" ? ar : en)[mode];
}
