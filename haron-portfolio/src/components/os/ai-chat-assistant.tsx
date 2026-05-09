"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { MarkdownMessage } from "@/components/os/markdown-message";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starters = [
  "Explain this Flutter Firebase auth error.",
  "Create a premium project case study.",
  "Summarize my PDF into quiz questions.",
  "Write a LinkedIn caption for a data dashboard.",
];

export function AIChatAssistant() {
  const [messages, setMessages] = useLocalStorage<Message[]>("haron-os-chat", [
    {
      role: "assistant",
      content:
        "I am HARON OS. Ask me to debug code, summarize files, write professionally, generate ideas, or design a workflow.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const payload = useMemo(
    () =>
      messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    [messages],
  );

  async function sendMessage(value = input) {
    if (!value.trim() || loading) return;

    const userMessage: Message = { role: "user", content: value.trim() };
    const nextMessages = [...messages, userMessage, { role: "assistant" as const, content: "" }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...payload, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error("AI stream unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(chunk);
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
              ? `HARON OS could not complete the stream: ${error.message}`
              : "HARON OS could not complete the stream.",
        };
        return clone;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ai-assistant" className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
            Streaming Intelligence
          </p>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            AI assistant with memory-shaped conversation flow.
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {starters.map((starter) => (
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
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-bold text-white">HARON OS Assistant</p>
              <p className="text-xs text-white/42">Markdown • code • streaming • history</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMessages([])}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/50 transition hover:text-white"
          >
            Clear
          </button>
        </div>
        <div className="h-[32rem] space-y-4 overflow-y-auto p-5">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "group max-w-[88%] rounded-[1.35rem] border p-4",
                  message.role === "user"
                    ? "ml-auto border-cyan-200/20 bg-cyan-300/12 text-white"
                    : "border-white/10 bg-black/28 text-white/75",
                )}
              >
                {message.role === "assistant" ? (
                  <MarkdownMessage content={message.content || (loading ? "Thinking..." : "")} />
                ) : (
                  <p className="leading-7">{message.content}</p>
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
            placeholder="Ask HARON OS to code, explain, debug, summarize, write..."
            className="h-12 flex-1 rounded-full border border-white/10 bg-black/30 px-5 text-white outline-none placeholder:text-white/35 focus:border-cyan-200/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="grid size-12 place-items-center rounded-full bg-cyan-300 text-slate-950 transition hover:bg-white disabled:opacity-50"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
