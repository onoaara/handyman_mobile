import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://djefjkrtlslsuoizgyjv.supabase.co";
const supabaseAnonKeyRaw = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseAnonKey = supabaseAnonKeyRaw.trim()
  ? supabaseAnonKeyRaw.trim()
  : "__MISSING_SUPABASE_ANON_KEY__";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth:
    Platform.OS === "web"
      ? {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        }
      : {
          storage: AsyncStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
});
export const supabaseConfigOk =
  supabaseAnonKey !== "__MISSING_SUPABASE_ANON_KEY__";
