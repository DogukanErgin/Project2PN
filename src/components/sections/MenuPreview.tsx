"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { type SiteContent } from "@/src/content/site";
import menuSnapshot from "@/src/content/menu.generated.json";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionTitle } from "@/src/components/ui/SectionTitle";

type SyncedMenuCategory = {
  name: string;
  href: string;
  image?: string;
};

type SyncedMenuItem = {
  name: string;
  category: string;
  topCategory?: string;
  price: string;
  description?: string;
  href?: string;
};

type MenuPreviewProps = {
  content: SiteContent;
};

function categoryKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleUpperCase("tr-TR");
}

function normalizeDescription(value?: string) {
  if (!value) return "";

  const normalized = value
    .replace(/\s+/g, " ")
    .replace(/(^|\s)%(\d{1,3})(?=\s|$)/g, "$1$2%")
    .trim();

  if (!normalized || /^adet$/i.test(normalized)) {
    return "";
  }

  return normalized;
}

export function MenuPreview({ content }: MenuPreviewProps) {
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<SyncedMenuCategory | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const hasSyncedMenu = Array.isArray(menuSnapshot.items) && menuSnapshot.items.length > 0;
  const syncedCategories =
    Array.isArray(menuSnapshot.topCategories)
      ? (menuSnapshot.topCategories as SyncedMenuCategory[]).filter((category) => category?.name && category?.href)
      : [];
  const fallbackCategories: SyncedMenuCategory[] = Array.from(new Set(content.menu.items.map((item) => item.category)))
    .slice(0, 12)
    .map((category) => ({
      name: category,
      href: content.business.qrMenuUrl
    }));
  const categoryCards = (syncedCategories.length > 0 ? syncedCategories : fallbackCategories).slice(0, 20);

  const allItems = useMemo<SyncedMenuItem[]>(
    () =>
      hasSyncedMenu
        ? ((menuSnapshot.items as SyncedMenuItem[]).filter((item) => item?.name && item?.price) ?? [])
        : content.menu.items.map((item) => ({
            name: item.name,
            category: item.category,
            topCategory: item.category,
            price: item.price,
            description: "",
            href: content.business.qrMenuUrl
          })),
    [content.business.qrMenuUrl, content.menu.items, hasSyncedMenu]
  );

  const itemsByTopCategory = useMemo(() => {
    const map = new Map<string, SyncedMenuItem[]>();
    for (const item of allItems) {
      const topCategory = item.topCategory || item.category;
      const key = categoryKey(topCategory);
      const current = map.get(key) ?? [];
      current.push(item);
      map.set(key, current);
    }
    return map;
  }, [allItems]);

  const activeItems = activeCategory ? itemsByTopCategory.get(categoryKey(activeCategory.name)) ?? [] : [];

  const syncedAt =
    hasSyncedMenu && menuSnapshot.generatedAt && !Number.isNaN(new Date(menuSnapshot.generatedAt).getTime())
      ? new Intl.DateTimeFormat(content.metadata.intlLocale, {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(menuSnapshot.generatedAt))
      : null;

  const syncedItemCount =
    hasSyncedMenu && typeof menuSnapshot.totalItems === "number" ? menuSnapshot.totalItems : null;

  useEffect(() => {
    if (!activeCategory) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCategory(null);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement as HTMLElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [activeCategory]);

  return (
    <section id="menu" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6 md:gap-10">
          <div className="space-y-3">
            <SectionTitle title={content.menu.title} subtitle={content.menu.subtitle} />
            {hasSyncedMenu ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-amber">
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                {content.menu.syncedLabel}
                {syncedAt ? ` - ${syncedAt}` : ""}
                {syncedItemCount ? ` - ${syncedItemCount} ${content.menu.modalCountLabel}` : ""}
              </p>
            ) : (
              <p className="max-w-xl text-xs text-fog">{content.menu.fallbackNote}</p>
            )}
          </div>
          <Button href={content.business.qrMenuUrl} target="_blank" rel="noreferrer" variant="ghost">
            {content.menu.qrLabel}
          </Button>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 md:mt-12">
          <div className="rounded-2xl border border-white/10 bg-midnight-soft/60 p-5 md:p-6">
            <SectionTitle title={content.menu.categoryTitle} subtitle={content.menu.categorySubtitle} />

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {categoryCards.map((category, index) => {
                const count = itemsByTopCategory.get(categoryKey(category.name))?.length ?? 0;
                return (
                  <button
                    key={`${category.name}-${index}`}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className="group relative block aspect-[2.9/1] overflow-hidden rounded-xl border border-white/10 bg-midnight/60 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                    aria-label={`${category.name.trim()} ${content.menu.viewLabel}`}
                  >
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={`${category.name} category`}
                        fill
                        className="object-cover brightness-[0.72] saturate-[0.85] transition duration-500 group-hover:scale-105 group-hover:brightness-[0.84]"
                        sizes="(max-width: 768px) 96vw, 48vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(182,106,42,0.55),rgba(42,31,23,0.35),rgba(17,14,11,0.7))]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/58 to-black/74" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                    <div className="absolute inset-x-0 bottom-2 flex items-center justify-between gap-2 px-3">
                      <span className="rounded-full bg-black/55 px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cream">
                        {category.name.trim()}
                      </span>
                      {count > 0 ? (
                        <span className="rounded-full border border-white/25 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-fog">
                          {count} {content.menu.modalCountLabel}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>

      <AnimatePresence>
        {activeCategory ? (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/80 px-4 py-6 backdrop-blur-sm md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setActiveCategory(null);
              }
            }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${activeCategory.name.trim()} items`}
              className="mx-auto flex h-full w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-midnight p-4 md:p-6"
              initial={reducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="font-display text-xl text-cream md:text-2xl">{activeCategory.name.trim()}</h3>
                  <p className="text-xs uppercase tracking-[0.18em] text-fog">
                    {activeItems.length} {content.menu.modalCountLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activeCategory.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cream transition hover:border-amber/60 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                  >
                    {content.menu.modalOpenExternalLabel}
                  </a>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cream transition hover:border-amber/60 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                  >
                    {content.menu.modalCloseLabel}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                {activeItems.length > 0 ? (
                  <ul className="divide-y divide-white/10">
                    {activeItems.map((item, index) => {
                      const description = normalizeDescription(item.description);
                      return (
                        <li key={item.href ?? `${item.name}-${index}`} className="flex items-start justify-between gap-4 py-3">
                          <div className="min-w-0">
                            {item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-semibold text-cream transition hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight md:text-base"
                              >
                                {item.name}
                              </a>
                            ) : (
                              <p className="text-sm font-semibold text-cream md:text-base">{item.name}</p>
                            )}
                            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-fog">{item.category}</p>
                            {description ? (
                              <p className="mt-2 text-xs leading-relaxed text-fog/95 md:text-sm">{description}</p>
                            ) : null}
                          </div>
                          <p className="shrink-0 font-display text-lg text-amber">{item.price}</p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="rounded-xl border border-white/10 bg-midnight-soft/60 px-4 py-4 text-sm text-fog">
                    {content.menu.modalEmptyLabel}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
