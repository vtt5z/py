"use client";

import { motion } from "framer-motion";
import { FileUp, Loader2, WandSparkles } from "lucide-react";
import { useState } from "react";

import { MarkdownMessage } from "@/components/os/markdown-message";
import { OSCard } from "@/components/os/os-card";
import { aiTools } from "@/lib/haron-os-content";

export function AIToolsSection() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState("");
  const [writingInput, setWritingInput] = useState("");
  const [resumeInput, setResumeInput] = useState("");

  async function submitFile(endpoint: string, file: File | null, prompt?: string) {
    if (!file) return;
    setLoading(endpoint);
    setResult("");
    const formData = new FormData();
    formData.append("file", file);
    if (prompt) formData.append("prompt", prompt);

    const response = await fetch(endpoint, { method: "POST", body: formData });
    const data = (await response.json()) as { result?: string; error?: string };
    setResult(data.result ?? data.error ?? "No response generated.");
    setLoading("");
  }

  async function submitJson(endpoint: string, body: Record<string, string>) {
    setLoading(endpoint);
    setResult("");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as { result?: string; error?: string };
    setResult(data.result ?? data.error ?? "No response generated.");
    setLoading("");
  }

  return (
    <section id="ai-tools" className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          AI Utility Layer
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          Upload, analyze, write, summarize, and generate from one polished surface.
        </h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-5">
        {aiTools.map((tool) => (
          <OSCard key={tool.id} title={tool.title} text={tool.text} icon={tool.icon} />
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <FileUp className="size-5 text-cyan-100" />
              <span className="font-bold text-white">Upload PDF for summary</span>
            </div>
            <input
              type="file"
              accept="application/pdf"
              className="mt-4 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:font-bold file:text-slate-950"
              onChange={(event) => submitFile("/api/ai/pdf", event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <FileUp className="size-5 text-violet-100" />
              <span className="font-bold text-white">Upload screenshot for AI analysis</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="mt-4 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-violet-300 file:px-4 file:py-2 file:font-bold file:text-slate-950"
              onChange={(event) =>
                submitFile(
                  "/api/ai/screenshot",
                  event.target.files?.[0] ?? null,
                  "Analyze errors, UI problems, debugging suggestions, accessibility, and concrete improvements.",
                )
              }
            />
          </label>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <p className="font-bold text-white">Smart Writing Assistant</p>
            <textarea
              value={writingInput}
              onChange={(event) => setWritingInput(event.target.value)}
              placeholder="Paste email, caption, message, or translation request..."
              className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none placeholder:text-white/34"
            />
            <button
              type="button"
              onClick={() => submitJson("/api/ai/writing", { input: writingInput, mode: "premium professional rewrite" })}
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 text-sm font-black text-slate-950"
            >
              <WandSparkles className="size-4" />
              Rewrite
            </button>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <p className="font-bold text-white">Resume Builder</p>
            <textarea
              value={resumeInput}
              onChange={(event) => setResumeInput(event.target.value)}
              placeholder="Paste profile, education, skills, projects, target role..."
              className="mt-4 min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none placeholder:text-white/34"
            />
            <button
              type="button"
              onClick={() => submitJson("/api/ai/resume", { profile: resumeInput, targetRole: "Software Engineer / Data Analyst" })}
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-violet-300 px-5 text-sm font-black text-slate-950"
            >
              <WandSparkles className="size-4" />
              Generate CV
            </button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="min-h-[38rem] rounded-[2rem] border border-white/10 bg-black/35 p-5 backdrop-blur-2xl"
        >
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-100/60">
              AI Output Console
            </p>
            {loading && <Loader2 className="size-5 animate-spin text-cyan-100" />}
          </div>
          {result ? (
            <MarkdownMessage content={result} />
          ) : (
            <div className="grid h-[30rem] place-items-center text-center text-white/38">
              <div>
                <WandSparkles className="mx-auto mb-4 size-10 text-cyan-100/60" />
                <p className="font-semibold">Run an AI tool to generate a polished response here.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
