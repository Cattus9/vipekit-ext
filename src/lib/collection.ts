export const collectionCategories = {
  design: "Inspirasi desain",
  components: "Komponen UI",
  agents: "AI & agent",
  type: "Tipografi",
  learning: "Bacaan & belajar",
} as const;

export type CollectionCategory = keyof typeof collectionCategories;

export type CollectionLink = {
  name: string;
  mark: string;
  href: string;
  category: CollectionCategory;
  description: string;
  featured?: boolean;
};

export const collectionLinks: readonly CollectionLink[] = [
  { name: "CUI", mark: "C", href: "https://yappologistic.github.io/CUI/", category: "design", description: "Komponen native untuk C dan inspirasi hero Canvas Vipekit.", featured: true },
  { name: "Arc UI", mark: "Arc", href: "https://uiarc.dev/", category: "components", description: "Komponen React dan blok antarmuka dengan animasi.", featured: true },
  { name: "shadcn/ui", mark: "shadcn/ui", href: "https://ui.shadcn.com/", category: "components", description: "Komponen React dengan source code yang bisa disesuaikan.", featured: true },
  { name: "Hallmark", mark: "H", href: "https://github.com/Nutlope/hallmark", category: "agents", description: "Skill desain dan audit antarmuka untuk coding agent.", featured: true },
  { name: "Awwwards", mark: "W.", href: "https://www.awwwards.com/", category: "design", description: "Galeri desain web, layout, dan interaksi." },
  { name: "Cursor", mark: "Cursor", href: "https://cursor.com/", category: "agents", description: "Editor kode dengan coding agent terintegrasi." },
  { name: "Geist", mark: "Aa", href: "https://vercel.com/font", category: "type", description: "Keluarga font sans dan monospace dari Vercel." },
  { name: "MDN Web Docs", mark: "MDN", href: "https://developer.mozilla.org/", category: "learning", description: "Referensi HTML, CSS, JavaScript, dan API web." },
];
