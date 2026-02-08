import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "src", "content", "instagram-feed.generated.json");
const DEFAULT_API_VERSION = "v24.0";
const DEFAULT_LIMIT = 4;

function parseDotEnv(contents) {
  const result = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) {
      result[key] = value;
    }
  }

  return result;
}

async function loadEnvFile(filePath) {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    return parseDotEnv(contents);
  } catch {
    return {};
  }
}

function clampLimit(value) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed) || parsed < 1) return DEFAULT_LIMIT;
  if (parsed > 12) return 12;
  return parsed;
}

function formatDateLabel(timestamp) {
  if (!timestamp) return "Yeni";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Yeni";

  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Bugun";
  if (diffDays === 1) return "Dun";
  if (diffDays < 7) return `${diffDays} gun once`;

  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short" }).format(date);
}

function toAltText(caption) {
  const clean = caption?.trim();
  if (!clean) return "Peanuts Instagram paylasimi";
  return clean.length > 92 ? `${clean.slice(0, 89)}...` : clean;
}

function pickImageUrl(media) {
  if (media.media_type === "VIDEO" || media.media_type === "REELS") {
    return media.thumbnail_url ?? media.media_url ?? null;
  }

  if (media.media_type === "CAROUSEL_ALBUM") {
    if (media.media_url) return media.media_url;
    const child = media.children?.data?.find((item) => item.media_url || item.thumbnail_url);
    return child ? child.thumbnail_url ?? child.media_url ?? null : null;
  }

  return media.media_url ?? media.thumbnail_url ?? null;
}

async function resolveInstagramUserId({ accessToken, userId, pageId, apiVersion }) {
  if (userId) return userId;
  if (!pageId) return null;

  const params = new URLSearchParams({
    fields: "instagram_business_account{id}",
    access_token: accessToken
  });

  const url = `https://graph.facebook.com/${apiVersion}/${pageId}?${params.toString()}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) return null;

  const payload = await response.json();
  return payload?.instagram_business_account?.id ?? null;
}

async function main() {
  const envLocal = await loadEnvFile(path.join(ROOT, ".env.local"));
  const envFile = await loadEnvFile(path.join(ROOT, ".env"));
  const env = {
    ...envFile,
    ...envLocal,
    ...process.env
  };

  const accessToken = env.INSTAGRAM_ACCESS_TOKEN;
  const apiVersion = env.INSTAGRAM_GRAPH_API_VERSION || DEFAULT_API_VERSION;
  const limit = clampLimit(env.INSTAGRAM_FEED_LIMIT);

  if (!accessToken) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN bulunamadi. .env.local veya .env dosyasina ekleyin.");
  }

  const instagramUserId = await resolveInstagramUserId({
    accessToken,
    userId: env.INSTAGRAM_USER_ID,
    pageId: env.INSTAGRAM_PAGE_ID,
    apiVersion
  });

  if (!instagramUserId) {
    throw new Error("INSTAGRAM_USER_ID veya INSTAGRAM_PAGE_ID ile Instagram hesap ID'si cozulemedi.");
  }

  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}";
  const params = new URLSearchParams({
    fields,
    limit: String(limit),
    access_token: accessToken
  });
  const url = `https://graph.facebook.com/${apiVersion}/${instagramUserId}/media?${params.toString()}`;

  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) {
    throw new Error(`Instagram API HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload?.error?.message) {
    throw new Error(payload.error.message);
  }

  const posts = (payload?.data ?? [])
    .map((media) => {
      const src = pickImageUrl(media);
      if (!src || !media?.permalink) return null;

      return {
        src,
        href: media.permalink,
        alt: toAltText(media.caption),
        dateLabel: formatDateLabel(media.timestamp)
      };
    })
    .filter(Boolean)
    .slice(0, limit);

  if (posts.length === 0) {
    throw new Error("Instagram API gorsel donmedi. Hesapta gecerli post oldugundan emin olun.");
  }

  const output = {
    source: "synced",
    generatedAt: new Date().toISOString(),
    posts
  };

  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Instagram feed guncellendi: ${posts.length} post yazildi -> ${OUTPUT_FILE}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Bilinmeyen hata";
  console.error(`sync-instagram basarisiz: ${message}`);
  process.exit(1);
});
