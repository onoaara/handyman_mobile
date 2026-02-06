import { ThemedText } from "@/components/themed-text";
import { AppButton } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Shop } from "@/store/shopSlice";
import { StyleSheet, View } from "react-native";

type ShopCardProps = {
  shop: Shop;
  onPress: (shop: Shop) => void;
};

export function ShopCard({ shop, onPress }: ShopCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <IconSymbol name="building.fill" size={32} color={colors.tint} />
        </View>
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle" style={styles.title}>
            {shop.name}
          </ThemedText>
          <ThemedText style={styles.location}>
            {shop.location || "No location set"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        {shop.description ? (
          <ThemedText style={styles.description} numberOfLines={3}>
            {shop.description}
          </ThemedText>
        ) : null}

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <IconSymbol
              name="mappin.and.ellipse"
              size={16}
              color={colors.icon}
            />
            <ThemedText style={styles.detailText}>{shop.address}</ThemedText>
          </View>
          {shop.phone ? (
            <View style={styles.detailItem}>
              <IconSymbol name="phone.fill" size={16} color={colors.icon} />
              <ThemedText style={styles.detailText}>{shop.phone}</ThemedText>
            </View>
          ) : null}
        </View>
      </View>

      <AppButton
        title="View Shop"
        onPress={() => onPress(shop)}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0f0f0", // We might want a themed background here, but keeping it simple for now
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 20,
  },
  location: {
    opacity: 0.6,
    fontSize: 14,
  },
  content: {
    gap: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 24,
  },
  details: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    opacity: 0.7,
  },
  button: {
    marginTop: 8,
  },
});
