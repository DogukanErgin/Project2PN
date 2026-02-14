"use client";

import { FormEvent, useMemo, useState } from "react";
import { cn } from "@/src/lib/cn";

type WifiApiResponse = {
  ssid: string;
  password: string;
  updatedAt: string | null;
};

type Status = {
  tone: "idle" | "success" | "error";
  text: string;
};

const initialStatus: Status = {
  tone: "idle",
  text: "Yönetici parolasini girip mevcut bilgiyi güncelleyin."
};

function formatUpdatedAt(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function WifiAdminPanel() {
  const [adminPassword, setAdminPassword] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<Status>(initialStatus);

  const formattedUpdatedAt = useMemo(() => formatUpdatedAt(updatedAt), [updatedAt]);

  async function loadCurrentConfig() {
    if (!adminPassword.trim()) {
      setStatus({ tone: "error", text: "Yönetici parolası gerekli." });
      return;
    }

    setIsLoading(true);
    setStatus({ tone: "idle", text: "Mevcut Wi-Fi bilgisi yükleniyor..." });

    try {
      const response = await fetch("/api/wifi-admin", {
        method: "GET",
        headers: {
          "x-admin-password": adminPassword
        },
        cache: "no-store"
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Yükleme başarısız.");
      }

      const payload = (await response.json()) as WifiApiResponse;
      setSsid(payload.ssid);
      setWifiPassword(payload.password);
      setUpdatedAt(payload.updatedAt);
      setStatus({ tone: "success", text: "Mevcut bilgiler yüklendi." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Yükleme başarısız.";
      setStatus({ tone: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminPassword.trim()) {
      setStatus({ tone: "error", text: "Yönetici parolası gerekli." });
      return;
    }

    if (!wifiPassword.trim()) {
      setStatus({ tone: "error", text: "Wi-Fi şifresi boş olamaz." });
      return;
    }

    setIsSaving(true);
    setStatus({ tone: "idle", text: "Wi-Fi bilgisi kaydediliyor..." });

    try {
      const response = await fetch("/api/wifi-admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminPassword,
          password: wifiPassword
        })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Kaydetme başarısız.");
      }

      const payload = (await response.json()) as WifiApiResponse;
      setSsid(payload.ssid);
      setWifiPassword(payload.password);
      setUpdatedAt(payload.updatedAt);
      setStatus({ tone: "success", text: "Wi-Fi bilgisi güncellendi." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kaydetme başarısız.";
      setStatus({ tone: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-midnight-soft/75 p-5 shadow-card sm:p-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl text-cream sm:text-4xl">Wi-Fi Yönetim Paneli</h1>
        <p className="text-sm leading-relaxed text-fog sm:text-base">
          Bu panel sadece Wi-Fi şifresini günceller. Ziyaretçiler `/wifi` sayfasında anlık olarak yeni bilgiyi görür.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-fog">Yönetici Parolası</span>
          <input
            type="password"
            autoComplete="current-password"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            className="h-11 w-full rounded-xl border border-white/15 bg-midnight/70 px-4 text-sm text-cream placeholder:text-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            placeholder="Sadece yönetici parolasi"
            required
          />
        </label>

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-fog">SSID (Salt Okunur)</p>
          <p className="rounded-xl border border-white/15 bg-midnight/70 px-4 py-3 text-sm text-cream">
            {ssid || "PEANUTS"}
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-fog">Wi-Fi Şifresi</span>
          <input
            type="text"
            value={wifiPassword}
            onChange={(event) => setWifiPassword(event.target.value)}
            maxLength={128}
            className="h-11 w-full rounded-xl border border-white/15 bg-midnight/70 px-4 text-sm text-cream placeholder:text-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            placeholder="Orn: PEANUTS2026 (ekranda # ile gosterilir)"
            required
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadCurrentConfig}
            disabled={isLoading || isSaving}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-amber/60 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-60"
          >
            {isLoading ? "Yukleniyor..." : "Mevcut Bilgiyi Yukle"}
          </button>

          <button
            type="submit"
            disabled={isLoading || isSaving}
            className="inline-flex h-10 items-center justify-center rounded-full border border-amber/60 bg-amber/15 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-amber hover:bg-amber/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:opacity-60"
          >
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-midnight/55 px-4 py-3 text-xs sm:text-sm">
          <p
            className={cn(
              "leading-relaxed text-fog",
              status.tone === "success" ? "text-cream" : "",
              status.tone === "error" ? "text-amber" : ""
            )}
          >
            {status.text}
          </p>
          <p className="mt-2 text-fog/80">Son guncelleme: {formattedUpdatedAt}</p>
        </div>
      </form>
    </section>
  );
}
