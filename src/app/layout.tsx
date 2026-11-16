import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "@fontsource-variable/geist";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Vipekit", template: "%s | Vipekit" },
  description: "Koleksi tools, inspirasi, dan bacaan untuk proyek berikutnya.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-theme="dark">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
