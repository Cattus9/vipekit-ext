import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export function createClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase URL and publishable key are required.");

  return createBrowserClient(config.url, config.publishableKey);
}
