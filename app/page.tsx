"use client";

import { useState } from "react";

const LINKS = {
  main: [
    { title: "CisyPi Stream", desc: "Streaming motion graphics · Protected", icon: "🎬", color: "#7c3aed", protected: true },
    { title: "CTF Nusantara 2026", desc: "Cybersecurity competition platform", icon: "🏴", color: "#2563eb", href: "https://ctf-nusantara-2026.vercel.app/" },
    { title: "IQ Battle Arena", desc: "Solo & multiplayer IQ test battle", icon: "🧠", color: "#ea580c", href: "https://iq-battle-arena.vercel.app/" },
    { title: "CodeVault / TTScript", desc: "Share scripts & code snippets", icon: "💻", color: "#0d9488", href: "https://my-site-27czz42y-raflipratama020513.wix-vibe-site.com/" },
  ],
  ai: [
    { title: "Astra Companion", desc: "Smart character interface · Vestia Zeta", icon: "💬", color: "#db2777", href: "https://astra-companion-kappa.vercel.app/" },
    { title: "Moonlight Chess", desc: "Chess arena · Bot / 2P / Online", icon: "♟️", color: "#ca8a04", href: "https://chess-vert-pi.vercel.app/" },
    { title: "Ultron AI v4", desc: "Tactical intelligence interface", icon: "🤖", color: "#dc2626", href: "https://ultronai-v4.vercel.app/" },
    { title: "RolxDesk", desc: "Multi-model AI desk · RD Hosted", icon: "🖥️", color: "#16a34a", href: "https://rolxdesk.vercel.app/" },
  ],
};

