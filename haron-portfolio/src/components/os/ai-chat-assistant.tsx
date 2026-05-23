"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Check,
  Copy,
  Download,
  FileUp,
  Loader2,
  Mic,
  PanelLeft,
  PanelRight,
  Pencil,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trash2,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { MarkdownMessage } from "@/components/os/markdown-message";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { useToast } from "@/components/providers/toast-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { useChats } from "@/hooks/use-chats";
import { useRotatingText } from "@/hooks/use-rotating-text";
import { cn } from "@/lib/utils";

type UiMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
};

const ui = {
  en: {
    assistant: "HARON OS Assistant",
    status: "Gemini core online",
    workspace: "Assistant Workspace",
    tools: "Context tools",
    memory: "Memory",
    upload: "Attach file",
    voice: "Voice input",
    send: "Send",
    copy: "Copy",
    copied: "Copied",
    retry: "Regenerate",
    emptyTitle: "What shall we build, fix, or understand?",
    emptyText: "Use a prompt starter or type directly. Your chats are saved to your account in real time.",
    hint: "Enter to send. Shift+Enter for a new line.",
    error: "The AI route returned an error.",
    actions: ["Debug an error", "Summarize notes", "Write a launch plan", "Explain code"],
    placeholders: ["Ask HARON OS anything...", "Paste code, notes, or a rough idea...", "Plan, debug, summarize, or write..."],
    deleteActive: "Delete chat",
    exportPdf: "Export PDF",
  },
  ar: {
    assistant: "مساعد هارون أو إس",
    status: "نواة Gemini متصلة",
    workspace: "مساحة المساعد",
    tools: "أدوات السياق",
    memory: "الذاكرة",
    upload: "إرفاق ملف",
    voice: "إدخال صوتي",
    send: "إرسال",
    copy: "نسخ",
    copied: "تم النسخ",
    retry: "إعادة التوليد",
    emptyTitle: "وش نبي نبني أو نصلح أو نفهم؟",
    emptyText: "استخدم اقتراحًا سريعًا أو اكتب مباشرة. محادثاتك تُحفظ لحسابك لحظيًا.",
    hint: "Enter للإرسال. Shift+Enter لسطر جديد.",
    error: "صار خطأ في مسار الذكاء الاصطناعي.",
    actions: ["حلّل خطأ", "لخّص ملاحظات", "اكتب خطة إطلاق", "اشرح كود"],
    placeholders: ["اسأل هارون أو إس أي شيء...", "الصق كودًا أو ملاحظات أو فكرة...", "خطّط، صحّح، لخّص، أو اكتب..."],
    deleteActive: "حذف المحادثة",
    exportPdf: "تصدير PDF",
  },
} as const;

function detectArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

