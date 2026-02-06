import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShopItemsThunk } from "@/store/shopSlice";
import {
  Href,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShopDetailsScreen() {
  const { id } = useLocalSearchParams();
  const shop = useAppSelector((state) =>
    state.shops.shops.find((s) => s.id === id),
  );
  const items = useAppSelector((state) => state.shops.items);
  const itemsStatus = useAppSelector((state) => state.shops.itemsStatus);

  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(fetchShopItemsThunk(id as string));
      }
    }, [dispatch, id]),
  );

  if (!shop) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Shop not found</ThemedText>
        <AppButton title="Go Back" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.header}>
          <ThemedText type="title">{shop.name}</ThemedText>
          <View style={styles.actions}>
            <AppButton
              title="Edit"
              // size="small"
              variant="outline"
              onPress={() =>
                router.push(`/handyman/(tabs)/shops/${id}/edit` as Href)
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.description}>{shop.description}</ThemedText>
          <View style={styles.infoRow}>
            <IconSymbol
              name="mappin.and.ellipse"
              size={16}
              color={colors.icon}
            />
            <ThemedText>{shop.address}</ThemedText>
          </View>
          {shop.phone ? (
            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={16} color={colors.icon} />
              <ThemedText>{shop.phone}</ThemedText>
            </View>
          ) : null}
          {shop.location ? (
            <View style={styles.infoRow}>
              <IconSymbol name="location.fill" size={16} color={colors.icon} />
              <ThemedText>{shop.location}</ThemedText>
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.itemsHeader}>
          <ThemedText type="subtitle">Items / Products</ThemedText>
          <AppButton
            title="Add Item"
            // size="small"
            onPress={() =>
              router.push(`/handyman/(tabs)/shops/${id}/add-item` as Href)
            }
          />
        </View>

        <View style={styles.itemsList}>
          {itemsStatus === "loading" ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : items.length === 0 ? (
            <ThemedText style={{ opacity: 0.6, fontStyle: "italic" }}>
              No items added yet.
            </ThemedText>
          ) : (
            items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.itemInfo}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText style={{ opacity: 0.7 }} numberOfLines={2}>
                    {item.description}
                  </ThemedText>
                </View>
                <ThemedText type="defaultSemiBold">
                  ${item.price.toFixed(2)}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  section: {
    gap: 8,
  },
  description: {
    marginBottom: 8,
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 24,
    opacity: 0.3,
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
});
