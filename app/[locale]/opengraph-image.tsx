import { ImageResponse } from "next/og";
import { type Locale, getSiteContent, isLocale } from "@/src/content/site";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OpenGraphImage({ params }: Props) {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "tr";
  const content = getSiteContent(resolvedLocale);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          background:
            "radial-gradient(800px 420px at 88% 18%, rgba(214,141,71,0.30), transparent 70%), linear-gradient(135deg, #0b0a08 0%, #14100d 100%)",
          color: "#f6e7d2",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
            opacity: 0.2
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22,
            padding: "70px 80px",
            zIndex: 2,
            width: "62%"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid rgba(217,161,91,0.45)",
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: 20,
              letterSpacing: 2.8,
              textTransform: "uppercase",
              color: "#d9a15b"
            }}
          >
            DENIZLI PUB
          </div>
          <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1 }}>Peanuts</div>
          <div style={{ fontSize: 46, color: "#d4c5b4", lineHeight: 1.12 }}>
            {resolvedLocale === "tr" ? "Premium Pub Deneyimi" : "Premium Pub Experience"}
          </div>
          <div style={{ fontSize: 34, color: "#d9a15b", lineHeight: 1.2 }}>
            {resolvedLocale === "tr" ? "Kabuk kırılır, gece başlar." : "The shell cracks, the night begins."}
          </div>
          <div style={{ fontSize: 30, color: "#b9a995", marginTop: 26 }}>{content.business.address}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "38%",
            position: "relative",
            zIndex: 2
          }}
        >
          <svg width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shellFill" x1="30" y1="20" x2="330" y2="350" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C9955E" />
                <stop offset="1" stopColor="#8A5A32" />
              </linearGradient>
            </defs>
            <ellipse cx="130" cy="190" rx="88" ry="132" fill="url(#shellFill)" stroke="#7A4D2A" strokeWidth="4" />
            <ellipse cx="230" cy="190" rx="88" ry="132" fill="url(#shellFill)" stroke="#7A4D2A" strokeWidth="4" />
            <g stroke="#7A4D2A" strokeWidth="4" opacity="0.65">
              <path d="M76 120C108 126 136 129 184 134" />
              <path d="M74 154C106 160 136 163 184 168" />
              <path d="M72 188C104 194 136 197 184 202" />
              <path d="M74 222C106 228 136 231 184 236" />
              <path d="M176 134C226 140 254 143 286 146" />
              <path d="M176 168C226 174 254 177 286 180" />
              <path d="M176 202C226 208 254 211 286 214" />
              <path d="M176 236C226 242 254 245 286 248" />
            </g>
          </svg>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
