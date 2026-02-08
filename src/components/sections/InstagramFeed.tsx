import Image from "next/image";
import { type InstagramPost, type SiteContent } from "@/src/content/site";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionTitle } from "@/src/components/ui/SectionTitle";

type InstagramFeedProps = {
  content: SiteContent;
  posts: InstagramPost[];
  source: "synced" | "fallback";
  syncedAt?: string | null;
};

export function InstagramFeed({ content, posts, source, syncedAt }: InstagramFeedProps) {
  const updatedLabel =
    syncedAt && !Number.isNaN(new Date(syncedAt).getTime())
      ? new Intl.DateTimeFormat(content.metadata.intlLocale, {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(syncedAt))
      : null;

  return (
    <section id="instagram" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-midnight-soft/70 p-6 shadow-card md:p-10">
            <div className="pointer-events-none absolute inset-0">
              <Image
                src={content.instagramFeed.backgroundImage}
                alt=""
                fill
                className="object-cover object-center opacity-20 mix-blend-screen"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-[radial-gradient(110%_100%_at_8%_8%,rgba(214,141,71,0.3),rgba(19,17,15,0.2)_36%,rgba(11,10,8,0.88)_76%)]" />
            </div>

            <div className="relative">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-3">
                  <SectionTitle title={content.instagramFeed.title} subtitle={content.instagramFeed.subtitle} />
                  {source === "synced" ? (
                    <p className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-amber">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                      {content.instagramFeed.syncedLabel}
                      {updatedLabel ? ` - ${updatedLabel}` : ""}
                    </p>
                  ) : (
                    <p className="max-w-xl text-xs text-fog">{content.instagramFeed.fallbackNote}</p>
                  )}
                </div>
                <Button href={content.business.instagram} target="_blank" rel="noreferrer" variant="ghost">
                  {content.instagramFeed.ctaLabel}
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {posts.map((post, index) => (
                  <Reveal key={`${post.href}-${index}`} delay={index * 0.06} y={14}>
                    <a
                      href={post.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group block overflow-hidden rounded-xl border border-white/10 bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={post.src}
                          alt={post.alt}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 45vw, 23vw"
                        />
                      </div>
                      <div className="flex items-center justify-between px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-fog">{post.dateLabel}</p>
                        <span className="text-xs uppercase tracking-[0.14em] text-amber">
                          {content.instagramFeed.badgeLabel}
                        </span>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
