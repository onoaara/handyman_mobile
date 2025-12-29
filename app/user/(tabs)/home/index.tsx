import { HomeHeader } from "@/components/home/home-header";
import {
  HomeServiceCards,
  type HomeService,
} from "@/components/home/service-card";
import { ServiceCardSkeleton } from "@/components/home/service-card-skeleton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppSearchBar } from "@/components/ui/search-bar";
import { supabase } from "@/lib/supabase";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { Keyboard, RefreshControl, ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
  const authUser = useAppSelector((s) => s.auth.user);
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<HomeService[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, display_picture")
        .order("name");

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      const mappedServices: HomeService[] = data.map((service: any) => ({
        id: service.id,
        title: service.name,
        imageUri: service.display_picture,
      }));

      setServices(mappedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

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
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AppSearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search services..."
          onSubmit={() => Keyboard.dismiss()}
        />
        <ThemedText type="title">Services</ThemedText>
        {loading ? (
          <ServiceCardSkeleton />
        ) : (
          <HomeServiceCards data={filteredServices} />
        )}
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
