import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "src", "content", "menu.generated.json");
const DEFAULT_SOURCE_URL = "https://peanuts.dinosoft.com.tr/menu";
const MAX_PAGES = 1200;

function parseDotEnv(contents) {
  const result = {};
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
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

function decodeHtmlEntities(input) {
  const named = {
    amp: "&",
    quot: '"',
    apos: "'",
    lt: "<",
    gt: ">",
    nbsp: " ",
    Uuml: "U",
    uuml: "u",
    Ouml: "O",
    ouml: "o",
    Ccedil: "C",
    ccedil: "c",
    Scedil: "S",
    scedil: "s",
    Iuml: "I",
    iuml: "i",
    "#x130": "I",
    "#304": "I",
    "#x131": "i",
    "#305": "i"
  };

  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&([a-zA-Z#0-9]+);/g, (match, entity) => named[entity] ?? match);
}

function stripTags(input) {
  return decodeHtmlEntities(input)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugToLabel(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function toAbsoluteUrl(base, href) {
  return new URL(href, base).toString();
}

function normalizeMenuPath(pathName) {
  if (!pathName) return "";
  let normalized = pathName.trim();

  try {
    if (/^https?:\/\//i.test(normalized)) {
      normalized = new URL(normalized).pathname;
    }
  } catch {
    return "";
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized.replace(/\/+$/, "") || "/";
}

function extractMenuLinks(html) {
  const links = [];
  const regex = /href="(\/menu\/[^"#?]+)"/g;
  let match;
  while ((match = regex.exec(html))) {
    const normalized = normalizeMenuPath(match[1]);
    if (normalized) {
      links.push(normalized);
    }
  }
  return [...new Set(links)];
}

function extractCategoryTiles(html) {
  const entries = [];
  const itemRegex = /<li>[\s\S]*?<\/li>/g;
  let match;
  while ((match = itemRegex.exec(html))) {
    const block = match[0];
    if (!/class="[^"]*categore-box[^"]*"/i.test(block)) continue;

    const href = block.match(/<a[^>]+href="(\/menu\/[^"]+)"/i)?.[1];
    const title = block.match(/<h5[^>]*>([\s\S]*?)<\/h5>/i)?.[1];
    if (!href || !title) continue;

    const pathName = normalizeMenuPath(href);
    if (!pathName.startsWith("/menu/")) continue;

    let image = decodeHtmlEntities(
      (block.match(/background-image:\s*url\(([^)]+)\)/i)?.[1] ?? "")
        .trim()
        .replace(/^['"]|['"]$/g, "")
    );
    if (image.startsWith("//")) {
      image = `https:${image}`;
    }

    entries.push({
      path: pathName,
      label: stripTags(title),
      image
    });
  }
  return entries;
}

function extractFirst(regex, html) {
  const match = html.match(regex);
  return match ? stripTags(match[1]) : "";
}

function normalizePrice(raw) {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return "";

  const numberMatch = text.match(/\d+(?:[.,]\d+)?/);
  if (!numberMatch) return text;

  const normalized = numberMatch[0].replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed)) return `${numberMatch[0]} TL`;

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2
  }).format(parsed);
}

function normalizeDescription(raw) {
  const value = raw.replace(/\s+/g, " ").trim();
  if (!value || /^adet$/i.test(value)) {
    return "";
  }

  return value.replace(/(^|\s)%(\d{1,3})(?=\s|$)/g, "$1$2%");
}

function parseProductFromHtml(html, pathName, categoryMap, origin, topCategory) {
  const hasDetail = /<div class="company-detail">/.test(html) && /<div class="item-list-2">/.test(html);
  if (!hasDetail) return null;

  const name = extractFirst(/<div class="company-detail">[\s\S]*?<h4>([\s\S]*?)<\/h4>/, html);
  if (!name) return null;

  const description = normalizeDescription(
    extractFirst(/<div class="company-detail">[\s\S]*?<p>([\s\S]*?)<\/p>/, html)
  );
  const imageRelative =
    html.match(/<img\s+src="([^"]*\/images\/Stock\/[^"]+)"[^>]*alt="image"/)?.[1] ??
    html.match(/<img\s+src="([^"]+)"[^>]*alt="image"/)?.[1] ??
    "";
  const mainPriceRaw = extractFirst(/<div class="price">[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/, html);
  const detailPriceRaw = extractFirst(/<span[^>]*class="[^"]*detail-price[^"]*"[^>]*>([\s\S]*?)<\/span>/, html);
  const price = normalizePrice(mainPriceRaw || detailPriceRaw);

  const slugRoot = pathName.replace(/^\/menu\//, "").split("/")[0] || "menu";
  const category = categoryMap.get(slugRoot) || slugToLabel(slugRoot);

  return {
    name,
    category,
    topCategory: topCategory || category,
    price: price || "-",
    description,
    href: toAbsoluteUrl(origin, pathName),
    image: imageRelative ? toAbsoluteUrl(origin, imageRelative) : ""
  };
}

function detectCharset(response, buffer) {
  const contentType = response.headers.get("content-type") ?? "";
  const headerCharset = contentType.match(/charset=([^;]+)/i)?.[1]?.trim().toLowerCase();
  if (headerCharset) {
    if (headerCharset.includes("1254") || headerCharset.includes("8859-9")) {
      return "windows-1254";
    }
    return headerCharset;
  }

  const head = Buffer.from(buffer).toString("latin1", 0, 4096);
  const metaCharset = head.match(/<meta[^>]+charset=["']?([a-zA-Z0-9_-]+)["']?/i)?.[1]?.toLowerCase();
  if (metaCharset) {
    if (metaCharset.includes("1254") || metaCharset.includes("8859-9")) {
      return "windows-1254";
    }
    return metaCharset;
  }

  return "utf-8";
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"
    },
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const buffer = await response.arrayBuffer();
  const charset = detectCharset(response, buffer);
  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
}

async function main() {
  const envLocal = await loadEnvFile(path.join(ROOT, ".env.local"));
  const envFile = await loadEnvFile(path.join(ROOT, ".env"));
  const env = {
    ...envFile,
    ...envLocal,
    ...process.env
  };

  const sourceUrl = env.MENU_SOURCE_URL || DEFAULT_SOURCE_URL;
  const source = new URL(sourceUrl);
  const origin = `${source.protocol}//${source.host}`;
  const startPath = source.pathname || "/menu";

  const queue = [{ path: startPath, topCategory: null }];
  const visited = new Set();
  const discoveredTopCategoryByPath = new Map();
  const categoryNameBySlug = new Map();
  const topCategories = [];
  const topCategorySeen = new Set();
  const items = [];

  while (queue.length > 0) {
    const next = queue.shift();
    const currentPath = next?.path;
    if (!currentPath || visited.has(currentPath)) continue;
    const currentTopCategory =
      next?.topCategory ?? discoveredTopCategoryByPath.get(currentPath) ?? null;
    if (visited.size >= MAX_PAGES) break;
    visited.add(currentPath);

    const absolute = toAbsoluteUrl(origin, currentPath);
    let html;
    try {
      html = await fetchText(absolute);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown";
      console.warn(`skip ${currentPath}: ${message}`);
      continue;
    }

    const categoryTiles = extractCategoryTiles(html);
    for (const tile of categoryTiles) {
      const slugWithId = tile.path.replace(/^\/menu\//, "").split("/")[0];
      const slug = slugWithId.replace(/-\d+$/, "");
      if (slug && tile.label) {
        categoryNameBySlug.set(slug, tile.label);
      }
      if (slugWithId && tile.label) {
        categoryNameBySlug.set(slugWithId, tile.label);
      }
    }

    if (currentPath === startPath) {
      for (const tile of categoryTiles) {
        if (topCategorySeen.has(tile.path)) continue;
        topCategorySeen.add(tile.path);
        discoveredTopCategoryByPath.set(tile.path, tile.label);
        topCategories.push({
          name: tile.label,
          href: toAbsoluteUrl(origin, tile.path),
          image: tile.image ? toAbsoluteUrl(origin, tile.image) : ""
        });
      }
    }

    const product = parseProductFromHtml(
      html,
      currentPath,
      categoryNameBySlug,
      origin,
      currentTopCategory
    );
    if (product) {
      items.push(product);
    }

    const links = extractMenuLinks(html);
    for (const pathName of links) {
      if (visited.has(pathName)) continue;

      let nextTopCategory = currentTopCategory;
      if (currentPath === startPath) {
        const rootTile = categoryTiles.find((tile) => tile.path === pathName);
        if (rootTile?.label) {
          nextTopCategory = rootTile.label;
        }
      }

      const knownTopCategory = discoveredTopCategoryByPath.get(pathName);
      const resolvedTopCategory = knownTopCategory ?? nextTopCategory ?? null;
      if (resolvedTopCategory && !knownTopCategory) {
        discoveredTopCategoryByPath.set(pathName, resolvedTopCategory);
      }

      queue.push({ path: pathName, topCategory: resolvedTopCategory });
    }
  }

  const dedupedItemsMap = new Map();
  for (const item of items) {
    const existing = dedupedItemsMap.get(item.href);
    if (!existing || (!existing.topCategory && item.topCategory)) {
      dedupedItemsMap.set(item.href, item);
    }
  }

  const dedupedItems = Array.from(dedupedItemsMap.values()).sort((a, b) => {
    if (a.topCategory !== b.topCategory) {
      return a.topCategory.localeCompare(b.topCategory, "tr");
    }
    if (a.category !== b.category) return a.category.localeCompare(b.category, "tr");
    return a.name.localeCompare(b.name, "tr");
  });

  const output = {
    source: "synced",
    sourceUrl,
    generatedAt: new Date().toISOString(),
    totalPages: visited.size,
    totalItems: dedupedItems.length,
    topCategories,
    items: dedupedItems
  };

  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `menu sync complete: ${dedupedItems.length} items, ${visited.size} pages -> ${OUTPUT_FILE}`
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "unknown";
  console.error(`sync-menu failed: ${message}`);
  process.exit(1);
});
