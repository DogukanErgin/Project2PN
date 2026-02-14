import { type Locale } from "@/src/content/site";

const DEFAULT_WIFI_SSID = "Peanuts Guest";
const DEFAULT_WIFI_PASSWORD = "PEANUTS2026";

function readEnvValue(value: string | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

export function normalizeWifiSsid(value: string): string {
  const normalized = value.trim();
  return normalized || DEFAULT_WIFI_SSID;
}

export function normalizeWifiPassword(value: string): string {
  const withoutHash = value.replace(/^#+/, "").trim();
  return withoutHash || DEFAULT_WIFI_PASSWORD;
}

export function getDefaultWifiConfig() {
  const ssid = normalizeWifiSsid(readEnvValue(process.env.NEXT_PUBLIC_WIFI_SSID, DEFAULT_WIFI_SSID));
  const password = normalizeWifiPassword(
    readEnvValue(process.env.NEXT_PUBLIC_WIFI_PASSWORD, DEFAULT_WIFI_PASSWORD)
  );

  return { ssid, password };
}

export type WifiCopy = {
  title: string;
  subtitle: string;
  ssidLabel: string;
  passwordLabel: string;
  helperLine: string;
  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
  securityNote: string;
  backLabel: string;
  menuLabel: string;
  languageLabel: string;
};

const wifiCopyByLocale: Record<Locale, WifiCopy> = {
  tr: {
    title: "Wi-Fi Sifresi",
    subtitle:
      "Ozel gunlerde guvenlik ve hizmet kalitesi icin sifremizi yeniliyoruz. Masadaki QR kod ile bu sayfaya her zaman ulasabilirsiniz.",
    ssidLabel: "Ag Adi (SSID)",
    passwordLabel: "Sifre",
    helperLine: "Sifreyi # isaretiyle birlikte girin.",
    copyLabel: "Sifreyi Kopyala",
    copiedLabel: "Kopyalandi",
    copyFailedLabel: "Kopyalama basarisiz. Elle kopyalayin.",
    securityNote: "Not: Sifre donemsel olarak guncellenir.",
    backLabel: "Ana sayfaya don",
    menuLabel: "Menu bolumune git",
    languageLabel: "Dil"
  },
  en: {
    title: "Wi-Fi Password",
    subtitle:
      "We rotate the password on special days for security and service quality. You can always return to this page via the QR code on your table.",
    ssidLabel: "Network Name (SSID)",
    passwordLabel: "Password",
    helperLine: "Enter the password together with the # sign.",
    copyLabel: "Copy Password",
    copiedLabel: "Copied",
    copyFailedLabel: "Copy failed. Please copy manually.",
    securityNote: "Note: The password is updated periodically.",
    backLabel: "Back to home",
    menuLabel: "Go to menu section",
    languageLabel: "Language"
  }
};

export function getWifiCopy(locale: Locale): WifiCopy {
  return wifiCopyByLocale[locale];
}
