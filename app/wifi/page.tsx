import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/src/components/ui/Container";
import { type Locale } from "@/src/content/site";
import { WifiPasswordCard } from "@/src/components/wifi/WifiPasswordCard";
import { getWifiCopy } from "@/src/content/wifi";
import { readWifiConfig } from "@/src/lib/wifi-store";

type WifiPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function resolveLocale(lang?: string): Locale {
  return lang === "en" ? "en" : "tr";
}

export const metadata: Metadata = {
  title: "Wi-Fi Password | Peanuts",
  description: "See the latest guest Wi-Fi password for Peanuts.",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function WifiPage({ searchParams }: WifiPageProps) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const copy = getWifiCopy(locale);
  const { ssid, password } = await readWifiConfig();

  return (
    <main className="relative min-h-screen py-6 sm:py-10">
      <Container className="max-w-3xl">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-midnight-soft/70 p-5 shadow-card sm:p-8">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-amber/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-ember/20 blur-3xl" />

          <div className="relative space-y-6">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`/${locale}#menu`}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-fog transition hover:border-white/30 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                >
                  Peanuts
                </a>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-fog">{copy.languageLabel}</span>
                  <Link
                    href="/wifi"
                    aria-current={locale === "tr" ? "page" : undefined}
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight ${
                      locale === "tr"
                        ? "border-amber/70 bg-amber/15 text-cream"
                        : "border-white/15 text-fog hover:border-white/35 hover:text-cream"
                    }`}
                  >
                    TR
                  </Link>
                  <Link
                    href="/wifi?lang=en"
                    aria-current={locale === "en" ? "page" : undefined}
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight ${
                      locale === "en"
                        ? "border-amber/70 bg-amber/15 text-cream"
                        : "border-white/15 text-fog hover:border-white/35 hover:text-cream"
                    }`}
                  >
                    EN
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-3xl tracking-tight text-cream sm:text-4xl">{copy.title}</h1>
                <p className="text-sm leading-relaxed text-fog sm:text-base">{copy.subtitle}</p>
              </div>
            </header>

            <div className="grid gap-4 rounded-2xl border border-white/10 bg-midnight/50 p-4 sm:grid-cols-2 sm:p-5">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-fog">{copy.ssidLabel}</p>
                <p className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-semibold text-cream sm:text-base">
                  {ssid}
                </p>
              </div>
            </div>

            <WifiPasswordCard
              password={password}
              passwordLabel={copy.passwordLabel}
              helperLine={copy.helperLine}
              copyLabel={copy.copyLabel}
              copiedLabel={copy.copiedLabel}
              copyFailedLabel={copy.copyFailedLabel}
            />

            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-fog sm:text-sm">
              {copy.securityNote}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`/${locale}`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-amber/60 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
              >
                {copy.backLabel}
              </a>
              <a
                href={`/${locale}#menu`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-amber/50 bg-amber/10 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-cream transition hover:border-amber hover:bg-amber/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
              >
                {copy.menuLabel}
              </a>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
