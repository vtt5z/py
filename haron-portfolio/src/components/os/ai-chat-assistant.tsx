"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Bot,
  Check,
  Copy,
  FileUp,
  Folder,
  Loader2,
  Mic,
  PanelRight,
  Pin,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { MarkdownMessage } from "@/components/os/markdown-message";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { useConversations } from "@/hooks/use-conversations";
import { useRotatingText } from "@/hooks/use-rotating-text";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const ui = {
  en: {
    assistant: "HARON OS Assistant",
    status: "Gemini core online",
    workspace: "Assistant Workspace",
    newChat: "New chat",
    search: "Search chats...",
    pinned: "Pinned",
    recent: "Recent chats",
    folders: "Folders",
    noChats: "No saved chats yet",
    tools: "Context tools",
    memory: "Memory",
    quick: "Quick actions",
    upload: "Attach file",
    voice: "Voice input",
    send: "Send",
    copy: "Copy",
    copied: "Copied",
    retry: "Regenerate",
    thinking: "HARON is thinking",
    emptyTitle: "What shall we build, fix, or understand?",
    emptyText: "Use a prompt starter or type directly. This workspace keeps your conversation structured and ready to continue.",
    hint: "Enter to send. Shift+Enter for a new line.",
    error: "The AI route returned an error.",
    foldersList: ["Engineering", "Study", "Writing"],
    actions: ["Debug an error", "Summarize notes", "Write a launch plan", "Explain code"],
    placeholders: ["Ask HARON OS anything...", "Paste code, notes, or a rough idea...", "Plan, debug, summarize, or write..."],
  },
  ar: {
    assistant: "مساعد هارون أو إس",
    status: "نواة Gemini متصلة",
    workspace: "مساحة المساعد",
    newChat: "محادثة جديدة",
    search: "ابحث في المحادثات...",
    pinned: "مثبّتة",
    recent: "المحادثات الأخيرة",
    folders: "المجلدات",
    noChats: "ما فيه محادثات محفوظة بعد",
    tools: "أدوات السياق",
    memory: "الذاكرة",
    quick: "إجراءات سريعة",
    upload: "إرفاق ملف",
    voice: "إدخال صوتي",
    send: "إرسال",
    copy: "نسخ",
    copied: "تم النسخ",
    retry: "إعادة التوليد",
    thinking: "هارون يفكر",
    emptyTitle: "وش نبي نبني أو نصلح أو نفهم؟",
    emptyText: "استخدم اقتراح سريع أو اكتب مباشرة. المساحة تحفظ سياقك وتخليه جاهز للمتابعة.",
    hint: "Enter للإرسال. Shift+Enter لسطر جديد.",
    error: "صار خطأ في مسار الذكاء الاصطناعي.",
    foldersList: ["الهندسة", "الدراسة", "الكتابة"],
    actions: ["حلّل خطأ", "لخّص ملاحظات", "اكتب خطة إطلاق", "اشرح كود"],
    placeholders: ["اسأل هارون أو إس أي شيء...", "الصق كود أو ملاحظات أو فكرة...", "خطّط، صحّح، لخّص، أو اكتب..."],
  },
} as const;

function detectArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

