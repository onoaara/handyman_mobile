import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, initializing } = useAppSelector((s) => s.auth);

  if (initializing) return null;

  if (!user) return <Redirect href="/login" />;

  return <Redirect href="/(tabs)/home" />;
}

