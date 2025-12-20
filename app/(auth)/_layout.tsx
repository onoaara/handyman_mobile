import { Href, Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function AuthLayout() {
  const { user, initializing } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (initializing) return;
    if (user?.role === "user")
      router.replace("/user/(tabs)/home" as unknown as Href);
    if (user?.role === "handyman")
      router.replace("/handyman/(tabs)/home" as unknown as Href);
  }, [initializing, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
