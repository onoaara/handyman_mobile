import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { FlatList, StyleSheet, View } from "react-native";

const DATA = [
  { id: "1", title: "Plumbing - Dec 12, 10:00 AM" },
  { id: "2", title: "Electrical - Dec 14, 2:30 PM" },
];

export default function BookingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your Bookings</ThemedText>
      <FlatList
        contentContainerStyle={styles.list}
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ThemedText>{item.title}</ThemedText>
          </View>
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
  item: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#ccc",
  },
});
