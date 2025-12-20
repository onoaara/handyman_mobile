import { HomeHeader } from "@/components/home/home-header";
import { type HomeService } from "@/components/home/service-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppSearchBar } from "@/components/ui/search-bar";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import { useAppSelector } from "@/store/hooks";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Keyboard, ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
  const authUser = useAppSelector((s) => s.auth.user);
  const [profileLocation, setProfileLocation] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profileDisplayName, setProfileDisplayName] = useState<string | null>(
    null
  );
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!authUser?.uid) return;
      const snap = await getDoc(doc(firebaseDb, "users", authUser.uid));
      if (!snap.exists()) return;
      const data = snap.data() as {
        displayName?: string | null;
        location?: string | null;
        profilePicture?: string | null;
      };
      if (cancelled) return;
      setProfileDisplayName(data.displayName ?? null);
      setProfileLocation(data.location ?? null);
      setProfilePicture(data.profilePicture ?? null);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authUser?.uid]);

  const displayName = useMemo(() => {
    const fallback =
      authUser?.email?.split("@")[0] ??
      firebaseAuth.currentUser?.email?.split("@")[0] ??
      "User";
    return profileDisplayName ?? authUser?.displayName ?? fallback;
  }, [authUser?.displayName, authUser?.email, profileDisplayName]);

  const location = useMemo(() => {
    return profileLocation ?? "Location not set";
  }, [profileLocation]);

  const photo = useMemo(() => {
    return profilePicture ?? firebaseAuth.currentUser?.photoURL ?? null;
  }, [profilePicture]);

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
