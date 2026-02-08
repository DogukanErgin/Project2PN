import { type Locale, locales, type SiteContent } from "@/src/content/site";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { cn } from "@/src/lib/cn";

type NavBarProps = {
  content: SiteContent;
  locale: Locale;
};

function buildCallHref(content: SiteContent) {
  if (content.business.phoneTel?.trim()) {
    return `tel:${content.business.phoneTel.replace(/\s+/g, "")}`;
  }

  const fallback = content.business.phone.replace(/[^\d+]/g, "");
  return fallback ? `tel:${fallback}` : "tel:+902582632222";
}

export function NavBar({ content, locale }: NavBarProps) {
  const callHref = buildCallHref(content);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-midnight/72 backdrop-blur-xl">
      <Container className="flex h-16 items-center gap-3">
        <a
          href={`/${locale}#top`}
          className="shrink-0 font-display text-base tracking-[0.08em] text-cream transition hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight sm:text-lg"
        >
          {content.brand}
        </a>

        <nav
          aria-label={content.ui.mainNavAriaLabel}
          className="no-scrollbar mx-2 flex min-w-0 flex-1 items-center gap-3 overflow-x-auto whitespace-nowrap sm:gap-5"
        >
          {content.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.15em] text-fog transition hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight sm:text-xs"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div role="group" aria-label={content.ui.languageSwitcherLabel} className="hidden items-center gap-1 lg:flex">
            {locales.map((targetLocale) => {
              const isActive = targetLocale === locale;
              return (
                <a
                  key={targetLocale}
                  href={`/${targetLocale}`}
                  hrefLang={targetLocale}
                  lang={targetLocale}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={content.ui.languageLong[targetLocale]}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight",
                    isActive
                      ? "border-amber/70 bg-amber/15 text-cream"
                      : "border-white/15 text-fog hover:border-white/35 hover:text-cream"
                  )}
                >
                  {content.ui.languageShort[targetLocale]}
                </a>
              );
            })}
          </div>

          <Button href={callHref} className="gap-2" size="sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.8 2.8c.5-.4 1.3-.4 1.8 0l2.3 1.8c.6.5.8 1.3.5 2L11.3 9c-.2.6 0 1.2.4 1.7l1.6 1.6c.4.4 1.1.6 1.7.4l2.6-.9c.7-.3 1.5-.1 2 .5l1.8 2.3c.4.5.4 1.3 0 1.8l-1.3 1.6c-.6.8-1.6 1.2-2.6 1.1A18.5 18.5 0 0 1 3 6.7c-.1-1 .3-2 1.1-2.6l1.6-1.3Z"
              />
            </svg>
            {content.nav.ctaLabel}
          </Button>
        </div>
      </Container>
    </header>
  );
}
