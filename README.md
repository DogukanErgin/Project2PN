# Peanuts Landing (Next.js)

Premium, static, single-page pub landing site for **Peanuts / Denizli**.

## Stack

- Next.js 16 (App Router, TypeScript)
- TailwindCSS
- Framer Motion
- No CMS/backend runtime. Instagram posts are updated via one sync command.
- Built-in language support: Turkish (`/tr`) and English (`/en`)

## Install & Run

```bash
npm install
# macOS/Linux
cp .env.example .env.local
# Windows PowerShell
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Language routes:

- `http://localhost:3000/tr`
- `http://localhost:3000/en`
- `http://localhost:3000/wifi` (table QR target)
- `http://localhost:3000/wifi-admin` (admin panel)

Production:

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` -> local development
- `npm run build` -> production build
- `npm run start` -> run production server
- `npm run lint` -> lint with ESLint (flat config)
- `npm run sync-instagram` -> fetch latest Instagram posts and update local snapshot JSON
- `npm run sync-menu` -> fetch latest menu items from Dinosoft and update local snapshot JSON
- `npm run sync-all` -> run both sync scripts

## Where To Edit Content

All text, labels, links, menu items, gallery sources, contact info are in:

- `src/content/site.ts`

Update locale objects under:

- `siteContentByLocale.tr`
- `siteContentByLocale.en`

Use this file to change:

- address
- phone
- whatsapp
- instagram
- google maps URL
- qr menu URL
- instagram feed fallback cards (`instagramFeed.posts`)
- language labels and wording for each section

## Instagram One-Command Sync

Instagram section reads this static snapshot file:

- `src/content/instagram-feed.generated.json`

Refresh it any time with:

```bash
npm run sync-instagram
```

Needed env variables (`.env.local` or `.env`):

- `INSTAGRAM_ACCESS_TOKEN` (required for API fetch)
- `INSTAGRAM_USER_ID` (recommended)
- `INSTAGRAM_PAGE_ID` (optional alternative if `INSTAGRAM_USER_ID` is not set)
- `INSTAGRAM_GRAPH_API_VERSION` (default `v24.0`)
- `INSTAGRAM_FEED_LIMIT` (default `4`)

If sync fails, the UI uses fallback cards from `site.ts`.

## Menu One-Command Sync

Menu preview section reads this static snapshot file:

- `src/content/menu.generated.json`

Refresh it any time with:

```bash
npm run sync-menu
```

By default source URL is:

- `https://peanuts.dinosoft.com.tr/menu`

Optional env override:

- `MENU_SOURCE_URL`

If sync fails, the UI uses fallback menu items from `site.ts`.

Synced payload also includes per-item descriptions and shows them in the category modal.

## Wi-Fi Password Page

Guests can open a dedicated Wi-Fi page at:

- `http://localhost:3000/wifi`

Language switch:

- Turkish: `/wifi`
- English: `/wifi?lang=en`

Configure values from environment:

- `NEXT_PUBLIC_WIFI_SSID` (default `Peanuts Guest`)
- `NEXT_PUBLIC_WIFI_PASSWORD` (default `PEANUTS2026`)

Password is rendered with a leading `#` on the page by design.

## Wi-Fi Admin Panel

Use the restricted panel to update only the Wi-Fi password:

- `http://localhost:3000/wifi-admin`

Required env variable:

- `WIFI_ADMIN_PASSWORD`

Runtime behavior:

- `/wifi-admin` sends updates to `app/api/wifi-admin/route.ts`
- Updated values are stored in `data/wifi-config.json`
- `/wifi` reads this file on each request
- SSID remains controlled by `NEXT_PUBLIC_WIFI_SSID`

If `WIFI_ADMIN_PASSWORD` is missing, API returns `503` and update is blocked.

## How To Replace Images

Gallery placeholders are in:

- `public/images/gallery-1.svg` ... `public/images/gallery-8.svg`

OpenGraph cover is:

- `public/images/og-cover.svg`

To replace with real photos:

1. Add optimized files to `public/images` (e.g. `.webp`).
2. Keep same filenames, or update paths in `src/content/site.ts` -> `gallery.items`.
3. Keep aspect ratio near 4:3 for consistent grid feel.

Instagram section background image:

- `public/assets/top-view-peanuts-green-background.png`

## Customize Peanut Animation

Peanut scroll reveal component:

- `src/components/PeanutReveal.tsx`

Key tuning points:

- Section travel area: `h-[120vh]`
- Scroll mapping and easing:
  - `useScroll(...)`
  - `useSpring(...)`
  - `useTransform(...)` for:
    - shell rotation (`leftRotate`, `rightRotate`)
    - shell split distance (`leftX`, `rightX`)
    - glow strength (`glowOpacity`)
    - tagline reveal (`textOpacity`, `textY`)

If you want subtler motion, reduce rotation and X values.

## Accessibility Notes

- Keyboard focus styles on all interactive controls
- Gallery lightbox:
  - close on `Esc`
  - focus trap while open
  - returns focus to opener
- Reduced motion support via `prefers-reduced-motion`
- Skip link available on locale pages

## SEO

- Base metadata in `app/layout.tsx`
- Locale-aware metadata in `app/[locale]/page.tsx`
- JSON-LD schemas (`BarOrPub`, `WebSite`, `WebPage`, `BreadcrumbList`) in `app/[locale]/page.tsx`
- Locale-specific Open Graph image endpoint:
  - `app/[locale]/opengraph-image.tsx`
- Optional fallback image assets:
  - `public/images/social-tr.png`
  - `public/images/social-en.png`
- Robots and sitemap:
  - `app/robots.ts`
  - `app/sitemap.ts`
- Web app manifest:
  - `app/manifest.ts`