export function AIChatAssistant() {
  const { lang, dir, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const copy = ui[lang];
  const placeholder = useRotatingText([...copy.placeholders], 2200);
  const {
    pinnedChats,
    recentChats,
    activeChat,
    activeChatId,
    setActiveChatId,
    loading: chatsLoading,
    error: chatsError,
    createChat,
    sendMessage: saveMessage,
    renameChat,
    togglePin,
    removeChat,
  } = useChats();
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [rightOpen, setRightOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
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

  useEffect(() => {
    if (loading) return;
    setMessages(activeChat?.messages ?? []);
  }, [activeChat, loading]);

  const visiblePinnedChats = useMemo(
    () => pinnedChats.filter((chat) => chat.title.toLowerCase().includes(query.toLowerCase())),
    [pinnedChats, query],
  );
  const visibleRecentChats = useMemo(
    () => recentChats.filter((chat) => chat.title.toLowerCase().includes(query.toLowerCase())),
    [recentChats, query],
  );
  const payload = useMemo(
    () => messages.filter((message) => message.content.trim()).map((message) => ({ role: message.role, content: message.content })),
    [messages],
  );

  async function handleNewChat() {
    try {
      await createChat(t("chat.new"));
      setInput("");
      setMessages([]);
      toast(t("chat.saved"));
    } catch (error) {
      toast(error instanceof Error ? error.message : t("common.error"), "error");
    }
  }

  async function handleRename(chatId: string) {
    if (!renameValue.trim()) return;
    try {
      await renameChat(chatId, renameValue);
      setRenamingId(null);
      toast(t("chat.renamed"));
    } catch (error) {
      toast(error instanceof Error ? error.message : t("common.error"), "error");
    }
  }

  async function handlePin(chatId: string, pinned: boolean) {
    try {
      await togglePin(chatId, !pinned);
      toast(t("chat.pinUpdated"));
    } catch (error) {
      toast(error instanceof Error ? error.message : t("common.error"), "error");
    }
  }

  async function handleDelete(chatId: string) {
    if (!window.confirm(t("chat.deleteConfirm"))) return;
    try {
      await removeChat(chatId);
      toast(t("chat.deleted"));
    } catch (error) {
      toast(error instanceof Error ? error.message : t("common.error"), "error");
    }
  }

  function retryLast() {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUser || loading) return;
    setMessages((current) => current.filter((message, index) => !(index === current.length - 1 && message.role === "assistant")));
    sendToAssistant(lastUser.content);
  }

  async function copyMessage(content: string, index: number) {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1200);
  }

  function exportActiveChat() {
    if (!activeChat || !messages.length) return;
    const transcript = messages
      .map((message) => {
        const speaker = message.role === "user" ? (profile?.name || user?.displayName || "You") : "HARON OS";
        return `<section><h2>${escapeHtml(speaker)}</h2><time>${escapeHtml((message.createdAt ?? new Date()).toLocaleString())}</time><pre>${escapeHtml(message.content)}</pre></section>`;
      })
      .join("");
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      toast(lang === "ar" ? "تعذر فتح نافذة التصدير." : "Could not open export window.", "error");
      return;
    }
    popup.document.write(`<!doctype html><html dir="${dir}" lang="${lang}"><head><title>${escapeHtml(activeChat.title)}</title><style>body{font-family:Inter,Arial,sans-serif;background:#fff;color:#111;padding:40px;line-height:1.7}h1{font-size:28px;margin:0 0 24px}section{break-inside:avoid;border-top:1px solid #ddd;padding:18px 0}h2{font-size:14px;margin:0 0 4px;color:#075985}time{display:block;font-size:11px;color:#667085;margin-bottom:10px}pre{white-space:pre-wrap;font:inherit;margin:0}</style></head><body><h1>${escapeHtml(activeChat.title)}</h1>${transcript}<script>window.onload=()=>window.print()</script></body></html>`);
    popup.document.close();
  }

  async function sendToAssistant(value = input) {
    if (!value.trim() || loading) return;

    const normalized = value.trim();
    const nextLanguage = detectArabic(normalized) ? "ar" : lang;
    if (nextLanguage !== lang) setLanguage(nextLanguage);

    const userMessage: UiMessage = {
      role: "user",
      content: attachmentName ? `${normalized}\n\n[${lang === "ar" ? "ملف مرفق" : "Attached file"}: ${attachmentName}]` : normalized,
      createdAt: new Date(),
    };
    let chatId = activeChatId;
    setMessages((current) => [...current, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setAttachmentName("");
    setLoading(true);

    try {
      if (!chatId) {
        chatId = await createChat(normalized.slice(0, 60));
      }
      await saveMessage(chatId, "user", userMessage.content);

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
        if (text) await saveMessage(chatId, "assistant", text);
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
      if (assistantText) await saveMessage(chatId, "assistant", assistantText);
    } catch (error) {
      setAssistantText(error instanceof Error ? `${copy.error}\n\n${error.message}` : copy.error);
      toast(error instanceof Error ? error.message : copy.error, "error");
    } finally {
      setLoading(false);
    }
  }

  function setAssistantText(content: string) {
    setMessages((current) => {
      const clone = [...current];
      clone[clone.length - 1] = { role: "assistant", content, createdAt: new Date() };
      return clone;
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendToAssistant();
    }
  }

  return (
    <section
      id="ai-assistant"
      dir={dir}
      className={cn("relative z-10 mx-auto max-w-[96rem] px-3 py-10 sm:px-5 lg:px-8", dir === "rtl" && "font-arabic text-right")}
    >
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setHistoryOpen(false)}
          >
            <motion.aside
              initial={{ x: dir === "rtl" ? 340 : -340 }}
              animate={{ x: 0 }}
              exit={{ x: dir === "rtl" ? 340 : -340 }}
              transition={{ type: "spring", stiffness: 270, damping: 30 }}
              className={cn(
                "h-full w-[86vw] max-w-sm overflow-y-auto border-white/10 bg-[#050816] p-4 shadow-[0_0_80px_rgba(34,211,238,0.16)]",
                dir === "rtl" ? "mr-auto border-l" : "border-r",
              )}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100/60">{copy.workspace}</p>
                  <h2 className="mt-1 text-xl font-black text-white">{t("chat.title")}</h2>
                </div>
                <button onClick={() => setHistoryOpen(false)} className="grid size-10 place-items-center rounded-2xl border border-white/10 text-white/65">
                  <PanelLeft className="size-5" />
                </button>
              </div>
              <button
                onClick={() => {
                  handleNewChat();
                  setHistoryOpen(false);
                }}
                className="mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 text-sm font-black text-slate-950"
              >
                <Plus className="size-4" />
                {t("chat.new")}
              </button>
              <label className="mb-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-3">
                <Search className="size-4 text-white/38" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("chat.search")}
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/32"
                />
              </label>
              {chatsLoading ? (
                <SidebarSkeleton />
              ) : (
                <>
                  <SidebarGroup title={t("chat.pinned")} icon={<Pin className="size-4" />}>
                    {visiblePinnedChats.map((chat) => (
                      <ChatRow
                        key={chat.id}
                        chat={chat}
                        active={activeChatId === chat.id}
                        renaming={renamingId === chat.id}
                        renameValue={renameValue}
                        setRenameValue={setRenameValue}
                        onSelect={() => {
                          setActiveChatId(chat.id);
                          setHistoryOpen(false);
                        }}
                        onStartRename={() => {
                          setRenamingId(chat.id);
                          setRenameValue(chat.title);
                        }}
                        onSubmitRename={() => handleRename(chat.id)}
                        onPin={() => handlePin(chat.id, chat.pinned)}
                        onDelete={() => handleDelete(chat.id)}
                        t={t}
                      />
                    ))}
                  </SidebarGroup>
                  <SidebarGroup title={t("chat.recent")} icon={<Sparkles className="size-4" />}>
                    {visibleRecentChats.length ? (
                      visibleRecentChats.map((chat) => (
                        <ChatRow
                          key={chat.id}
                          chat={chat}
                          active={activeChatId === chat.id}
                          renaming={renamingId === chat.id}
                          renameValue={renameValue}
                          setRenameValue={setRenameValue}
                          onSelect={() => {
                            setActiveChatId(chat.id);
                            setHistoryOpen(false);
                          }}
                          onStartRename={() => {
                            setRenamingId(chat.id);
                            setRenameValue(chat.title);
                          }}
                          onSubmitRename={() => handleRename(chat.id)}
                          onPin={() => handlePin(chat.id, chat.pinned)}
                          onDelete={() => handleDelete(chat.id)}
                          t={t}
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon={Bot}
                        title={t("empty.chatsTitle")}
                        description={t("empty.chatsDescription")}
                        actionLabel={t("chat.new")}
                        onAction={handleNewChat}
                        hint={t("empty.secondaryHint")}
                      />
                    )}
                  </SidebarGroup>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid min-h-[48rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-[0_0_100px_rgba(34,211,238,0.12)] backdrop-blur-2xl lg:grid-cols-[20rem_minmax(0,1fr)_20rem]">
        <aside className="hidden border-white/10 bg-black/22 p-4 lg:block ltr:border-r rtl:border-l">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100/60">{copy.workspace}</p>
              <h2 className="mt-1 text-xl font-black text-white">{t("chat.title")}</h2>
            </div>
            <button onClick={handleNewChat} className="grid size-10 place-items-center rounded-2xl bg-cyan-300 text-slate-950 transition hover:bg-white" aria-label={t("chat.new")}>
              <Plus className="size-5" />
            </button>
          </div>
          <label className="mb-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-3">
            <Search className="size-4 text-white/38" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("chat.search")}
              className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/32"
            />
          </label>
          {chatsLoading ? (
            <SidebarSkeleton />
          ) : chatsError ? (
            <p className="rounded-2xl border border-red-200/15 bg-red-400/10 p-3 text-sm text-red-100">{chatsError}</p>
          ) : (
            <>
              <SidebarGroup title={t("chat.pinned")} icon={<Pin className="size-4" />}>
                {visiblePinnedChats.map((chat) => (
                  <ChatRow
                    key={chat.id}
                    chat={chat}
                    active={activeChatId === chat.id}
                    renaming={renamingId === chat.id}
                    renameValue={renameValue}
                    setRenameValue={setRenameValue}
                    onSelect={() => setActiveChatId(chat.id)}
                    onStartRename={() => {
                      setRenamingId(chat.id);
                      setRenameValue(chat.title);
                    }}
                    onSubmitRename={() => handleRename(chat.id)}
                    onPin={() => handlePin(chat.id, chat.pinned)}
                    onDelete={() => handleDelete(chat.id)}
                    t={t}
                  />
                ))}
              </SidebarGroup>
              <SidebarGroup title={t("chat.recent")} icon={<Sparkles className="size-4" />}>
                {visibleRecentChats.length ? (
                  visibleRecentChats.map((chat) => (
                    <ChatRow
                      key={chat.id}
                      chat={chat}
                      active={activeChatId === chat.id}
                      renaming={renamingId === chat.id}
                      renameValue={renameValue}
                      setRenameValue={setRenameValue}
                      onSelect={() => setActiveChatId(chat.id)}
                      onStartRename={() => {
                        setRenamingId(chat.id);
                        setRenameValue(chat.title);
                      }}
                      onSubmitRename={() => handleRename(chat.id)}
                      onPin={() => handlePin(chat.id, chat.pinned)}
                      onDelete={() => handleDelete(chat.id)}
                      t={t}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={Bot}
                    title={t("empty.chatsTitle")}
                    description={t("empty.chatsDescription")}
                    actionLabel={t("chat.new")}
                    onAction={handleNewChat}
                    hint={t("empty.secondaryHint")}
                  />
                )}
              </SidebarGroup>
            </>
          )}
        </aside>

        <div className="flex min-h-[48rem] flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setHistoryOpen(true)} className="grid size-10 place-items-center rounded-2xl border border-white/10 text-white/55 transition hover:text-cyan-100 lg:hidden" aria-label={t("chat.title")}>
                <PanelLeft className="size-4" />
              </button>
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
                      <button key={action} onClick={() => sendToAssistant(action)} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-bold text-white/62 transition hover:border-cyan-200/40 hover:text-cyan-100">
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
                sendToAssistant();
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
                  placeholder={t("chat.placeholder")}
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
              <button key={action} onClick={() => sendToAssistant(action)} className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-start text-sm font-semibold text-white/58 transition hover:border-cyan-200/35 hover:text-cyan-100">
                {action}
              </button>
            ))}
          </PanelCard>
          <PanelCard title={copy.memory} icon={<Sparkles className="size-4" />}>
            <p className="text-sm leading-7 text-white/52">
              {lang === "ar"
                ? "كل المحادثات محفوظة داخل حسابك فقط، ويتم تحميلها لحظيًا من Firestore."
                : "Every chat is stored only under your account and updates in real time from Firestore."}
            </p>
          </PanelCard>
          {activeChat && (
            <div className="mt-4 space-y-2">
              <button onClick={exportActiveChat} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-200/15 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100/80 transition hover:text-cyan-100">
                <Download className="size-4" />
                {copy.exportPdf}
              </button>
              <button onClick={() => handleDelete(activeChat.id)} className="w-full rounded-2xl border border-red-200/15 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100/75 transition hover:text-red-100">
                {copy.deleteActive}
              </button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function ChatRow({
  chat,
  active,
  renaming,
  renameValue,
  setRenameValue,
  onSelect,
  onStartRename,
  onSubmitRename,
  onPin,
  onDelete,
  t,
}: {
  chat: { id: string; title: string; messages: UiMessage[]; pinned: boolean; updatedAt: Date; lastMessage?: string };
  active: boolean;
  renaming: boolean;
  renameValue: string;
  setRenameValue: (value: string) => void;
  onSelect: () => void;
  onStartRename: () => void;
  onSubmitRename: () => void;
  onPin: () => void;
  onDelete: () => void;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const preview = chat.lastMessage || chat.messages.at(-1)?.content || "";

  return (
    <div className={cn("group rounded-2xl px-2 py-2 transition", active ? "bg-cyan-300/12" : "hover:bg-white/[0.05]")}>
      {renaming ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitRename();
          }}
        >
          <input
            autoFocus
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            onBlur={onSubmitRename}
            className="h-9 w-full rounded-xl border border-cyan-200/30 bg-black/35 px-3 text-sm text-white outline-none"
          />
        </form>
      ) : (
        <button type="button" onClick={onSelect} className="block w-full text-start">
          <p className={cn("truncate text-sm font-bold", active ? "text-cyan-100" : "text-white/72")}>{chat.title}</p>
          <p className="mt-1 truncate text-xs text-white/35">{preview}</p>
        </button>
      )}
      <div className="mt-2 flex items-center justify-between gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
        <span className="text-[11px] text-white/30">{chat.updatedAt.toLocaleDateString()}</span>
        <div className="flex gap-1">
          <ActionButton label={chat.pinned ? t("chat.unpin") : t("chat.pin")} onClick={onPin}>
            {chat.pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
          </ActionButton>
          <ActionButton label={t("chat.rename")} onClick={onStartRename}>
            <Pencil className="size-3.5" />
          </ActionButton>
          <ActionButton label={t("chat.delete")} onClick={onDelete}>
            <Trash2 className="size-3.5" />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" title={label} onClick={onClick} className="grid size-7 place-items-center rounded-lg text-white/42 transition hover:bg-white/10 hover:text-cyan-100">
      {children}
    </button>
  );
}

function MessageBubble({
  message,
  userName,
  copied,
  copyLabel,
  onCopy,
}: {
  message: UiMessage;
  userName: string;
  copied: boolean;
  copyLabel: string;
  onCopy: () => void;
}) {
  const isUser = message.role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 14, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser && <Avatar icon={<Bot className="size-4" />} />}
      <div className={cn("group max-w-[92%] sm:max-w-[78%]", isUser && "order-first")}>
        <div className={cn("mb-2 flex items-center gap-2 text-xs text-white/34", isUser && "justify-end")}>
          <span>{isUser ? userName : "HARON OS"}</span>
          <span>{(message.createdAt ?? new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className={cn("rounded-[1.35rem] border p-4 leading-7", isUser ? "border-cyan-200/20 bg-cyan-300/12 text-white" : "border-white/10 bg-black/30 text-white/75")}>
          {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : message.content ? <MarkdownMessage content={message.content} /> : <TypingIndicator />}
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

function SidebarSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((item) => <div key={item} className="h-14 animate-pulse rounded-2xl bg-white/[0.06]" />)}
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
