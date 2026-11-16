import type { Metadata } from "next";
import { CollectionBrowser } from "@/components/collection-browser";

export const metadata: Metadata = { title: "Collection" };

export default async function CollectionPage({ searchParams }: PageProps<"/collection">) {
  await searchParams;
  return <CollectionBrowser />;
}
