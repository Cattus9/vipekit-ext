import type { Metadata } from "next";

export const metadata: Metadata = { title: "Docs" };

export default function DocsPage() {
  return (
    <main className="mx-auto grid max-w-site gap-3 px-4 py-12 sm:px-6">
      <h1 className="text-section font-normal">Docs</h1>
      <p className="text-muted-foreground">Skills dan prompt untuk coding agent segera hadir.</p>
    </main>
  );
}
