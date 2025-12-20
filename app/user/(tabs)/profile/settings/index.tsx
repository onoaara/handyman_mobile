import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

function Row({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle?: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  onPress?: () => void;
}) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <View style={styles.left}>
        <View style={[styles.iconWrap, { borderColor: colors.icon }]}>
          <IconSymbol name={icon} size={18} color={colors.icon} />
        </View>
        <View style={styles.text}>
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
          {subtitle ? (
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          ) : null}
        </View>
      </View>
      <IconSymbol name="chevron.right" size={18} color={colors.icon} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { borderColor: colors.icon }]}>
          <Row
            title="Account"
            subtitle="Name, email, password"
            icon="person.fill"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: colors.icon }]} />
          <Row
            title="Privacy"
            subtitle="Permissions, visibility"
            icon="lock.fill"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: colors.icon }]} />
          <Row
            title="Notifications"
            subtitle="Push and email preferences"
            icon="bell.fill"
            onPress={() => {}}
          />
        </View>

        <View style={[styles.section, { borderColor: colors.icon }]}>
          <Row
            title="Help"
            subtitle="Support and FAQs"
            icon="questionmark.circle"
            onPress={() => {}}
          />
          <View style={[styles.divider, { backgroundColor: colors.icon }]} />
          <Row
            title="About"
            subtitle="App version and legal"
            icon="info.circle"
            onPress={() => {}}
          />
        </View>

        <Pressable onPress={() => router.back()} style={styles.back}>
          <ThemedText type="link">Back to Profile</ThemedText>
        </Pressable>
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
    gap: 14,
  },
  section: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    gap: 2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.35,
    marginLeft: 60,
  },
  pressed: {
    opacity: 0.85,
  },
  back: {
    paddingVertical: 10,
    alignItems: "center",
  },
});

