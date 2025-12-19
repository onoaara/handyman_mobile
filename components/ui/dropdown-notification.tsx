import { ThemedText } from "@/components/themed-text";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  message: string | null;
  onDismiss?: () => void;
};

export function AppDropdownNotification({ message, onDismiss }: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visibleMessage, setVisibleMessage] = useState<string | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (message) {
      setVisibleMessage(message);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        onDismiss?.();
      }, 4500);

      return;
    }

    if (!visibleMessage) return;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -200,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setVisibleMessage(null);
    });
  }, [message, onDismiss, opacity, translateY, visibleMessage]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visibleMessage) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
      pointerEvents="box-none"
    >
      <Pressable
        style={styles.toast}
        onPress={() => onDismiss?.()}
        accessibilityRole="button"
      >
        <ThemedText style={styles.message} lightColor="#fff" darkColor="#fff">
          {visibleMessage}
        </ThemedText>
        <View style={styles.close}>
          <ThemedText
            style={styles.closeText}
            lightColor="#fff"
            darkColor="#fff"
          >
            ×
          </ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 50,
  },
  toast: {
    backgroundColor: "#ff4d4f",
    height: 90,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  message: {
    flex: 1,
    alignSelf: "flex-end",
  },
  close: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 20,
    lineHeight: 20,
  },
});
