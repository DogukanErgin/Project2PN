import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { readWifiConfig, writeWifiConfig } from "@/src/lib/wifi-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UpdatePayload = {
  adminPassword?: string;
  password?: string;
};

function getAdminPassword() {
  return process.env.WIFI_ADMIN_PASSWORD?.trim() ?? "";
}

function isAuthorized(input: string | undefined, expected: string): boolean {
  if (!input) return false;
  const normalized = input.trim();
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(normalized);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

function configMissingResponse() {
  return NextResponse.json(
    { error: "WIFI_ADMIN_PASSWORD is not configured on the server." },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}

export async function GET(request: Request) {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return configMissingResponse();
  }

  const incomingPassword = request.headers.get("x-admin-password") ?? undefined;
  if (!isAuthorized(incomingPassword, adminPassword)) {
    return unauthorizedResponse();
  }

  const config = await readWifiConfig();

  return NextResponse.json(
    {
      ssid: config.ssid,
      password: config.password,
      updatedAt: config.updatedAt
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request: Request) {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return configMissingResponse();
  }

  let payload: UpdatePayload;
  try {
    payload = (await request.json()) as UpdatePayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!isAuthorized(payload.adminPassword, adminPassword)) {
    return unauthorizedResponse();
  }

  if (typeof payload.password !== "string") {
    return NextResponse.json(
      { error: "Password is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const currentConfig = await readWifiConfig();
  const updated = await writeWifiConfig({
    ssid: currentConfig.ssid,
    password: payload.password
  });

  return NextResponse.json(
    {
      ssid: updated.ssid,
      password: updated.password,
      updatedAt: updated.updatedAt
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
