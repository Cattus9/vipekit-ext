"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/collection", label: "Collection" },
  { href: "/showcase", label: "Showcase" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex min-h-site-header flex-wrap items-center gap-x-3 px-3 sm:gap-x-8 sm:px-6">
        <Link href="/" className="inline-flex shrink-0 items-center gap-2 rounded-sm font-display text-lg font-medium tracking-tight">
          <Image src="/images/falcon.png" alt="" width={32} height={32} className="size-8 object-contain" />
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
