"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/src/lib/cn";

type WifiPasswordCardProps = {
  password: string;
  passwordLabel: string;
  helperLine: string;
  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
};

type CopyStatus = "idle" | "copied" | "failed";

export function WifiPasswordCard({
  password,
  passwordLabel,
  helperLine,
  copyLabel,
  copiedLabel,
  copyFailedLabel
}: WifiPasswordCardProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const displayPassword = useMemo(() => `#${password.replace(/^#+/, "").trim()}`, [password]);

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timer = window.setTimeout(() => setCopyStatus("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  async function onCopyClick() {
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        throw new Error("Clipboard API is not available");
      }

      await navigator.clipboard.writeText(displayPassword);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  const helperText =
    copyStatus === "copied" ? copiedLabel : copyStatus === "failed" ? copyFailedLabel : helperLine;

  return (
    <section className="rounded-2xl border border-amber/30 bg-black/30 p-4 shadow-card sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-fog">{passwordLabel}</p>
      <p className="mt-3 break-all rounded-xl border border-white/10 bg-midnight/70 px-4 py-4 font-display text-[clamp(1.8rem,9.5vw,3.2rem)] tracking-[0.14em] text-amber">
        {displayPassword}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCopyClick}
          className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-amber/60 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
        >
          {copyStatus === "copied" ? copiedLabel : copyLabel}
        </button>
        <p
          aria-live="polite"
          className={cn(
            "text-xs leading-relaxed text-fog",
            copyStatus === "failed" ? "text-amber" : copyStatus === "copied" ? "text-cream" : ""
          )}
        >
          {helperText}
        </p>
      </div>
    </section>
  );
}
