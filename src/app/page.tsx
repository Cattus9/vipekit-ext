import { ArrowRight, ArrowUpRight, CodeXml, Layers3, PanelsTopLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { HeroLandscape } from "@/components/hero-landscape";
import { Button } from "@/components/ui/button";

const resources = [
  { name: "CUI", category: "Inspirasi UI", domain: "yappologistic.github.io", href: "https://yappologistic.github.io/CUI/", icon: PanelsTopLeft },
  { name: "Arc UI", category: "Komponen UI", domain: "uiarc.dev", href: "https://uiarc.dev/", icon: Layers3 },
  { name: "shadcn/ui", category: "Development", domain: "ui.shadcn.com", href: "https://ui.shadcn.com/", icon: CodeXml },
  { name: "Hallmark", category: "Skill untuk agent", domain: "github.com", href: "https://github.com/Nutlope/hallmark", icon: Sparkles },
] as const;

export default function HomePage() {
  return (
    <>
      <main>
        <section className="landing-hero relative isolate grid place-items-center px-4 py-20 text-center sm:px-6" aria-labelledby="home-heading">
          <div className="relative z-10 flex max-w-hero-copy flex-col items-center gap-6">
            <h1 id="home-heading" className="text-hero font-normal">Temuan untuk proyek berikutnya</h1>
            <p className="max-w-hero-lead text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Koleksi tools, komponen, dan inspirasi dari berbagai sudut internet.
            </p>
            <Button asChild size="lg" className="min-h-11 px-4">
              <Link href="/collection">
                Jelajahi Collection <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <HeroLandscape />
        </section>

        <section className="mx-auto max-w-landing px-4 pb-20 sm:px-6 sm:pb-28" aria-labelledby="featured-heading">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b pb-6">
            <div className="grid gap-2">
              <h2 id="featured-heading" className="text-section font-normal">Pilihan tautan</h2>
              <p className="text-sm text-muted-foreground sm:text-base">Referensi yang ikut membentuk Vipekit.</p>
            </div>
            <Button asChild variant="ghost" className="px-3">
              <Link href="/collection">Lihat Collection <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
            {resources.map((resource) => <ResourceRow key={resource.name} resource={resource} />)}
          </ul>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-landing flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <Link href="/" className="rounded-sm font-display text-lg font-medium tracking-tight">Vipekit</Link>
        </div>
      </footer>
    </>
  );
}

function ResourceRow({ resource }: { resource: (typeof resources)[number] }) {
  const Icon = resource.icon;

  return (
    <li className="border-b">
      <a href={resource.href} className="group flex min-h-20 items-center gap-3 rounded-sm px-2 hover:bg-accent hover:text-accent-foreground sm:gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="grid min-w-0 flex-1 gap-1">
          <span className="font-medium">{resource.name}</span>
          <span className="text-xs text-muted-foreground">{resource.category}</span>
        </span>
        <span className="hidden text-xs text-muted-foreground lg:block">{resource.domain}</span>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
      </a>
    </li>
  );
}
