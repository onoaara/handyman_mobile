import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

export type HomeService = {
  id: string;
  title: string;
  imageUri: string;
};

type CardProps = {
  item: HomeService;
  onPress?: (item: HomeService) => void;
};

function HomeServiceCard({ item, onPress }: CardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const labelBackgroundColor = useMemo(() => {
    return scheme === "dark" ? "rgba(21,23,24,0.78)" : "rgba(255,255,255,0.82)";
  }, [scheme]);

  return (
    <Pressable
      disabled={!onPress}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.pressable,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <View style={[styles.card, { borderColor: colors.icon }]}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        <View style={[styles.label, { backgroundColor: labelBackgroundColor }]}>
          <ThemedText style={styles.labelText}>{item.title}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

type ListProps = {
  data: HomeService[];
  onPressItem?: (item: HomeService) => void;
};

export function HomeServiceCards({ data, onPressItem }: ListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <HomeServiceCard item={item} onPress={onPressItem} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    height: 200,
    width: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "center",
    alignItems: "center",
  },
  labelText: {
    textAlign: "center",
  },
  list: {
    gap: 12,
  },
  row: {
    gap: 12,
  },
});
