export type Locale = "tr" | "en";

export const locales: Locale[] = ["tr", "en"];
export const defaultLocale: Locale = "tr";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export type NavLink = {
  label: string;
  href: string;
};

export type Highlight = {
  title: string;
  description: string;
};

export type MenuItem = {
  name: string;
  category: string;
  price: string;
};

export type GalleryItem = {
  src: string;
  alt: string;
};

export type InstagramPost = {
  src: string;
  alt: string;
  href: string;
  dateLabel: string;
};

export type OpeningHours = {
  label: string;
  open: string;
  close: string;
  days: Array<
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  >;
};

const trContent = {
  brand: "Peanuts",
  ui: {
    skipLink: "İçeriğe geç",
    mainNavAriaLabel: "Ana navigasyon",
    galleryOpenLabelSuffix: ". görseli aç",
    galleryCloseLabel: "Kapat",
    galleryPrevLabel: "Önceki",
    galleryNextLabel: "Sonraki",
    languageSwitcherLabel: "Dil seçimi",
    languageShort: {
      tr: "TR",
      en: "EN"
    } as Record<Locale, string>,
    languageLong: {
      tr: "Türkçe",
      en: "English"
    } as Record<Locale, string>
  },
  metadata: {
    title: "Peanuts | Denizli'de Premium Pub Deneyimi",
    description:
      "Peanuts, Denizli'de modern ambiyans, güçlü kokteyller ve enerjik geceleri bir araya getiren premium pub deneyimi sunar.",
    url: "https://peanutsdenizli.com",
    image: "/tr/opengraph-image",
    imageAlt: "Peanuts Denizli premium pub sosyal paylaşım görseli",
    keywords: [
      "peanuts denizli",
      "denizli pub",
      "denizli bar",
      "kokteyl denizli",
      "denizli gece hayatı",
      "denizli mekan önerisi",
      "denizli pub menü",
      "pamukkale pub"
    ],
    ogLocale: "tr_TR",
    intlLocale: "tr-TR"
  },
  business: {
    name: "Peanuts Pub",
    address: "Kınıklı, 6014. Sk. No:5/A, 20160 Pamukkale/Denizli",
    phone: "Tel: +90 (540) PEANUTS & +90 (258) 263 22 22",
    phoneTel: "+902582632222",
    whatsapp: "+90 530 000 00 00",
    whatsappUrl: "https://wa.me/905300000000",
    email: "info@peanuts.com.tr",
    instagram: "https://instagram.com/peanutsdenizli",
    googleMapsUrl: "https://maps.google.com/?q=Peanuts+Pub+Denizli",
    qrMenuUrl: "https://peanuts.dinosoft.com.tr/menu",
    googleReviewUrl: "https://g.page/r/CeGDa8InIUo6EBE/review"
  },
  nav: {
    links: [
      { label: "Menü", href: "#menu" },
      { label: "Galeri", href: "#gallery" },
      { label: "Konum", href: "#location" },
      { label: "İletişim", href: "#contact" }
    ] satisfies NavLink[],
    ctaLabel: "Ara"
  },
  hero: {
    eyebrow: "Denizli / Gece Kültürü",
    headline: "İyi müzik, iyi içki, doğru kalabalık.",
    subheadline:
      "Peanuts, şehir ritmini modern pub çizgisiyle buluşturur. Gün batımından kapanışa kadar akış hep canlı.",
    ctaPrimary: "Menüye Bak",
    ctaSecondary: "Yol Tarifi",
    helperLine: "Hafta içi bile dolu. Denizli'nin enerjik pub'ı.",
    backgroundVideoAsset: "/assets/peanuts_hero_video.mp4"
  },
  peanutReveal: {
    tagline: "Kabuk kırılır, gece başlar."
  },
  highlights: [
    {
      title: "Kokteyller & Fıçı",
      description:
        "Klasik reçeteler, house imzalar ve buz gibi fıçı seçenekleriyle bardaki standart hep yüksek."
    },
    {
      title: "Atıştırmalıklar",
      description:
        "İçeceğe eşlik eden hızlı ama özenli tabaklar. Paylaşmalıklar geceyi dengede tutar."
    },
    {
      title: "Ambiyans",
      description:
        "Sıcak tonlar, kontrollü ışık ve ritmik playlist ile sohbet de dans da aynı akışta."
    }
  ] satisfies Highlight[],
  highlightsSection: {
    title: "Öne Çıkanlar",
    subtitle: "Geceyi taşıyan üç sabit."
  },
  menu: {
    title: "Menü",
    subtitle: "Müşterinin dış menüsünden tek komutla senkronlanan güncel seçkiler.",
    qrLabel: "Tam Menü",
    syncedLabel: "Menü Senkron",
    fallbackNote: "Harici menü henüz senkronlanmadı. Yedek içerik gösteriliyor.",
    categoryTitle: "Kategoriler",
    categorySubtitle: "Bir kategori seçerek ürünleri fiyatlarıyla birlikte inceleyin.",
    modalCountLabel: "ürün",
    modalCloseLabel: "Kapat",
    modalOpenExternalLabel: "Dış menüde aç",
    modalEmptyLabel: "Bu kategori için ürün bulunamadı.",
    viewLabel: "Ürünü Aç",
    items: [
      { name: "Smoked Negroni", category: "Signature Cocktail", price: "₺320" },
      { name: "Peanuts Mule", category: "Signature Cocktail", price: "₺290" },
      { name: "Espresso Martini", category: "Cocktail", price: "₺300" },
      { name: "London Dry Gin Tonic", category: "Gin", price: "₺270" },
      { name: "Fıçı Bira 50cl", category: "Beer", price: "₺190" },
      { name: "Craft IPA 33cl", category: "Beer", price: "₺230" },
      { name: "Truffle Fries", category: "Snack", price: "₺210" },
      { name: "Mini Sliders", category: "Snack", price: "₺280" }
    ] satisfies MenuItem[]
  },
  gallery: {
    title: "Galeri",
    subtitle: "Mekanın ışığı, barın ritmi, masaların enerjisi.",
    items: [
      { src: "/images/gallery-1.svg", alt: "Peanuts bar tezgahı gece ışıkları" },
      { src: "/images/gallery-2.svg", alt: "Kokteyl sunumu ve amber tonları" },
      { src: "/images/gallery-3.svg", alt: "Peanuts iç mekanda modern oturma düzeni" },
      { src: "/images/gallery-4.svg", alt: "DJ kabini ve dans alanı ambiyansı" },
      { src: "/images/gallery-5.svg", alt: "Bar arkası şişe rafları sıcak ışıkla" },
      { src: "/images/gallery-6.svg", alt: "Kalabalık masa ve gece atmosferi" },
      { src: "/images/gallery-7.svg", alt: "Atıştırmalık tabak ve içecek eşleşmesi" },
      { src: "/images/gallery-8.svg", alt: "Peanuts giriş alanı ve neon ışık" }
    ] satisfies GalleryItem[]
  },
  instagramFeed: {
    title: "Instagram'dan Son Kareler",
    subtitle: "Son gönderiler tek komutla güncellenen statik snapshot olarak sunulur.",
    ctaLabel: "Instagram'a Git",
    badgeLabel: "Instagram",
    syncedLabel: "Güncellendi",
    fallbackNote: "Henüz senkron yapılmadı. Varsayılan görseller gösteriliyor.",
    backgroundImage: "/assets/top-view-peanuts-green-background.png",
    posts: [
      {
        src: "/images/gallery-1.svg",
        alt: "Bar tezgahında gece ışığı",
        href: "https://instagram.com/peanutsdenizli",
        dateLabel: "Son paylaşım"
      },
      {
        src: "/images/gallery-2.svg",
        alt: "Signature kokteyl sunumu",
        href: "https://instagram.com/peanutsdenizli",
        dateLabel: "2 gün önce"
      },
      {
        src: "/images/gallery-4.svg",
        alt: "DJ kabini ve kalabalık",
        href: "https://instagram.com/peanutsdenizli",
        dateLabel: "3 gün önce"
      },
      {
        src: "/images/gallery-8.svg",
        alt: "Mekan girişinden bir kare",
        href: "https://instagram.com/peanutsdenizli",
        dateLabel: "Bu hafta"
      }
    ] satisfies InstagramPost[]
  },
  location: {
    title: "Konum",
    subtitle: "Merkezde kolay ulaşım, gecenin kalbinde güçlü bir durak.",
    addressLabel: "Adres",
    hoursLabel: "Açılış Saatleri",
    mapButton: "Google Maps'te Aç",
    reviewButton: "Google'da Yorum Yap",
    hours: [
      {
        label: "Cumartesi",
        open: "10:00",
        close: "02:00",
        days: ["Saturday"]
      },
      {
        label: "Pazar",
        open: "10:00",
        close: "02:00",
        days: ["Sunday"]
      },
      {
        label: "Pazartesi",
        open: "10:00",
        close: "02:00",
        days: ["Monday"]
      },
      {
        label: "Salı",
        open: "10:00",
        close: "02:00",
        days: ["Tuesday"]
      },
      {
        label: "Çarşamba",
        open: "10:00",
        close: "02:00",
        days: ["Wednesday"]
      },
      {
        label: "Perşembe",
        open: "10:00",
        close: "02:00",
        days: ["Thursday"]
      },
      {
        label: "Cuma",
        open: "10:00",
        close: "02:00",
        days: ["Friday"]
      }
    ] satisfies OpeningHours[]
  },
  contact: {
    title: "İletişim",
    note: "Rezervasyon için arayın/WhatsApp.",
    phoneLabel: "Telefon",
    emailLabel: "E-posta",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    instagramHandle: "@peanutsdenizli"
  },
  footer: {
    copyright: "© 2026 Peanuts Pub. Tüm hakları saklıdır.",
    instagramText: "Instagram",
    whatsappText: "WhatsApp"
  }
};

