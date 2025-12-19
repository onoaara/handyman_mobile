import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/themed-text";

type Props = {
  title: string;
  onPress: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  left?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  left,
  style,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[styles.base, isDisabled ? styles.disabled : null, style]}
      disabled={isDisabled}
      onPress={onPress}
    >
      <View style={styles.content}>
        {left ? <View style={styles.left}>{left}</View> : null}
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            {title}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2f95dc",
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  left: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