export function AIChatAssistant() {
  const { lang, dir, setLanguage } = useLanguage();
  const { profile, user } = useAuth();
  const copy = ui[lang];
  const placeholder = useRotatingText([...copy.placeholders], 2200);
  const {
    conversations,
    currentConversation,
    loadConversations,
    startNewConversation,
    switchConversation,
    addMessage,
    archiveCurrentConversation,
  } = useConversations();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [rightOpen, setRightOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "0px";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 180)}px`;
  }, [input]);

  useEffect(() => {
    if (!currentConversation || loading) return;
    setMessages(currentConversation.messages.map((message) => ({ role: message.role, content: message.content })));
  }, [currentConversation, loading]);

  const filteredConversations = useMemo(
    () => conversations.filter((conversation) => conversation.title.toLowerCase().includes(query.toLowerCase())),
    [conversations, query],
  );

  const payload = useMemo(
    () => messages.filter((message) => message.content.trim()).map((message) => ({ role: message.role, content: message.content })),
    [messages],
  );

  function resetChat() {
    setMessages([]);
    setInput("");
    setAttachmentName("");
    inputRef.current?.focus();
  }

  function retryLast() {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUser || loading) return;
    setMessages((current) => current.filter((message, index) => !(index === current.length - 1 && message.role === "assistant")));
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

    const userMessage: Message = {
      role: "user",
      content: attachmentName ? `${normalized}\n\n[${lang === "ar" ? "ملف مرفق" : "Attached file"}: ${attachmentName}]` : normalized,
    };
    let conversationId = currentConversation?.id;
    setMessages((current) => [...current, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setAttachmentName("");
    setLoading(true);

    try {
      if (!conversationId && messages.length === 0) {
        conversationId = await startNewConversation(userMessage.content);
      } else if (conversationId) {
        await addMessage("user", userMessage.content, conversationId);
      }

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
        if (text && conversationId) await addMessage("assistant", text, conversationId);
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
      if (assistantText && conversationId) await addMessage("assistant", assistantText, conversationId);
    } catch (error) {
      setAssistantText(error instanceof Error ? `${copy.error}\n\n${error.message}` : copy.error);
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

  return (
    <section
      id="ai-assistant"
      dir={dir}
      className={cn("relative z-10 mx-auto max-w-[96rem] px-3 py-10 sm:px-5 lg:px-8", dir === "rtl" && "font-arabic text-right")}
    >
      <div className="grid min-h-[48rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_0_100px_rgba(34,211,238,0.12)] backdrop-blur-2xl lg:grid-cols-[18rem_minmax(0,1fr)_20rem]">
        <aside className="hidden border-white/10 bg-black/22 p-4 lg:block ltr:border-r rtl:border-l">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100/60">{copy.workspace}</p>
              <h2 className="mt-1 text-xl font-black text-white">{copy.assistant}</h2>
            </div>
            <button onClick={resetChat} className="grid size-10 place-items-center rounded-2xl bg-cyan-300 text-slate-950 transition hover:bg-white" aria-label={copy.newChat}>
              <Plus className="size-5" />
            </button>
          </div>
          <label className="mb-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-3">
            <Search className="size-4 text-white/38" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.search}
              className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/32"
            />
          </label>
          <SidebarGroup title={copy.pinned} icon={<Pin className="size-4" />}>
            <SidebarItem title={lang === "ar" ? "خطة إطلاق هارون" : "HARON launch plan"} active={false} />
          </SidebarGroup>
          <SidebarGroup title={copy.recent} icon={<Archive className="size-4" />}>
            {filteredConversations.length ? (
              filteredConversations.slice(0, 8).map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => switchConversation(conversation.id)}
                  className={cn(
                    "block w-full truncate rounded-2xl px-3 py-2.5 text-start text-sm font-semibold transition",
                    currentConversation?.id === conversation.id ? "bg-cyan-300/12 text-cyan-100" : "text-white/54 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  {conversation.title}
                </button>
              ))
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/40">{copy.noChats}</p>
            )}
          </SidebarGroup>
          <SidebarGroup title={copy.folders} icon={<Folder className="size-4" />}>
            {copy.foldersList.map((folder) => (
              <SidebarItem key={folder} title={folder} active={false} />
            ))}
          </SidebarGroup>
        </aside>

        <div className="flex min-h-[48rem] flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="relative grid size-11 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
                <span className="absolute inset-0 animate-pulse rounded-2xl bg-cyan-300/10" />
                <Bot className="relative size-5" />
              </div>
              <div>
                <p className="font-black text-white">{copy.assistant}</p>
                <p className="text-xs text-white/42">{copy.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={retryLast} disabled={loading || !messages.some((message) => message.role === "user")} className="grid size-10 place-items-center rounded-2xl border border-white/10 text-white/55 transition hover:text-cyan-100 disabled:opacity-35" aria-label={copy.retry}>
                <RefreshCw className="size-4" />
              </button>
              <button onClick={() => setRightOpen((current) => !current)} className="grid size-10 place-items-center rounded-2xl border border-white/10 text-white/55 transition hover:text-cyan-100 lg:hidden" aria-label={copy.tools}>
                <PanelRight className="size-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            {!messages.length && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid min-h-[30rem] place-items-center text-center">
                <div className="max-w-2xl">
                  <div className="mx-auto mb-6 grid size-20 place-items-center rounded-[1.75rem] border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_60px_rgba(34,211,238,0.18)]">
                    <Sparkles className="size-9" />
                  </div>
                  <h3 className="text-3xl font-black text-white sm:text-5xl">{copy.emptyTitle}</h3>
                  <p className="mx-auto mt-4 max-w-xl leading-8 text-white/56">{copy.emptyText}</p>
                  <div className="mt-7 flex flex-wrap justify-center gap-2">
                    {copy.actions.map((action) => (
                      <button key={action} onClick={() => sendMessage(action)} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-white/62 transition hover:border-cyan-200/40 hover:text-cyan-100">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <MessageBubble
                    key={`${message.role}-${index}`}
                    message={message}
                    index={index}
                    userName={profile?.name || user?.displayName || "You"}
                    copied={copiedIndex === index}
                    copyLabel={copiedIndex === index ? copy.copied : copy.copy}
                    onCopy={() => copyMessage(message.content, index)}
                  />
                ))}
              </AnimatePresence>
            </div>
            <div ref={bottomRef} />
          </div>

          <footer className="border-t border-white/10 bg-black/18 p-3 sm:p-4">
            {attachmentName && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                <FileUp className="size-3" />
                {attachmentName}
              </div>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="relative rounded-[1.5rem] border border-cyan-200/20 bg-black/45 p-2 shadow-[0_0_42px_rgba(34,211,238,0.11)] transition focus-within:border-cyan-200/55"
            >
              <div className="flex items-end gap-2">
                <label className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-2xl border border-white/10 text-white/50 transition hover:text-cyan-100" title={copy.upload}>
                  <FileUp className="size-5" />
                  <input type="file" className="hidden" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || "")} />
                </label>
                <textarea
                  ref={inputRef}
                  value={input}
                  rows={1}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="max-h-44 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 leading-7 text-white outline-none placeholder:text-white/34"
                />
                <button type="button" className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 text-white/50 transition hover:text-cyan-100" title={copy.voice}>
                  <Mic className="size-5" />
                </button>
                <button type="submit" disabled={loading || !input.trim()} className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.24)] transition hover:bg-white disabled:opacity-45" title={copy.send}>
                  {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                </button>
              </div>
            </form>
            <p className="mt-2 px-2 text-xs text-white/35">{copy.hint}</p>
          </footer>
        </div>

        <aside className={cn("border-white/10 bg-black/20 p-4 lg:block ltr:border-l rtl:border-r", rightOpen ? "block" : "hidden")}>
          <PanelCard title={copy.tools} icon={<WandSparkles className="size-4" />}>
            {copy.actions.map((action) => (
              <button key={action} onClick={() => sendMessage(action)} className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-start text-sm font-semibold text-white/58 transition hover:border-cyan-200/35 hover:text-cyan-100">
                {action}
              </button>
            ))}
          </PanelCard>
          <PanelCard title={copy.memory} icon={<Sparkles className="size-4" />}>
            <p className="text-sm leading-7 text-white/52">
              {lang === "ar"
                ? "يحفظ هارون المحادثات للحسابات المسجلة ويستخدم السياق الحالي فقط عند الرد."
                : "HARON saves conversations for signed-in users and uses the current context when responding."}
            </p>
          </PanelCard>
          {currentConversation && (
            <button onClick={archiveCurrentConversation} className="mt-4 w-full rounded-2xl border border-red-200/15 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100/75 transition hover:text-red-100">
              {lang === "ar" ? "أرشفة المحادثة" : "Archive chat"}
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}

function MessageBubble({
  message,
  index,
  userName,
  copied,
  copyLabel,
  onCopy,
}: {
  message: Message;
  index: number;
  userName: string;
  copied: boolean;
  copyLabel: string;
  onCopy: () => void;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className={cn("flex gap-3", isUser && "justify-end")}
    >
      {!isUser && <Avatar icon={<Bot className="size-4" />} />}
      <div className={cn("group max-w-[92%] sm:max-w-[78%]", isUser && "order-first")}>
        <div className={cn("mb-2 flex items-center gap-2 text-xs text-white/34", isUser && "justify-end")}>
          <span>{isUser ? userName : "HARON OS"}</span>
          <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className={cn("rounded-[1.35rem] border p-4 leading-7", isUser ? "border-cyan-200/20 bg-cyan-300/12 text-white" : "border-white/10 bg-black/30 text-white/75")}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : message.content ? (
            <MarkdownMessage content={message.content} />
          ) : (
            <TypingIndicator />
          )}
        </div>
        {message.content && (
          <button onClick={onCopy} className={cn("mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 px-2.5 py-1 text-xs font-bold text-white/38 opacity-0 transition hover:text-white group-hover:opacity-100", isUser && "float-right")}>
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copyLabel}
          </button>
        )}
      </div>
      {isUser && <Avatar icon={<UserRound className="size-4" />} />}
    </motion.div>
  );
}

function Avatar({ icon }: { icon: React.ReactNode }) {
  return <div className="mt-7 hidden size-9 shrink-0 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100 sm:grid">{icon}</div>;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 text-cyan-100/75">
      <Loader2 className="size-4 animate-spin" />
      <span className="flex gap-1">
        {[0, 1, 2].map((item) => (
          <span key={item} className="size-1.5 animate-bounce rounded-full bg-cyan-200/70" style={{ animationDelay: `${item * 110}ms` }} />
        ))}
      </span>
    </div>
  );
}

function SidebarGroup({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2 px-1 text-xs font-black uppercase tracking-[0.2em] text-white/35">
        {icon}
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({ title, active }: { title: string; active: boolean }) {
  return <div className={cn("truncate rounded-2xl px-3 py-2.5 text-sm font-semibold", active ? "bg-cyan-300/12 text-cyan-100" : "text-white/48")}>{title}</div>;
}

function PanelCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-4 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center gap-2 text-cyan-100">
        {icon}
        <h3 className="font-black text-white">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
