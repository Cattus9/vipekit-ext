import type { Metadata } from "next";

export const metadata: Metadata = { title: "Showcase" };

export default function ShowcasePage() {
  return (
    <main className="mx-auto grid max-w-site gap-3 px-4 py-12 sm:px-6">
      <h1 className="text-section font-normal">Showcase</h1>
      <p className="text-muted-foreground">Hasil eksperimen Vipekit segera hadir.</p>
    </main>
  );
}