export default function Home() {
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState<"key" | "request">("key");
  const [keyInput, setKeyInput] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<{ type: string; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkKey() {
    if (!keyInput.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyInput.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setStatus({ type: "valid", msg: data.message || "Key valid. Mengalihkan..." });
        setTimeout(() => {
          window.location.href = data.redirect || "https://cisypistream-mktfzcae.manus.space/";
        }, 800);
      } else {
        setStatus({ type: data.status || "invalid", msg: data.message || "Key tidak valid." });
      }
    } catch {
      setStatus({ type: "error", msg: "Gagal cek key. Coba lagi." });
    }
    setLoading(false);
  }

  async function submitRequest() {
    if (!name.trim() || !reason.trim()) {
      setStatus({ type: "error", msg: "Nama dan alasan wajib diisi." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), reason: reason.trim() }),
      });
      const data = await res.json();
      setStatus({ type: data.approved ? "valid" : "info", msg: data.message });
      if (data.key) {
        setKeyInput(data.key);
        setTab("key");
      }
    } catch {
      setStatus({ type: "error", msg: "Gagal mengirim permintaan." });
    }
    setLoading(false);
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.avatar}>🚀</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 6 }}>Rafli's Links</h1>
          <p style={{ fontSize: "0.9rem", color: "#a1a1aa" }}>Semua project penting di satu tempat</p>
        </div>

        <div style={styles.sectionTitle}>Main Projects</div>
        <div style={styles.links}>
          {LINKS.main.map((l) =>
            l.protected ? (
              <div key={l.title} style={styles.card} onClick={() => { setModal(true); setStatus(null); }}>
                <div style={{ ...styles.icon, background: l.color }}>{l.icon}</div>
                <div style={styles.info}>
                  <h3 style={styles.title}>{l.title}</h3>
                  <p style={styles.desc}>{l.desc}</p>
                </div>
                <div style={styles.arrow}>🔒</div>
              </div>
            ) : (
              <a key={l.title} href={l.href} target="_blank" rel="noopener" style={styles.card}>
                <div style={{ ...styles.icon, background: l.color }}>{l.icon}</div>
                <div style={styles.info}>
                  <h3 style={styles.title}>{l.title}</h3>
                  <p style={styles.desc}>{l.desc}</p>
                </div>
                <div style={styles.arrow}>→</div>
              </a>
            )
          )}
        </div>

        <div style={styles.sectionTitle}>AI & Experiments</div>
        <div style={styles.links}>
          {LINKS.ai.map((l) => (
            <a key={l.title} href={l.href} target="_blank" rel="noopener" style={styles.card}>
              <div style={{ ...styles.icon, background: l.color }}>{l.icon}</div>
              <div style={styles.info}>
                <h3 style={styles.title}>{l.title}</h3>
                <p style={styles.desc}>{l.desc}</p>
              </div>
              <div style={styles.arrow}>→</div>
            </a>
          ))}
        </div>

        <div style={styles.footer}>Made with ☕ · CisyPi Server-side Access · Vercel</div>
      </div>

      {modal && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div style={styles.modal}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: 6 }}>🔒 CisyPi Stream</h2>
            <p style={{ fontSize: "0.85rem", color: "#a1a1aa", marginBottom: 16 }}>Akses private. Masukkan key atau ajukan permintaan.</p>

            <div style={styles.tabs}>
              <div style={{ ...styles.tab, ...(tab === "key" ? styles.tabActive : {}) }} onClick={() => setTab("key")}>Punya Key</div>
              <div style={{ ...styles.tab, ...(tab === "request" ? styles.tabActive : {}) }} onClick={() => setTab("request")}>Ajukan Akses</div>
            </div>

            {tab === "key" ? (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Access Key</label>
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkKey()}
                    placeholder="Paste temporary key atau master key"
                    style={styles.input}
                  />
                </div>
                {status && (
                  <div style={{
                    ...styles.status,
                    borderLeftColor: status.type === "valid" ? "#4ade80" : status.type === "expired" || status.type === "banned" ? "#f87171" : "#a1a1aa"
                  }}>
                    {status.msg}
                  </div>
                )}
                <div style={styles.btns}>
                  <button style={styles.btnCancel} onClick={() => setModal(false)}>Batal</button>
                  <button style={styles.btnPrimary} onClick={checkKey} disabled={loading}>
                    {loading ? "Cek..." : "Buka Akses"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama / Identitas</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu..." style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Alasan butuh akses</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Contoh: pls gw mau nonton doang, kasih akses dong"
                    style={{ ...styles.input, minHeight: 80, resize: "vertical" as const }}
                  />
                </div>
                {status && (
                  <div style={{
                    ...styles.status,
                    borderLeftColor: status.type === "valid" ? "#4ade80" : "#60a5fa"
                  }}>
                    {status.msg}
                  </div>
                )}
                <div style={styles.btns}>
                  <button style={styles.btnCancel} onClick={() => setModal(false)}>Batal</button>
                  <button style={styles.btnSecondary} onClick={submitRequest} disabled={loading}>
                    {loading ? "Mengirim..." : "Ajukan Permintaan"}
                  </button>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#71717a", marginTop: 12, lineHeight: 1.4 }}>
                  Server-side AI menilai permintaan. Kalau disetujui, temporary key (JWT) digenerate (2 jam). Owner bisa ban IP/nama via /api/ban.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    background: "linear-gradient(135deg, #0f0f13 0%, #1a1a24 50%, #0d0d12 100%)",
    minHeight: "100vh",
    color: "#e5e5e5",
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px",
  },
  container: { width: "100%", maxWidth: 480 },
  header: { textAlign: "center", marginBottom: 36 },
  avatar: {
    width: 88, height: 88, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
    margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 36, boxShadow: "0 8px 32px rgba(99, 102, 241, 0.35)",
  },
  sectionTitle: { fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717a", margin: "24px 0 12px 4px" },
  links: { display: "flex", flexDirection: "column", gap: 14 },
  card: {
    display: "flex", alignItems: "center", gap: 16,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: "12px 16px 12px 12px", textDecoration: "none", color: "inherit",
    cursor: "pointer", transition: "all 0.22s ease",
  },
  icon: { width: 52, height: 52, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: "1rem", fontWeight: 600, marginBottom: 2 },
  desc: { fontSize: "0.8rem", color: "#a1a1aa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  arrow: { color: "#71717a", fontSize: 18 },
  footer: { textAlign: "center", marginTop: 40, fontSize: "0.8rem", color: "#52525b" },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 100,
  },
  modal: {
    background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
    padding: 24, width: "100%", maxWidth: 400, maxHeight: "90vh", overflowY: "auto",
  },
  tabs: { display: "flex", gap: 8, marginBottom: 16 },
  tab: { flex: 1, textAlign: "center", padding: 8, borderRadius: 8, background: "#27272a", fontSize: "0.85rem", cursor: "pointer" },
  tabActive: { background: "#7c3aed" },
  formGroup: { marginBottom: 14 },
  label: { display: "block", fontSize: "0.8rem", color: "#a1a1aa", marginBottom: 6 },
  input: {
    width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)",
    background: "#27272a", color: "#fff", fontSize: "0.95rem", outline: "none", fontFamily: "inherit",
  },
  status: { background: "#27272a", borderRadius: 10, padding: 12, marginTop: 12, fontSize: "0.85rem", borderLeft: "3px solid", lineHeight: 1.4 },
  btns: { display: "flex", gap: 10, marginTop: 12 },
  btnCancel: { flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#3f3f46", color: "#e5e5e5", fontWeight: 600, cursor: "pointer" },
  btnPrimary: { flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#7c3aed", color: "#fff", fontWeight: 600, cursor: "pointer" },
  btnSecondary: { flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer" },
};
