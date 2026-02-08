import { type SiteContent } from "@/src/content/site";
import { Button } from "@/src/components/ui/Button";
import { Container } from "@/src/components/ui/Container";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionTitle } from "@/src/components/ui/SectionTitle";

type LocationProps = {
  content: SiteContent;
};

export function Location({ content }: LocationProps) {
  return (
    <section id="location" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionTitle title={content.location.title} subtitle={content.location.subtitle} />
        </Reveal>

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2">
          <Reveal>
            <article className="rounded-2xl border border-white/10 bg-midnight-soft/80 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-fog">{content.location.addressLabel}</p>
              <address className="mt-3 not-italic text-cream">{content.business.address}</address>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  href={content.business.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="ghost"
                >
                  {content.location.mapButton}
                </Button>
                <Button
                  href={content.business.googleReviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="ghost"
                  className="gap-2"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="m12 2.3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.4L12 17l-5.6 2.8 1.1-6.4L2.9 8.9l6.3-.9L12 2.3Z" />
                  </svg>
                  {content.location.reviewButton}
                </Button>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="rounded-2xl border border-white/10 bg-midnight-soft/80 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-fog">{content.location.hoursLabel}</p>
              <ul className="mt-3 space-y-3">
                {content.location.hours.map((row) => (
                  <li key={row.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
                    <span className="text-sm text-cream">{row.label}</span>
                    <span className="text-sm text-fog">
                      {row.open} - {row.close}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
