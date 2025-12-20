import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Href, Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

const SERVICES = [
  { id: "plumbing", title: "Plumbing" },
  { id: "electrical", title: "Electrical" },
  { id: "cleaning", title: "Cleaning" },
  { id: "painting", title: "Painting" },
  { id: "carpentry", title: "Carpentry" },
];

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? "light"].tint;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Browse Services</ThemedText>
      <FlatList
        contentContainerStyle={styles.list}
        data={SERVICES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Link
            href={
              {
                pathname: "/handyman/(tabs)/services/[id]",
                params: { id: item.id },
              } as unknown as Href
            }
            asChild
          >
            <Pressable style={[styles.card, { borderColor: tint }]}>
              <ThemedText type="subtitle">{item.title}</ThemedText>
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  list: {
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    marginHorizontal: 6,
  },
});
