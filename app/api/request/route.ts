import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.CISYPI_SECRET || "cisypi-super-secret-change-me-2026");
const MASTER_KEY = process.env.CISYPI_MASTER || "cisypi-owner-2026";
const CISYPI_URL = "https://cisypistream-mktfzcae.manus.space/";

const bannedIPs = new Set<string>();
const bannedNames = new Set<string>();

function getIP(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         req.headers.get("x-real-ip") ||
         "unknown";
}

function aiValidate(name: string, reason: string) {
  const r = reason.toLowerCase().trim();
  const n = name.toLowerCase().trim();

  if (n.length < 2) return { ok: false, msg: "Nama terlalu pendek." };
  if (r.length < 5) return { ok: false, msg: "Alasan terlalu singkat." };

  if (bannedNames.has(n)) {
    return { ok: false, msg: "Akses untuk identitas ini telah diblokir oleh owner." };
  }

  const bad = ["hack", "crack", "steal", "jual", "spam", "ddos", "scam", "phish"];
  if (bad.some(w => r.includes(w))) {
    return { ok: false, msg: "Permintaan ditolak (terdeteksi niat buruk)." };
  }

  const casualOk = [
    "nonton", "tonton", "liat", "lihat", "stream", "streaming",
    "coba", "test", "demo", "belajar", "pelajar", "review",
    "pls", "please", "tolong", "kasih", "minta", "mau", "pengen",
    "doang", "aja", "saja", "cuma", "hanya", "sekadar"
  ];

  const hasCasual = casualOk.some(w => r.includes(w));
  const longEnough = r.length >= 12;

  if (hasCasual || longEnough) {
    return { ok: true, msg: "Local AI menyetujui permintaan." };
  }

  return { ok: false, msg: "Alasan kurang jelas. Coba jelaskan lebih natural (contoh: mau nonton / coba stream)." };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);

    if (bannedIPs.has(ip)) {
      return NextResponse.json({
        approved: false,
        message: "IP kamu telah diblokir. Hubungi owner jika ini kesalahan.",
      }, { status: 403 });
    }

    const body = await req.json();
    const name = (body.name || "").trim();
    const reason = (body.reason || "").trim();

    const ai = aiValidate(name, reason);

    if (!ai.ok) {
      console.log(`[CisyPi REQUEST REJECTED] IP=${ip} Name=${name} Reason=${reason} | ${ai.msg}`);
      return NextResponse.json({
        approved: false,
        message: ai.msg + " Permintaan tetap dicatat untuk review owner.",
      });
    }

    const expires = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
    const key = await new SignJWT({
      name,
      reason: reason.slice(0, 100),
      ip,
      type: "temp",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expires)
      .setIssuedAt()
      .sign(SECRET);

    console.log(`[CisyPi APPROVED] IP=${ip} Name=${name} Reason=${reason}`);

    return NextResponse.json({
      approved: true,
      key,
      message: `✅ Disetujui! Temporary key berlaku 2 jam. Salin key di bawah lalu paste di tab Punya Key.`,
      expiresIn: "2 jam",
      redirect: CISYPI_URL,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ approved: false, message: "Server error." }, { status: 500 });
  }
}
