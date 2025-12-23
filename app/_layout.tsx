import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/lib/supabase";
import { setAuthError, setInitializing, setUser } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { store } from "@/store/store";

export const unstable_settings = {
  anchor: "(auth)/login",
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutInner />
    </Provider>
  );
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;

    function applySessionUser(user: unknown) {
      const supabaseUser = user as
        | {
            id: string;
            email?: string | null;
            user_metadata?: Record<string, unknown>;
          }
        | null
        | undefined;

      if (!supabaseUser) {
        dispatch(setUser(null));
        dispatch(setInitializing(false));
        return;
      }

      const meta = (supabaseUser.user_metadata ?? {}) as Record<
        string,
        unknown
      >;
      const role = meta.role as unknown;
      const location =
        typeof meta.location === "string" ? meta.location.trim() || null : null;
      const displayName =
        typeof meta.displayName === "string"
          ? meta.displayName.trim() || null
          : typeof meta.full_name === "string"
          ? meta.full_name.trim() || null
          : null;
      const photoUrl = typeof meta.photoUrl === "string" ? meta.photoUrl : null;

      if (role !== "user" && role !== "handyman") {
        dispatch(setAuthError("Invalid role"));
        void supabase.auth.signOut();
        dispatch(setUser(null));
        dispatch(setInitializing(false));
        return;
      }

      dispatch(
        setUser({
          uid: supabaseUser.id,
          email: supabaseUser.email ?? null,
          displayName,
          role,
          location,
          photoUrl,
        })
      );
      dispatch(setInitializing(false));
    }

    dispatch(setInitializing(true));
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        applySessionUser(data.session?.user);
      })
      .catch(() => {
        if (!active) return;
        dispatch(setAuthError("Unable to load session"));
        dispatch(setUser(null));
        dispatch(setInitializing(false));
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      dispatch(setInitializing(true));
      applySessionUser(session?.user);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="user/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="handyman/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
