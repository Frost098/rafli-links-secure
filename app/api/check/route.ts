import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.CISYPI_SECRET || "cisypi-super-secret-change-me-2026");
const MASTER_KEY = process.env.CISYPI_MASTER || "cisypi-owner-2026";
const CISYPI_URL = "https://cisypistream-mktfzcae.manus.space/";

const bannedIPs = new Set<string>();

function getIP(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         req.headers.get("x-real-ip") ||
         "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    if (bannedIPs.has(ip)) {
      return NextResponse.json({
        valid: false,
        status: "banned",
        message: "IP kamu telah diblokir oleh owner.",
      });
    }

    const { key } = await req.json();
    if (!key || typeof key !== "string") {
      return NextResponse.json({ valid: false, status: "invalid", message: "Key kosong." });
    }

    if (key === MASTER_KEY) {
      return NextResponse.json({
        valid: true,
        status: "master",
        message: "✅ Master key valid. Mengalihkan...",
        redirect: CISYPI_URL,
      });
    }

    try {
      const { payload } = await jwtVerify(key, SECRET);
      const exp = payload.exp as number;
      const now = Math.floor(Date.now() / 1000);

      if (exp < now) {
        return NextResponse.json({
          valid: false,
          status: "expired",
          message: "⏰ Key ini sudah kadaluarsa. Ajukan permintaan baru.",
        });
      }

      const leftMin = Math.round((exp - now) / 60);
      return NextResponse.json({
        valid: true,
        status: "temp",
        message: `✅ Temporary key valid (sisa ~${leftMin} menit). Mengalihkan...`,
        redirect: CISYPI_URL,
        name: payload.name,
      });
    } catch {
      return NextResponse.json({
        valid: false,
        status: "invalid",
        message: "❌ Key tidak valid / tidak ditemukan.",
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ valid: false, message: "Server error." }, { status: 500 });
  }
}
