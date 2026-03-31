import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amada Crochet",
  description: "Creaciones artesanales en crochet premium.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
