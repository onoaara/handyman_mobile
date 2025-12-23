import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://djefjkrtlslsuoizgyjv.supabase.co";
const supabaseAnonKeyRaw = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseAnonKey = supabaseAnonKeyRaw.trim()
  ? supabaseAnonKeyRaw.trim()
  : "__MISSING_SUPABASE_ANON_KEY__";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseConfigOk =
  supabaseAnonKey !== "__MISSING_SUPABASE_ANON_KEY__";
