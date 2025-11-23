// frontend/src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Load from Vite environment
const url = import.meta.env?.VITE_SUPABASE_URL;
const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase config missing. Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to frontend/.env"
  );
}

export const supabase = isSupabaseConfigured ? createClient(url, key) : null;

// Helper: get JWT access token
export async function getAccessToken() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}
