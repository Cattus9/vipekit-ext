"use client";

import {
  ArrowUpRight, BookOpen, LayoutGrid, Layers3, Library, List,
  PanelsTopLeft, Search, Sparkles, Star, Type,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collectionCategories, collectionLinks, type CollectionLink } from "@/lib/collection";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "Semua tautan", icon: Library },
  { id: "featured", label: "Pilihan kurator", icon: Star },
  { id: "design", label: collectionCategories.design, icon: PanelsTopLeft },
  { id: "components", label: collectionCategories.components, icon: Layers3 },
  { id: "agents", label: collectionCategories.agents, icon: Sparkles },
  { id: "type", label: collectionCategories.type, icon: Type },
  { id: "learning", label: collectionCategories.learning, icon: BookOpen },
] as const;

function inCategory(link: CollectionLink, category: string) {
  return category === "all" || (category === "featured" ? link.featured : link.category === category);
}

const categoriesWithCounts = categories.map((category) => ({
  ...category,
  count: collectionLinks.filter((link) => inCategory(link, category.id)).length,
}));
const categoryGroups = [categoriesWithCounts.slice(0, 2), categoriesWithCounts.slice(2)];

function domainOf(href: string) {
  return new URL(href).hostname.replace(/^www\./, "");
}

export function CollectionBrowser() {
  const params = useSearchParams();
  const activeCategory = categories.find(({ id }) => id === params.get("category")) ?? categories[0];
  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const view = params.get("view") === "list" ? "list" : "grid";
  const matchingCategory = collectionLinks.filter((link) => inCategory(link, activeCategory.id));
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = matchingCategory.filter((link) => {
    const searchable = `${link.name} ${domainOf(link.href)} ${collectionCategories[link.category]} ${link.description}`.toLowerCase();
    return terms.every((term) => searchable.includes(term));
  });

  useEffect(() => {
    // Next can render an older URL snapshot while the user is still typing.
    if (urlQuery === (new URLSearchParams(window.location.search).get("q") ?? "")) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  function updateFilters(values: Partial<Record<"category" | "q" | "view", string>>) {
    if (values.q !== undefined) setQuery(values.q);
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", url);
  }

  return (
    <main className="collection-shell grid w-full">
      <aside className="min-w-0 border-b bg-sidebar text-sidebar-foreground lg:border-r lg:border-b-0" aria-label="Filter Collection">
        <div className="lg:sticky lg:top-site-header lg:px-3 lg:py-6">
          <div className="hidden px-1 pb-4 lg:block">
            <CollectionSearch label="Cari dari sidebar" value={query} onChange={(q) => updateFilters({ q })} />
          </div>
          <div className="flex min-w-0 gap-1 overflow-x-auto p-4 lg:grid lg:gap-6 lg:overflow-visible lg:p-1">
            {categoryGroups.map((group, groupIndex) => (
              <div key={group[0].id} role="group" aria-label={groupIndex === 0 ? "Filter utama" : "Kategori tautan"} className="flex gap-1 lg:grid">
                {groupIndex === 1 && <p aria-hidden="true" className="hidden px-3 pb-2 text-xs text-muted-foreground lg:block">Kategori</p>}
                {group.map(({ id, label, icon: Icon, count }) => (
                  <Button
                    key={id}
                    type="button"
                    variant="ghost"
                    aria-pressed={activeCategory.id === id}
                    className="min-h-10 justify-start gap-2 px-3 text-nav text-muted-foreground active:bg-secondary aria-pressed:bg-sidebar-accent aria-pressed:text-sidebar-accent-foreground"
                    onClick={() => updateFilters({ category: id === "all" ? "" : id })}
                  >
                    <Icon aria-hidden="true" />
                    {label}
                    <span className="ml-auto pl-1 text-xs text-muted-foreground tabular-nums">{count}</span>
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="min-w-0 px-4 pb-16 lg:px-8" aria-labelledby="collection-title">
        <header className="collection-heading grid gap-3 pt-8 pb-6 sm:pt-10 sm:pb-8">
          <h1 id="collection-title" className="text-section font-normal">{activeCategory.label}</h1>
          <p className="text-muted-foreground">Tools, inspirasi, dan bacaan untuk proyek berikutnya.</p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3" role="search" aria-label="Cari di Collection">
          <div className="min-w-0 flex-1 basis-60 sm:max-w-lg">
            <CollectionSearch label="Cari tautan" value={query} onChange={(q) => updateFilters({ q })} />
          </div>
          <div role="group" aria-label="Tampilan tautan" className="flex gap-1 rounded-lg border p-1">
            <Button type="button" size="icon" variant="ghost" aria-label="Tampilan grid" aria-pressed={view === "grid"} onClick={() => updateFilters({ view: "" })} className="active:bg-secondary aria-pressed:bg-accent">
              <LayoutGrid aria-hidden="true" />
            </Button>
            <Button type="button" size="icon" variant="ghost" aria-label="Tampilan daftar" aria-pressed={view === "list"} onClick={() => updateFilters({ view: "list" })} className="active:bg-secondary aria-pressed:bg-accent">
              <List aria-hidden="true" />
            </Button>
          </div>
        </div>

        <p role="status" className="py-4 text-sm text-muted-foreground tabular-nums">
          {results.length} dari {matchingCategory.length} tautan
        </p>

        {results.length ? (
          <ul data-view={view} className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6" : "grid gap-2"}>
            {results.map((link) => <CollectionItem key={link.href} link={link} view={view} />)}
          </ul>
        ) : (
          <div className="grid justify-items-start gap-3 rounded-lg border bg-card p-6 text-card-foreground">
            <p>Tidak ada tautan yang cocok.</p>
            <Button type="button" variant="outline" onClick={() => updateFilters({ q: "", category: "" })}>Reset filter</Button>
          </div>
        )}
      </section>
    </main>
  );
}

function CollectionSearch({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input type="search" aria-label={label} placeholder="Cari tautan…" value={value} className="h-11 bg-card pl-9" onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function CollectionItem({ link, view }: { link: CollectionLink; view: "grid" | "list" }) {
  const isGrid = view === "grid";

  return (
    <li className="min-w-0">
      <a href={link.href} className="group flex h-full flex-col rounded-lg border bg-card text-card-foreground hover:border-ring active:border-ring">
        {isGrid && (
          <div aria-hidden="true" data-category={link.category} className="collection-cover isolate flex aspect-video items-end rounded-t-lg p-4 sm:p-5">
            <span className="relative font-display text-section font-normal">{link.mark}</span>
          </div>
        )}
        <div className={cn("grid flex-1 grid-cols-collection-item items-start gap-x-4 gap-y-2 p-4", isGrid ? "sm:p-5" : "md:grid-cols-collection-row md:items-center")}>
          <div className="grid min-w-0 gap-1">
            <h2 className="font-display text-lg font-medium tracking-tight">{link.name}</h2>
            <p className="break-all text-xs text-muted-foreground">{domainOf(link.href)}</p>
          </div>
          <ArrowUpRight aria-hidden="true" className={cn("mt-1 size-4 text-muted-foreground group-hover:text-foreground", !isGrid && "md:order-last md:mt-0")} />
          <p className={cn("col-span-full text-sm leading-relaxed text-muted-foreground", !isGrid && "md:col-span-1")}>{link.description}</p>
          <p className={cn("col-span-full text-xs text-muted-foreground", !isGrid && "md:col-span-1")}>{collectionCategories[link.category]}</p>
        </div>
      </a>
    </li>
  );
}
