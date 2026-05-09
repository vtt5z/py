"use client";

import { motion } from "framer-motion";
import { Copy, Loader2, Play } from "lucide-react";
import { useMemo, useState } from "react";

import { OSCard } from "@/components/os/os-card";
import { developerTools } from "@/lib/haron-os-content";

type ToolMode = "json" | "regex" | "sql" | "api" | "code" | "debug";

export function DeveloperToolsSection() {
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
    <section id="developer-tools" className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          Developer Command Suite
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          Futuristic utilities for code, APIs, data, SQL, and debugging.
        </h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-6">
        {developerTools.map((tool) => (
          <button key={tool.id} type="button" onClick={() => setMode(tool.id as ToolMode)} className="text-left">
            <OSCard
              title={tool.title}
              text={tool.action}
              icon={tool.icon}
              className={mode === tool.id ? "border-cyan-200/60 bg-cyan-300/10" : ""}
            />
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl">
          <div className="mb-4 flex items-center gap-3">
            <activeTool.icon className="size-6 text-cyan-100" />
            <div>
              <p className="font-bold text-white">{activeTool.title}</p>
              <p className="text-sm text-white/42">{activeTool.action}</p>
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
            placeholder={
              mode === "api"
                ? "https://api.example.com/data"
                : "Paste JSON, code, SQL request, stack trace, or text..."
            }
          />
          <button
            type="button"
            onClick={runTool}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-white"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
            Run Tool
          </button>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 backdrop-blur-2xl">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-100/60">
              Terminal Output
            </p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(output)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/45 transition hover:text-white"
            >
              <Copy className="size-3" />
              Copy
            </button>
          </div>
          <pre className="min-h-[27rem] whitespace-pre-wrap rounded-2xl bg-black/30 p-4 font-mono text-sm leading-7 text-cyan-50/80">
            {output || "Awaiting command..."}
          </pre>
        </div>
      </div>
    </section>
  );
}
