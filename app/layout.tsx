import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rafli's Links — Secure",
  description: "Semua project penting di satu tempat dengan proteksi CisyPi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
