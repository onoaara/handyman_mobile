import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export default function AuthLayout() {
  const { user, initializing } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (initializing) return;
    if (user) router.replace("/(tabs)");
  }, [initializing, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
