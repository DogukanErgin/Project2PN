"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { type SiteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/Container";
import { SectionTitle } from "@/src/components/ui/SectionTitle";
import { Reveal } from "@/src/components/ui/Reveal";

function clampIndex(index: number, length: number) {
  return (index + length) % length;
}

type GalleryProps = {
  content: SiteContent;
};

export function Gallery({ content }: GalleryProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [activeIndex]);

  const activeItem = activeIndex === null ? null : content.gallery.items[activeIndex];

  return (
    <section id="gallery" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionTitle title={content.gallery.title} subtitle={content.gallery.subtitle} />
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4">
          {content.gallery.items.map((item, index) => (
            <Reveal key={item.src} delay={index * 0.04} y={16}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-midnight-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                aria-label={`${index + 1}${content.ui.galleryOpenLabelSuffix}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 46vw, 24vw"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/80 px-4 py-6 backdrop-blur-sm md:p-10"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setActiveIndex(null);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={activeItem.alt}
              className="mx-auto flex h-full w-full max-w-5xl flex-col rounded-2xl border border-white/10 bg-midnight p-4 md:p-6"
              initial={reducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-fog">
                  {activeIndex! + 1} / {content.gallery.items.length}
                </p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cream transition hover:border-amber/60 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                >
                  {content.ui.galleryCloseLabel}
                </button>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 95vw, 1200px"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => clampIndex((current ?? 0) - 1, content.gallery.items.length))}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cream transition hover:border-amber/60 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                >
                  {content.ui.galleryPrevLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => clampIndex((current ?? 0) + 1, content.gallery.items.length))}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cream transition hover:border-amber/60 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                >
                  {content.ui.galleryNextLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
