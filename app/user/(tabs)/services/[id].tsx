import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Href, Link, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{id} Service</ThemedText>
      <ThemedText>
        Select options and book a handyman for your {id} needs.
      </ThemedText>
      <Link href={"/user/(tabs)/bookings/new" as unknown as Href} asChild>
        <Pressable style={styles.cta}>
          <ThemedText type="subtitle">Book Now</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  cta: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2f95dc",
  },
});
