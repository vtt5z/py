"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Copy, Loader2, RotateCcw, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MarkdownMessage } from "@/components/os/markdown-message";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ui = {
  en: {
    eyebrow: "Gemini Intelligence",
    title: "Clean bilingual AI workspace.",
    subtitle: "Gemini 1.5 Flash • markdown • code • fresh sessions",
    intro:
      "Welcome to HARON OS. Ask me to debug, summarize, write, translate, plan, or explain. I’ll keep it clean and practical.",
    placeholder: "Ask HARON OS anything...",
    clear: "Clear chat",
    thinking: "Thinking with Gemini...",
    error: "The AI route returned an error.",
    suggestions: [
      "Fix this Flutter Firebase auth error",
      "Summarize a PDF into study notes",
      "Rewrite this email professionally",
      "Explain SQL joins with examples",
    ],
  },
  ar: {
    eyebrow: "ذكاء Gemini",
    title: "مساحة محادثة ذكية ومنظمة.",
    subtitle: "Gemini 1.5 Flash • ماركداون • أكواد • جلسة جديدة",
    intro:
      "حيّاك في HARON OS. اكتب طلبك بالعربي أو الإنجليزي، وأنا أساعدك بصياغة واضحة وعملية.",
    placeholder: "اسأل HARON OS...",
    clear: "مسح المحادثة",
    thinking: "Gemini يفكر...",
    error: "صار خطأ في مسار الذكاء الاصطناعي.",
    suggestions: [
      "حل مشكلة Flutter Firebase Auth",
      "لخّص PDF إلى ملاحظات مذاكرة",
      "أعد صياغة هذا الإيميل باحتراف",
      "اشرح SQL joins بأمثلة",
    ],
  },
} as const;

function detectArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

export function AIChatAssistant() {
  const { lang, dir, setLanguage } = useLanguage();
  const copy = ui[lang];
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: copy.intro },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: "assistant", content: ui[lang].intro }]);
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const payload = useMemo(
    () =>
      messages
        .filter((message) => message.content.trim())
        .map((message) => ({ role: message.role, content: message.content })),
    [messages],
  );

  function resetChat() {
    setMessages([{ role: "assistant", content: ui[lang].intro }]);
    setInput("");
  }

  async function sendMessage(value = input) {
    if (!value.trim() || loading) return;

    const normalized = value.trim();
    const nextLanguage = detectArabic(normalized) ? "ar" : lang;
    if (nextLanguage !== lang) setLanguage(nextLanguage);

    const userMessage: Message = { role: "user", content: normalized };
    setMessages((current) => [...current, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: nextLanguage,
          messages: [...payload, userMessage],
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok) {
        const detail = contentType.includes("application/json")
          ? ((await response.json()) as { error?: string }).error
          : await response.text();
        throw new Error(detail || copy.error);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        const text = await response.text();
        setMessages((current) => {
          const clone = [...current];
          clone[clone.length - 1] = { role: "assistant", content: text };
          return clone;
        });
        return;
      }

      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(chunk, { stream: true });
        setMessages((current) => {
          const clone = [...current];
          clone[clone.length - 1] = { role: "assistant", content: assistantText };
          return clone;
        });
      }
    } catch (error) {
      setMessages((current) => {
        const clone = [...current];
        clone[clone.length - 1] = {
          role: "assistant",
          content:
            error instanceof Error
              ? `${copy.error}\n\n${error.message}`
              : copy.error,
        };
        return clone;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="ai-assistant"
      className={cn(
        "relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10",
        dir === "rtl" && "font-arabic text-right",
      )}
    >
      <div className="mb-10 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
            {copy.eyebrow}
          </p>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            {copy.title}
          </h2>
        </div>
        <div className={cn("flex flex-wrap gap-2 lg:justify-end", dir === "rtl" && "lg:justify-start")}>
          {copy.suggestions.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => sendMessage(starter)}
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/62 transition hover:border-cyan-200/40 hover:text-cyan-100"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_0_80px_rgba(34,211,238,0.1)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
              <Bot className="size-5" />
            </div>
            <div>
              <p className="font-bold text-white">HARON OS Assistant</p>
              <p className="text-xs text-white/42">{copy.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetChat}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/55 transition hover:text-white"
          >
            <RotateCcw className="size-3" />
            {copy.clear}
          </button>
        </div>
        <div className="h-[34rem] space-y-4 overflow-y-auto scroll-smooth p-4 sm:p-6">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "group w-fit max-w-[92%] rounded-[1.35rem] border p-4 sm:max-w-[84%]",
                  message.role === "user"
                    ? "ml-auto border-cyan-200/20 bg-cyan-300/12 text-white rtl:ml-0 rtl:mr-auto"
                    : "border-white/10 bg-black/28 text-white/75",
                )}
              >
                {message.role === "assistant" ? (
                  <MarkdownMessage
                    content={message.content || (loading ? copy.thinking : "")}
                  />
                ) : (
                  <p className="whitespace-pre-wrap leading-7">{message.content}</p>
                )}
                {message.content && (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(message.content)}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-white/40 opacity-0 transition group-hover:opacity-100"
                  >
                    <Copy className="size-3" />
                    Copy
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100/70">
              <Loader2 className="size-4 animate-spin" />
              {copy.thinking}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
          className="flex gap-3 border-t border-white/10 p-4"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={copy.placeholder}
            className="h-12 min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-5 text-white outline-none placeholder:text-white/35 focus:border-cyan-200/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-cyan-300 text-slate-950 transition hover:bg-white disabled:opacity-50"
          >
            {loading ? <Sparkles className="size-5 animate-pulse" /> : <Send className="size-5" />}
          </button>
        </form>
      </div>
    </section>
  );
}
