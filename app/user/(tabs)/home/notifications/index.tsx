import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "booking" | "service" | "system";
};

// Sample notifications data
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Booking Confirmed",
    message:
      "Your plumbing service booking has been confirmed for tomorrow at 2:00 PM.",
    timestamp: "2 hours ago",
    read: false,
    type: "booking",
  },
  {
    id: "2",
    title: "Service Completed",
    message: "Your electrical repair service has been completed successfully.",
    timestamp: "1 day ago",
    read: false,
    type: "service",
  },
  {
    id: "3",
    title: "New Services Available",
    message: "Check out our new gardening services now available in your area.",
    timestamp: "2 days ago",
    read: true,
    type: "system",
  },
  {
    id: "4",
    title: "Booking Reminder",
    message:
      "Reminder: You have a cleaning service scheduled for today at 10:00 AM.",
    timestamp: "3 days ago",
    read: true,
    type: "booking",
  },
];

type NotificationItemProps = {
  item: Notification;
  onPress: (item: Notification) => void;
};

function NotificationItem({ item, onPress }: NotificationItemProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const getIconName = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return "calendar";
      case "service":
        return "wrench.fill";
      case "system":
        return "info.circle.fill";
      default:
        return "bell.fill";
    }
  };

  return (
    <Pressable
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
      onPress={() => onPress(item)}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              scheme === "dark"
                ? "rgba(59, 130, 246, 0.3)"
                : "rgba(59, 130, 246, 0.2)",
          },
        ]}
      >
        <IconSymbol
          name={getIconName(item.type)}
          size={20}
          color={colors.tint}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={!item.read && styles.unreadText}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
        </View>
        <ThemedText style={styles.message}>{item.message}</ThemedText>
      </View>
      {!item.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.tint }]} />
      )}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const handleNotificationPress = (notification: Notification) => {
    // TODO: Mark as read, navigate to relevant screen, etc.
    console.log("Notification pressed:", notification.id);
  };

  return (
    <ThemedView style={styles.container}>
      {/* <ThemedText type="title" style={styles.headerTitle}>
        Notifications
      </ThemedText> */}
      <FlatList
        data={SAMPLE_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleNotificationPress} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  unreadItem: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  message: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  separator: {
    height: 8,
  },
});
