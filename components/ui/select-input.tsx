import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "./icon-symbol";

type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  label?: string;
  helper?: string;
  error?: string;
  placeholder?: string;
  value: T | null;
  options: Array<Option<T>>;
  onChange: (value: T) => void;
  style?: ViewStyle;
};

export function AppSelectInput<T extends string>({
  label,
  helper,
  error,
  placeholder = "Select",
  value,
  options,
  onChange,
  style,
}: Props<T>) {
  const scheme = useColorScheme() ?? "light";
  const tint = Colors[scheme].tint;
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const selected = options.find((o) => o.value === value);
    return selected?.label ?? null;
  }, [options, value]);

  return (
    <View style={[styles.container, style]}>
      {label ? <ThemedText type="subtitle">{label}</ThemedText> : null}

      <Pressable
        style={[styles.inputWrapper, { borderColor: error ? "#ff4d4f" : "#ccc" }]}
        onPress={() => setOpen(true)}
      >
        <ThemedText style={styles.valueText}>
          {selectedLabel ?? placeholder}
        </ThemedText>
        <IconSymbol
          name="chevron.right"
          size={18}
          color={tint}
          style={{ transform: [{ rotate: "90deg" }] }}
        />
      </Pressable>

      {error ? (
        <ThemedText style={[styles.msg, { color: "#ff4d4f" }]}>
          {error}
        </ThemedText>
      ) : null}
      {helper && !error ? <ThemedText style={styles.msg}>{helper}</ThemedText> : null}

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable onPress={() => null}>
            <ThemedView style={styles.sheet}>
              {options.map((o) => {
                const isSelected = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    style={[styles.option, isSelected ? styles.optionSelected : null]}
                    onPress={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                  >
                    <ThemedText type={isSelected ? "defaultSemiBold" : "default"}>
                      {o.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ThemedView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueText: {
    fontSize: 16,
  },
  msg: {
    fontSize: 12,
  },
  backdrop: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 280,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: "rgba(47,149,220,0.15)",
  },
});
