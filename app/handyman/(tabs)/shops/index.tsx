import { ShopCard } from "@/components/shop/shop-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchShopsThunk, Shop } from "@/store/shopSlice";
import { Href, router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShopsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { shops, status, error } = useAppSelector((state) => state.shops);
  const user = useAppSelector((state) => state.auth.user);

  const activeShops = shops.filter((s) => s.is_active);
  const shop = activeShops.length > 0 ? activeShops[0] : null;

  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        dispatch(fetchShopsThunk(user.uid));
      }
    }, [dispatch, user?.uid]),
  );

  const handlePressShop = (shop: Shop) => {
    router.push(`/handyman/(tabs)/shops/${shop.id}` as Href);
  };

  const handleCreateShop = () => {
    router.push("/handyman/(tabs)/shops/create" as Href);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="title">My Shop</ThemedText>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {status === "loading" && !shop ? (
          <View style={styles.center}>
            <ThemedText>Loading shop...</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <ThemedText style={{ color: "red" }}>{error}</ThemedText>
            <AppButton
              title="Retry"
              onPress={() => user?.uid && dispatch(fetchShopsThunk(user.uid))}
              variant="outline"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : shop ? (
          <ShopCard shop={shop} onPress={handlePressShop} />
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              You haven't created a shop yet.
            </ThemedText>
            <AppButton
              title="Create Your First Shop"
              onPress={handleCreateShop}
              style={{ marginTop: 16 }}
            />
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  center: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 8,
  },
});
