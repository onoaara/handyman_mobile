import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
}) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <View
      style={[
        styles.card,
        { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      <View style={styles.cardTop}>
        <ThemedText type="subtitle">{value}</ThemedText>
        <IconSymbol name={icon} size={18} color={colors.icon} />
      </View>
      <ThemedText style={styles.cardLabel}>{label}</ThemedText>
    </View>
  );
}

export default function StatisticsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const bodyBg = useMemo(() => {
    return colors.background;
  }, [colors.background]);

  return (
    <ThemedView style={[styles.screen, { backgroundColor: bodyBg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Overview</ThemedText>

        <View style={styles.grid}>
          <StatCard
            value="€250"
            label="Total invoice cost"
            icon="list.bullet"
          />
          <StatCard value="4.5" label="Average rating" icon="star.fill" />
        </View>

        <View style={styles.grid}>
          <StatCard
            value="12"
            label="Completed jobs"
            icon="checkmark.seal.fill"
          />
          <StatCard value="3" label="Active bookings" icon="calendar" />
        </View>

        <View style={[styles.panel, { borderColor: colors.border }]}>
          <ThemedText type="defaultSemiBold">This month</ThemedText>
          <View style={styles.panelRow}>
            <ThemedText style={styles.muted}>Earnings</ThemedText>
            <ThemedText type="defaultSemiBold">€120</ThemedText>
          </View>
          <View style={styles.panelRow}>
            <ThemedText style={styles.muted}>Jobs</ThemedText>
            <ThemedText type="defaultSemiBold">5</ThemedText>
          </View>
          <View style={styles.panelRow}>
            <ThemedText style={styles.muted}>Cancellation rate</ThemedText>
            <ThemedText type="defaultSemiBold">0%</ThemedText>
          </View>
        </View>
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
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardLabel: {
    fontSize: 12,
    opacity: 0.75,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 14,
    gap: 10,
    marginTop: 6,
  },
  panelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  muted: {
    opacity: 0.7,
  },
});
