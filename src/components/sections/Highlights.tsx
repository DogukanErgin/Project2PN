import { type SiteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/Container";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionTitle } from "@/src/components/ui/SectionTitle";

type HighlightsProps = {
  content: SiteContent;
};

export function Highlights({ content }: HighlightsProps) {
  return (
    <section className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionTitle title={content.highlightsSection.title} subtitle={content.highlightsSection.subtitle} />
        </Reveal>

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
          {content.highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className="h-full rounded-2xl border border-white/10 bg-midnight-soft/80 p-6 shadow-card">
                <h3 className="font-display text-xl tracking-tight text-cream">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
