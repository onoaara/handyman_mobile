import { useAppSelector } from "@/store/hooks";
import { Href, Redirect } from "expo-router";

export default function Index() {
  const { user, initializing } = useAppSelector((s) => s.auth);

  if (initializing) return null;

  if (!user) return <Redirect href="/login" />;

  if (user.role === "user")
    return <Redirect href={"/user/(tabs)/home" as unknown as Href} />;
  if (user.role === "handyman")
    return <Redirect href={"/handyman/(tabs)/home" as unknown as Href} />;

  return <Redirect href="/login" />;
}