const enContent: typeof trContent = {
  brand: "Peanuts",
  ui: {
    skipLink: "Skip to content",
    mainNavAriaLabel: "Primary navigation",
    galleryOpenLabelSuffix: ". open image",
    galleryCloseLabel: "Close",
    galleryPrevLabel: "Previous",
    galleryNextLabel: "Next",
    languageSwitcherLabel: "Language switcher",
    languageShort: {
      tr: "TR",
      en: "EN"
    },
    languageLong: {
      tr: "Turkish",
      en: "English"
    }
  },
  metadata: {
    title: "Peanuts | Premium Pub Experience in Denizli",
    description:
      "Peanuts offers a premium pub experience in Denizli with modern atmosphere, strong cocktails, and energetic nights.",
    url: "https://peanutsdenizli.com",
    image: "/en/opengraph-image",
    imageAlt: "Peanuts Denizli premium pub social sharing cover image",
    keywords: [
      "peanuts denizli",
      "denizli pub",
      "denizli bar",
      "cocktail bar denizli",
      "best pub in denizli",
      "denizli nightlife",
      "pub menu denizli",
      "pamukkale pub"
    ],
    ogLocale: "en_US",
    intlLocale: "en-US"
  },
  business: {
    name: "Peanuts Pub",
    address: "Kınıklı, 6014. Sk. No:5/A, 20160 Pamukkale/Denizli",
    phone: "Tel: +90 (540) PEANUTS & +90 (258) 263 22 22",
    phoneTel: "+902582632222",
    whatsapp: "+90 530 000 00 00",
    whatsappUrl: "https://wa.me/905300000000",
    email: "info@peanuts.com.tr",
    instagram: "https://instagram.com/peanutsdenizli",
    googleMapsUrl: "https://maps.google.com/?q=Peanuts+Pub+Denizli",
    qrMenuUrl: "https://peanuts.dinosoft.com.tr/menu",
    googleReviewUrl: "https://g.page/r/CeGDa8InIUo6EBE/review"
  },
  nav: {
    links: [
      { label: "Menu", href: "#menu" },
      { label: "Gallery", href: "#gallery" },
      { label: "Location", href: "#location" },
      { label: "Contact", href: "#contact" }
    ],
    ctaLabel: "Call"
  },
  hero: {
    eyebrow: "Denizli / Night Culture",
    headline: "Great music, great drinks, the right crowd.",
    subheadline:
      "Peanuts blends the city's rhythm with a modern pub vibe. From sunset to closing, the energy stays alive.",
    ctaPrimary: "View Menu",
    ctaSecondary: "Directions",
    helperLine: "Packed even on weekdays. Denizli's energetic pub.",
    backgroundVideoAsset: "/assets/peanuts_hero_video.mp4"
  },
  peanutReveal: {
    tagline: "The shell cracks, the night begins."
  },
  highlights: [
    {
      title: "Cocktails & Draft",
      description:
        "Classic recipes, house signatures, and ice-cold draft options keep the bar standard consistently high."
    },
    {
      title: "Bar Bites",
      description:
        "Fast but thoughtful plates that pair perfectly with drinks. Shareables keep the night balanced."
    },
    {
      title: "Atmosphere",
      description:
        "Warm tones, controlled lighting, and a rhythmic playlist make conversation and dancing flow together."
    }
  ],
  highlightsSection: {
    title: "Highlights",
    subtitle: "Three constants that carry the night."
  },
  menu: {
    title: "Menu",
    subtitle: "Fresh selections synced from the external menu with a single command.",
    qrLabel: "Full Menu",
    syncedLabel: "Menu Sync",
    fallbackNote: "External menu is not synced yet. Showing fallback content.",
    categoryTitle: "Categories",
    categorySubtitle: "Pick a category to browse current products with prices.",
    modalCountLabel: "items",
    modalCloseLabel: "Close",
    modalOpenExternalLabel: "Open external menu",
    modalEmptyLabel: "No products found for this category.",
    viewLabel: "Open Item",
    items: [
      { name: "Smoked Negroni", category: "Signature Cocktail", price: "₺320" },
      { name: "Peanuts Mule", category: "Signature Cocktail", price: "₺290" },
      { name: "Espresso Martini", category: "Cocktail", price: "₺300" },
      { name: "London Dry Gin Tonic", category: "Gin", price: "₺270" },
      { name: "Draft Beer 50cl", category: "Beer", price: "₺190" },
      { name: "Craft IPA 33cl", category: "Beer", price: "₺230" },
      { name: "Truffle Fries", category: "Snack", price: "₺210" },
      { name: "Mini Sliders", category: "Snack", price: "₺280" }
    ]
  },
  gallery: {
    title: "Gallery",
    subtitle: "The venue light, bar rhythm, and table energy.",
    items: [
      { src: "/images/gallery-1.svg", alt: "Peanuts bar counter under night lights" },
      { src: "/images/gallery-2.svg", alt: "Cocktail presentation in amber tones" },
      { src: "/images/gallery-3.svg", alt: "Modern indoor seating layout at Peanuts" },
      { src: "/images/gallery-4.svg", alt: "DJ booth and dance floor atmosphere" },
      { src: "/images/gallery-5.svg", alt: "Back bar bottle shelves with warm lighting" },
      { src: "/images/gallery-6.svg", alt: "Crowded table and night atmosphere" },
      { src: "/images/gallery-7.svg", alt: "Snack plate and drink pairing" },
      { src: "/images/gallery-8.svg", alt: "Peanuts entrance area with neon light" }
    ]
  },
  instagramFeed: {
    title: "Latest Frames from Instagram",
    subtitle: "Recent posts are shown as a static snapshot updated with one command.",
    ctaLabel: "Go to Instagram",
    badgeLabel: "Instagram",
    syncedLabel: "Updated",
    fallbackNote: "No sync yet. Showing default visuals.",
    backgroundImage: "/assets/top-view-peanuts-green-background.png",
    posts: [
      {
        src: "/images/gallery-1.svg",
        alt: "Night light over the bar counter",
        href: "https://instagram.com/peanutsdenizli",
        dateLabel: "Latest post"
      },
      {
        src: "/images/gallery-2.svg",
        alt: "Signature cocktail presentation",
        href: "https://instagram.com/peanutsdenizli",
        dateLabel: "2 days ago"
      },
      {
        src: "/images/gallery-4.svg",
        alt: "DJ booth and crowd",
        href: "https://instagram.com/peanutsdenizli",
        dateLabel: "3 days ago"
      },
      {
        src: "/images/gallery-8.svg",
        alt: "A frame from the venue entrance",
        href: "https://instagram.com/peanutsdenizli",
        dateLabel: "This week"
      }
    ]
  },
  location: {
    title: "Location",
    subtitle: "Easy to reach in the center, right at the heart of the night.",
    addressLabel: "Address",
    hoursLabel: "Opening Hours",
    mapButton: "Open in Google Maps",
    reviewButton: "Write a Google Review",
    hours: [
      {
        label: "Saturday",
        open: "10:00",
        close: "02:00",
        days: ["Saturday"]
      },
      {
        label: "Sunday",
        open: "10:00",
        close: "02:00",
        days: ["Sunday"]
      },
      {
        label: "Monday",
        open: "10:00",
        close: "02:00",
        days: ["Monday"]
      },
      {
        label: "Tuesday",
        open: "10:00",
        close: "02:00",
        days: ["Tuesday"]
      },
      {
        label: "Wednesday",
        open: "10:00",
        close: "02:00",
        days: ["Wednesday"]
      },
      {
        label: "Thursday",
        open: "10:00",
        close: "02:00",
        days: ["Thursday"]
      },
      {
        label: "Friday",
        open: "10:00",
        close: "02:00",
        days: ["Friday"]
      }
    ]
  },
  contact: {
    title: "Contact",
    note: "For reservations, call / WhatsApp.",
    phoneLabel: "Phone",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    instagramLabel: "Instagram",
    instagramHandle: "@peanutsdenizli"
  },
  footer: {
    copyright: "© 2026 Peanuts Pub. All rights reserved.",
    instagramText: "Instagram",
    whatsappText: "WhatsApp"
  }
};

export type SiteContent = typeof trContent;

export const siteContentByLocale: Record<Locale, SiteContent> = {
  tr: trContent,
  en: enContent
};

export const siteContent = siteContentByLocale[defaultLocale];

export function getSiteContent(locale: string): SiteContent {
  if (isLocale(locale)) {
    return siteContentByLocale[locale];
  }
  return siteContentByLocale[defaultLocale];
}
