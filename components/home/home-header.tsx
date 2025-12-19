import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  displayName: string;
  location: string;
  photo: string | null;
};

export function HomeHeader({ displayName, location, photo }: Props) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const tint = Colors[scheme ?? "light"].tint;
  const border = Colors[scheme ?? "light"].icon;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {photo ? (
        <Image
          source={{
            uri: photo,
          }}
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.avatar, styles.fallback, { borderColor: border }]}>
          <IconSymbol name="person.fill" size={26} color={tint} />
        </View>
      )}
      <View style={styles.text}>
        <ThemedText type="subtitle">{displayName}</ThemedText>
        <ThemedText>{location}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
