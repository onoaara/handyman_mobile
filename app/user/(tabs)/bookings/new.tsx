import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Href, Link } from "expo-router";
import { Pressable, StyleSheet, TextInput } from "react-native";

export default function NewBookingScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">New Booking</ThemedText>
      <ThemedText>Select date, time, and address</ThemedText>
      <TextInput placeholder="Preferred date" style={styles.input} />
      <TextInput placeholder="Preferred time" style={styles.input} />
      <TextInput placeholder="Address" style={styles.input} />
      <Link href={"/user/(tabs)/bookings" as unknown as Href} asChild>
        <Pressable style={styles.cta}>
          <ThemedText type="subtitle">Confirm Booking</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cta: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2f95dc",
  },
});
