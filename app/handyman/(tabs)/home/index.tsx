import { HomeHeader } from "@/components/home/home-header";
import {
  HomeServiceCards,
  type HomeService,
} from "@/components/home/service-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppSearchBar } from "@/components/ui/search-bar";
import { useAppSelector } from "@/store/hooks";
import { useMemo, useState } from "react";
import { Keyboard, ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
  const authUser = useAppSelector((s) => s.auth.user);
  const [search, setSearch] = useState("");

  const services = useMemo<HomeService[]>(
    () => [
      {
        id: "fixture",
        title: "Fixture replacement",
        imageUri:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "gardening",
        title: "Gardening",
        imageUri:
          "https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "smart-home",
        title: "Smart home",
        imageUri:
          "https://images.unsplash.com/photo-1581091870627-3b0c01f7f2c4?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "window",
        title: "Window repair",
        imageUri:
          "https://images.unsplash.com/photo-1523413458461-7ac2b27c29f8?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "painting",
        title: "Painting",
        imageUri:
          "https://images.unsplash.com/photo-1562259949-3fdb11e1a05a?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "floor",
        title: "Floor repair",
        imageUri:
          "https://images.unsplash.com/photo-1600573472511-8e8a011c2b9a?auto=format&fit=crop&w=800&q=60",
      },
    ],
    []
  );

  const displayName = useMemo(() => {
    const fallback = authUser?.email?.split("@")[0] ?? "User";
    return authUser?.displayName ?? fallback;
  }, [authUser?.displayName, authUser?.email]);

  const location = useMemo(() => {
    return authUser?.location ?? "Location not set";
  }, [authUser?.location]);

  const photo = useMemo(() => {
    return authUser?.photoUrl ?? null;
  }, [authUser?.photoUrl]);

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => s.title.toLowerCase().includes(q));
  }, [search, services]);

  return (
    <ThemedView style={styles.screen}>
      <HomeHeader displayName={displayName} location={location} photo={photo} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppSearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search services..."
          onSubmit={() => Keyboard.dismiss()}
        />
        <ThemedText type="title">Handy</ThemedText>
        {/* <HomeServiceCards data={filteredServices} /> */}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
});
