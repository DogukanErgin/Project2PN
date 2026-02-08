import { type SiteContent } from "@/src/content/site";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { Reveal } from "@/src/components/ui/Reveal";

type HeroProps = {
  content: SiteContent;
};

export function Hero({ content }: HeroProps) {
  return (
    <section id="top" className="relative isolate min-h-[92vh] overflow-hidden pb-28 pt-36 md:min-h-[100vh] md:pb-32 md:pt-44">
      <div className="pointer-events-none absolute inset-0 -z-20">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-[0.8]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={content.hero.backgroundVideoAsset} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.26)_0%,rgba(9,8,7,0.62)_46%,rgba(9,8,7,0.88)_100%)]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:4px_4px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(199,131,68,0.28),rgba(11,10,8,0)_68%)] blur-2xl" />
      </div>

      <Container>
        <Reveal className="mx-auto max-w-4xl space-y-7 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-fog">{content.hero.eyebrow}</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-cream sm:text-5xl md:text-7xl">
            {content.hero.headline}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-fog md:text-lg">{content.hero.subheadline}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="#menu">{content.hero.ctaPrimary}</Button>
            <Button
              href={content.business.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              variant="ghost"
            >
              {content.hero.ctaSecondary}
            </Button>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-amber/85">{content.hero.helperLine}</p>
        </Reveal>
      </Container>
    </section>
  );
}
