"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const MIN_PASSWORD_FONT_SIZE = 10;
const MAX_PASSWORD_FONT_SIZE = 52;

export function WifiPasswordCard({
  password,
  passwordLabel,
  helperLine,
  copyLabel,
  copiedLabel,
  copyFailedLabel
}: WifiPasswordCardProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const passwordTextRef = useRef<HTMLParagraphElement>(null);
  const displayPassword = useMemo(() => `#${password.replace(/^#+/, "").trim()}`, [password]);

  const fitPasswordToSingleLine = useCallback(() => {
    const passwordElement = passwordTextRef.current;
    if (!passwordElement) return;

    let low = MIN_PASSWORD_FONT_SIZE;
    let high = MAX_PASSWORD_FONT_SIZE;
    let best = MIN_PASSWORD_FONT_SIZE;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      passwordElement.style.fontSize = `${mid}px`;

      if (passwordElement.scrollWidth <= passwordElement.clientWidth) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    passwordElement.style.fontSize = `${best}px`;
  }, []);

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timer = window.setTimeout(() => setCopyStatus("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(fitPasswordToSingleLine);
    window.addEventListener("resize", fitPasswordToSingleLine);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", fitPasswordToSingleLine);
    };
  }, [displayPassword, fitPasswordToSingleLine]);

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
      <p
        ref={passwordTextRef}
        className="mt-3 overflow-x-auto whitespace-nowrap rounded-xl border border-white/10 bg-midnight/70 px-4 py-4 font-display leading-none tracking-[0.14em] text-amber"
      >
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
