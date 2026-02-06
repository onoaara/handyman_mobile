import { ThemedText } from "@/components/themed-text";
import { AppButton } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmTone?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function AppAlertDialog({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmTone = "default",
  onConfirm,
  onCancel,
}: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const confirmColor = confirmTone === "destructive" ? "#ff4d4f" : colors.tint;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[
            styles.card,
            { backgroundColor: colors.background, borderColor: colors.icon },
          ]}
          onPress={() => {}}
        >
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          {message ? (
            <ThemedText style={styles.message}>{message}</ThemedText>
          ) : null}
          <View style={styles.actions}>
            <AppButton
              variant="outline"
              title={cancelText}
              onPress={onCancel}
              style={{ flex: 1 }}
            />
            <AppButton
              variant="primary"
              title={confirmText}
              onPress={onConfirm}
              style={[
                { flex: 1 },
                confirmTone === "destructive" && { backgroundColor: "#ff4d4f" },
              ]}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  title: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    opacity: 0.85,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
});
