import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppAlertDialog } from "@/components/ui/alert-dialog";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { signOutThunk } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Href, router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    <View style={[styles.statCard, { borderColor: colors.icon }]}>
      <View style={styles.statTop}>
        <ThemedText type="subtitle">{value}</ThemedText>
        <IconSymbol name={icon} size={18} color={colors.icon} />
      </View>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

function MenuItem({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  onPress?: () => void;
}) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.menuLeft}>
        <IconSymbol name={icon} size={20} color={colors.icon} />
        <ThemedText>{title}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={18} color={colors.icon} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.user);
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const displayName = useMemo(() => {
    const fallback = authUser?.email?.split("@")[0] ?? "User";
    return authUser?.displayName ?? fallback;
  }, [authUser?.displayName, authUser?.email]);

  const email = useMemo(() => {
    return authUser?.email ?? "";
  }, [authUser?.email]);

  const photo = useMemo(() => {
    return authUser?.photoUrl ?? null;
  }, [authUser?.photoUrl]);

  const headerBg = useMemo(() => {
    return colors.tint;
  }, [colors.tint]);

  const bodyBg = useMemo(() => {
    return scheme === "dark" ? "#0f1a24" : "#eaf3ff";
  }, [scheme]);

  return (
    <ThemedView style={[styles.screen, { backgroundColor: bodyBg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <View style={[styles.headerTop, { paddingTop: insets.top + 12 }]}>
            <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
              Profile
            </ThemedText>
          </View>

          <View style={styles.avatarWrap}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarFallback,
                  { borderColor: "rgba(255,255,255,0.55)" },
                ]}
              >
                <IconSymbol name="person.fill" size={34} color="#fff" />
              </View>
            )}
            <View style={styles.avatarBadge}>
              <IconSymbol name="camera" size={14} color={colors.tint} />
            </View>
          </View>

          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            {displayName}
          </ThemedText>
          <ThemedText style={styles.email} lightColor="#fff" darkColor="#fff">
            {email}
          </ThemedText>
        </View>

        <View style={styles.body}>
          <View style={styles.statsRow}>
            <StatCard
              value="€250"
              label="Total invoice cost"
              icon="list.bullet"
            />
            <StatCard value="4.5" label="Rating" icon="star.fill" />
          </View>

          <View style={[styles.menu, { borderColor: colors.icon }]}>
            <MenuItem
              title="Statistics"
              icon="chart.bar"
              onPress={() =>
                router.push(
                  "/user/(tabs)/profile/statistics" as unknown as Href
                )
              }
            />
            <View style={[styles.divider, { backgroundColor: colors.icon }]} />
            <MenuItem
              title="Settings and Privacy"
              icon="gearshape"
              onPress={() =>
                router.push("/user/(tabs)/profile/settings" as unknown as Href)
              }
            />
            <View style={[styles.divider, { backgroundColor: colors.icon }]} />
            <MenuItem
              title="Payment options"
              icon="creditcard"
              onPress={() => {}}
            />
            <View style={[styles.divider, { backgroundColor: colors.icon }]} />
            <MenuItem
              title="Address"
              icon="mappin.and.ellipse"
              onPress={() => {}}
            />
          </View>

          <Pressable
            onPress={() => setLogoutDialogVisible(true)}
            style={styles.logout}
          >
            <ThemedText type="link">Logout</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
      <AppAlertDialog
        visible={logoutDialogVisible}
        title="Log out?"
        message="Are you sure you want to log out?"
        confirmText="Log out"
        cancelText="Cancel"
        confirmTone="destructive"
        onCancel={() => setLogoutDialogVisible(false)}
        onConfirm={async () => {
          setLogoutDialogVisible(false);
          await dispatch(signOutThunk());
          router.replace("/login");
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 22,
    alignItems: "center",
  },
  headerTop: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 10,
  },
  avatarWrap: {
    marginTop: 8,
    marginBottom: 10,
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarFallback: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  email: {
    opacity: 0.9,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 12,
    gap: 6,
  },
  statTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.75,
  },
  menu: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.35,
    marginLeft: 14,
  },
  pressed: {
    opacity: 0.85,
  },
  logout: {
    paddingVertical: 18,
    alignItems: "center",
  },
});
