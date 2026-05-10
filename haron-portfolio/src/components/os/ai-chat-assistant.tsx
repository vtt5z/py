"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Check,
  Copy,
  Loader2,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MarkdownMessage } from "@/components/os/markdown-message";
import { useLanguage } from "@/components/providers/language-provider";
import { useRotatingText } from "@/hooks/use-rotating-text";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ui = {
  en: {
    brand: "HARON OS",
    assistant: "HARON OS Assistant",
    eyebrow: "Gemini Intelligence",
    title: "A premium AI workspace for fast, useful answers.",
    subtitle: "Gemini 1.5 Flash • streaming • markdown • code",
    intro:
      "Welcome to HARON OS. Ask me to debug, summarize, write, translate, plan, or explain. I’ll keep it clean, practical, and polished.",
    placeholder: [
      "Ask HARON OS anything...",
      "Start a new conversation",
      "Paste code, errors, notes, or ideas...",
    ],
    clear: "New chat",
    retry: "Regenerate",
    thinking: "Thinking with Gemini",
    copied: "Copied",
    copy: "Copy",
    sendHint: "Enter to send • Shift+Enter for a new line",
    error: "The AI route returned an error.",
    emptyTitle: "How can I help today?",
    emptyText: "Choose a prompt or type your own. Fresh session, no stale history.",
    suggestions: [
      "Fix this Flutter Firebase auth error",
      "Summarize a PDF into study notes",
      "Rewrite this email professionally",
      "Explain SQL joins with examples",
    ],
  },
  ar: {
    brand: "هارون أو إس",
    assistant: "مساعد هارون أو إس",
    eyebrow: "ذكاء Gemini",
    title: "مساحة ذكاء مرتبة وسريعة لنتائج واضحة.",
    subtitle: "Gemini 1.5 Flash • بث سلس • ماركداون • أكواد",
    intro:
      "مرحبًا بك في هارون أو إس. اسألني عن البرمجة، الدراسة، التلخيص، الصياغة، أو حل الأخطاء، وبعطيك جواب واضح وعملي.",
    placeholder: [
      "وش تبي أساعدك فيه؟",
      "اسأل هارون أو إس...",
      "ابدأ محادثة جديدة",
    ],
    clear: "محادثة جديدة",
    retry: "إعادة التوليد",
    thinking: "Gemini يفكر",
    copied: "تم النسخ",
    copy: "نسخ",
    sendHint: "Enter للإرسال • Shift+Enter لسطر جديد",
    error: "صار خطأ في مسار الذكاء الاصطناعي.",
    emptyTitle: "وش ننجز اليوم؟",
    emptyText: "اختر اقتراح أو اكتب طلبك. الجلسة جديدة ونظيفة.",
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
  const placeholder = useRotatingText([...copy.placeholder], 2200);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "0px";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 180)}px`;
  }, [input]);

  const payload = useMemo(
    () =>
      messages
        .filter((message) => message.content.trim())
        .map((message) => ({ role: message.role, content: message.content })),
    [messages],
  );

  function resetChat() {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }

  function retryLast() {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUser || loading) return;
    setMessages((current) => {
      const lastAssistantIndex = current.map((m) => m.role).lastIndexOf("assistant");
      return lastAssistantIndex >= 0 ? current.slice(0, lastAssistantIndex) : current;
    });
    sendMessage(lastUser.content);
  }

  async function copyMessage(content: string, index: number) {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1200);
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
          context: {
            locale: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            localTime: new Date().toLocaleString(),
            device: window.innerWidth < 768 ? "mobile" : "desktop",
          },
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
        setAssistantText(text);
        return;
      }

      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(chunk, { stream: true });
        setAssistantText(assistantText);
      }
    } catch (error) {
      setAssistantText(
        error instanceof Error ? `${copy.error}\n\n${error.message}` : copy.error,
      );
    } finally {
      setLoading(false);
    }
  }

  function setAssistantText(content: string) {
    setMessages((current) => {
      const clone = [...current];
      clone[clone.length - 1] = { role: "assistant", content };
      return clone;
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  const hasConversation = messages.length > 0;

  return (
    <section
      id="ai-assistant"
      className={cn(
        "relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-24 sm:px-8 lg:px-10",
        dir === "rtl" && "font-arabic text-right",
      )}
    >
      <div className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70"
          >
            {copy.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black tracking-tight text-white sm:text-6xl"
          >
            {copy.title}
          </motion.h2>
        </div>
        <div className={cn("flex flex-wrap gap-2 lg:justify-end", dir === "rtl" && "lg:justify-start")}>
          {copy.suggestions.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => sendMessage(starter)}
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/62 transition hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-cyan-300/10 hover:text-cyan-100"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_0_90px_rgba(34,211,238,0.11)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative grid size-11 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-cyan-300/10" />
              <Bot className="relative size-5" />
            </div>
            <div>
              <p className="font-bold text-white">{copy.assistant}</p>
              <p className="text-xs text-white/42">{copy.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={retryLast}
              disabled={loading || !messages.some((message) => message.role === "user")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/55 transition hover:text-white disabled:opacity-35"
            >
              <RefreshCw className="size-3" />
              {copy.retry}
            </button>
            <button
              type="button"
              onClick={resetChat}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/55 transition hover:text-white"
            >
              <RotateCcw className="size-3" />
              {copy.clear}
            </button>
          </div>
        </div>

        <div className="h-[34rem] overflow-y-auto scroll-smooth p-4 sm:h-[38rem] sm:p-6">
          {!hasConversation && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="grid h-full place-items-center text-center"
            >
              <div className="max-w-xl">
                <div className="mx-auto mb-6 grid size-16 place-items-center rounded-[1.4rem] border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_45px_rgba(34,211,238,0.16)]">
                  <Sparkles className="size-7" />
                </div>
                <h3 className="text-3xl font-black text-white">{copy.emptyTitle}</h3>
                <p className="mt-3 text-white/56">{copy.emptyText}</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" && "justify-end",
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="mt-1 hidden size-9 shrink-0 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100 sm:grid">
                      <Bot className="size-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "group max-w-[92%] rounded-[1.35rem] border p-4 leading-7 sm:max-w-[78%]",
                      message.role === "user"
                        ? "border-cyan-200/20 bg-cyan-300/12 text-white"
                        : "border-white/10 bg-black/28 text-white/75",
                    )}
                  >
                    {message.role === "assistant" ? (
                      message.content ? (
                        <MarkdownMessage content={message.content} />
                      ) : (
                        <TypingIndicator label={copy.thinking} />
                      )
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    {message.content && (
                      <div className="mt-3 flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => copyMessage(message.content, index)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-2.5 py-1 text-xs font-bold text-white/42 transition hover:text-white"
                        >
                          {copiedIndex === index ? <Check className="size-3" /> : <Copy className="size-3" />}
                          {copiedIndex === index ? copy.copied : copy.copy}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/10 p-3 sm:p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="relative rounded-[1.6rem] border border-white/10 bg-black/35 p-3 shadow-[inset_0_0_30px_rgba(255,255,255,0.025)] transition focus-within:border-cyan-200/45"
          >
            <textarea
              ref={inputRef}
              value={input}
              rows={1}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="max-h-44 min-h-12 w-full resize-none bg-transparent py-3 pl-4 pr-16 leading-7 text-white outline-none placeholder:text-white/34 rtl:pl-16 rtl:pr-4"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.24)] transition hover:bg-white disabled:opacity-45 rtl:left-3 rtl:right-auto"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </button>
          </form>
          <p className="mt-2 px-2 text-xs text-white/35">{copy.sendHint}</p>
        </div>
      </div>
    </section>
  );
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-cyan-100/75">
      <Loader2 className="size-4 animate-spin" />
      <span className="text-sm font-semibold">{label}</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="size-1.5 animate-bounce rounded-full bg-cyan-200/70"
            style={{ animationDelay: `${item * 110}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
