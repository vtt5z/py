"use client";

import { type LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  hint,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  hint?: string;
}) {
  return (
    <div className="grid min-h-64 place-items-center rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 text-center backdrop-blur-2xl">
      <div className="max-w-md">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-[1.35rem] border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
          <Icon className="size-7" />
        </div>
        <h2 className="text-2xl font-black text-white">{title}</h2>
        <p className="mt-3 leading-7 text-white/56">{description}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex h-11 items-center rounded-2xl bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-white"
          >
            {actionLabel}
          </button>
        )}
        {hint && <p className="mt-4 text-sm text-white/38">{hint}</p>}
      </div>
    </div>
  );
}
