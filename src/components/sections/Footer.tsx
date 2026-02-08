import { type SiteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/Container";

type FooterProps = {
  content: SiteContent;
};

export function Footer({ content }: FooterProps) {
  return (
    <footer className="border-t border-white/10 py-8">
      <Container className="flex flex-col items-start justify-between gap-3 text-xs text-fog md:flex-row md:items-center">
        <p>{content.footer.copyright}</p>
        <div className="flex gap-4">
          <a
            href={content.business.instagram}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
          >
            {content.footer.instagramText}
          </a>
          <a
            href={content.business.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
          >
            {content.footer.whatsappText}
          </a>
        </div>
      </Container>
    </footer>
  );
}
