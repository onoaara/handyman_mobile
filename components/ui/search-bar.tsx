import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
} & Omit<TextInputProps, "value" | "onChangeText" | "placeholder">;

export function AppSearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search...",
  ...rest
}: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const backgroundColor = useMemo(() => {
    return scheme === "dark" ? "#1f2226" : "#f2f4f7";
  }, [scheme]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, borderColor: colors.icon },
      ]}
    >
      <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.icon}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, { color: colors.text }]}
        onSubmitEditing={() => onSubmit?.(value)}
        {...rest}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityRole="button"
          hitSlop={10}
          style={styles.clear}
        >
          <ThemedText lightColor={colors.icon} darkColor={colors.icon}>
            ×
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clear: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

