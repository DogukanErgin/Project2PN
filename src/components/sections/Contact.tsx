import { type SiteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/Container";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionTitle } from "@/src/components/ui/SectionTitle";

type ContactProps = {
  content: SiteContent;
};

export function Contact({ content }: ContactProps) {
  const phoneHref = content.business.phoneTel
    ? `tel:${content.business.phoneTel}`
    : `tel:${content.business.phone.replace(/\s/g, "")}`;

  return (
    <section id="contact" className="scroll-mt-24 py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionTitle title={content.contact.title} subtitle={content.contact.note} />
        </Reveal>

        <Reveal delay={0.1} className="mt-8 rounded-2xl border border-white/10 bg-midnight-soft/80 p-6">
          <ul className="space-y-4">
            <li>
              <p className="text-xs uppercase tracking-[0.2em] text-fog">{content.contact.phoneLabel}</p>
              <a
                href={phoneHref}
                className="mt-1 inline-block text-lg text-cream transition hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
              >
                {content.business.phone}
              </a>
            </li>
            <li>
              <p className="text-xs uppercase tracking-[0.2em] text-fog">{content.contact.emailLabel}</p>
              <a
                href={`mailto:${content.business.email}`}
                className="mt-1 inline-block text-lg text-cream transition hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
              >
                {content.business.email}
              </a>
            </li>
            <li>
              <p className="text-xs uppercase tracking-[0.2em] text-fog">{content.contact.whatsappLabel}</p>
              <a
                href={content.business.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-lg text-cream transition hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
              >
                {content.business.whatsapp}
              </a>
            </li>
            <li>
              <p className="text-xs uppercase tracking-[0.2em] text-fog">{content.contact.instagramLabel}</p>
              <a
                href={content.business.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-lg text-cream transition hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
              >
                {content.contact.instagramHandle}
              </a>
            </li>
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
