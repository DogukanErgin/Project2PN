import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  getDefaultWifiConfig,
  normalizeWifiPassword,
  normalizeWifiSsid
} from "@/src/content/wifi";

type StoredWifiConfig = {
  ssid: string;
  password: string;
  updatedAt: string;
};

export type WifiConfig = {
  ssid: string;
  password: string;
  updatedAt: string | null;
};

const WIFI_CONFIG_PATH = join(process.cwd(), "data", "wifi-config.json");

function sanitizeWifiConfig(value: { ssid: string; password: string }): { ssid: string; password: string } {
  return {
    ssid: normalizeWifiSsid(value.ssid).slice(0, 64),
    password: normalizeWifiPassword(value.password).slice(0, 128)
  };
}

function normalizeUpdatedAt(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return Number.isNaN(new Date(value).getTime()) ? null : value;
}

async function readStoredWifiConfig(): Promise<WifiConfig | null> {
  try {
    const raw = await readFile(WIFI_CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoredWifiConfig>;

    if (typeof parsed.ssid !== "string" || typeof parsed.password !== "string") {
      return null;
    }

    const normalized = sanitizeWifiConfig({ ssid: parsed.ssid, password: parsed.password });
    return {
      ...normalized,
      updatedAt: normalizeUpdatedAt(parsed.updatedAt)
    };
  } catch {
    return null;
  }
}

export async function readWifiConfig(): Promise<WifiConfig> {
  const stored = await readStoredWifiConfig();
  if (stored) {
    return stored;
  }

  const defaults = getDefaultWifiConfig();
  return {
    ...defaults,
    updatedAt: null
  };
}

export async function writeWifiConfig(value: { ssid: string; password: string }): Promise<WifiConfig> {
  const normalized = sanitizeWifiConfig(value);
  const data: StoredWifiConfig = {
    ...normalized,
    updatedAt: new Date().toISOString()
  };

  await mkdir(dirname(WIFI_CONFIG_PATH), { recursive: true });
  await writeFile(WIFI_CONFIG_PATH, JSON.stringify(data, null, 2), "utf8");

  return {
    ...data,
    updatedAt: data.updatedAt
  };
}
