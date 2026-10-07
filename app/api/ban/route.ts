import { NextRequest, NextResponse } from "next/server";

const MASTER_KEY = process.env.CISYPI_MASTER || "cisypi-owner-2026";

const bannedIPs = new Set<string>();
const bannedNames = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { master, action, ip, name } = body;

    if (master !== MASTER_KEY) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    if (action === "ban-ip" && ip) {
      bannedIPs.add(ip);
      console.log(`[BAN] IP ${ip} banned`);
      return NextResponse.json({ ok: true, message: `IP ${ip} berhasil di-ban.` });
    }

    if (action === "ban-name" && name) {
      bannedNames.add(name.toLowerCase().trim());
      console.log(`[BAN] Name ${name} banned`);
      return NextResponse.json({ ok: true, message: `Nama "${name}" berhasil di-ban.` });
    }

    if (action === "unban-ip" && ip) {
      bannedIPs.delete(ip);
      return NextResponse.json({ ok: true, message: `IP ${ip} di-unban.` });
    }

    if (action === "list") {
      return NextResponse.json({
        ok: true,
        bannedIPs: Array.from(bannedIPs),
        bannedNames: Array.from(bannedNames),
      });
    }

    return NextResponse.json({ ok: false, message: "Action tidak dikenali. Gunakan ban-ip / ban-name / unban-ip / list" });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Error" }, { status: 500 });
  }
}
