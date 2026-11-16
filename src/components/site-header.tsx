"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/collection", label: "Collection" },
  { href: "/showcase", label: "Showcase" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const isCollection = pathname === "/collection";

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className={cn("flex min-h-site-header flex-wrap items-center gap-x-3 px-3 sm:gap-x-8 sm:px-6", isCollection ? "lg:px-0" : "mx-auto max-w-site")}>
        <Link href="/" className={cn("shrink-0 rounded-sm font-display text-lg font-medium tracking-tight", isCollection && "collection-header-brand lg:flex lg:min-h-site-header lg:items-center lg:rounded-none lg:border-r lg:px-7 lg:focus-visible:-outline-offset-2")}>
          Vipekit
        </Link>
        <nav aria-label="Navigasi utama" className="flex min-w-0 items-center gap-1">
          {navigation.map(({ href, label }) => {
            const isCurrent = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isCurrent ? "page" : undefined}
                className="inline-flex min-h-9 items-center rounded-md px-1.5 text-nav font-normal tracking-ui text-muted-foreground hover:bg-accent hover:text-accent-foreground aria-[current=page]:text-foreground sm:px-3"
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
