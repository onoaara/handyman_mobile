import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={{ uri: "https://placehold.co/100x100" }}
        style={styles.avatar}
      />
      <ThemedText type="title">Your Profile</ThemedText>
      <ThemedText>Manage account, addresses, and preferences</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
