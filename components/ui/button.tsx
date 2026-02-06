import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  children?: ReactNode;
  title?: string; // Backward compatibility
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  loading?: boolean; // Backward compatibility
  fullWidth?: boolean;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  left?: ReactNode; // Backward compatibility
}

export function AppButton({
  children,
  title,
  variant = "primary",
  isLoading = false,
  loading = false,
  fullWidth = false,
  onPress,
  disabled,
  style,
  left,
  ...props
}: ButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const isloadingState = isLoading || loading;
  const isDisabled = disabled || isloadingState;

  // Define styles based on variant
  const getBackgroundColor = (pressed: boolean) => {
    if (isDisabled && variant !== "ghost" && variant !== "outline")
      return colors.textMuted + "80"; // Opacity 50%
    if (variant === "primary") return pressed ? colors.tint + "DD" : colors.tint; // Slightly transparent when pressed
    if (variant === "secondary")
      return pressed ? colors.surface + "DD" : colors.surface;
    if (variant === "outline")
      return pressed ? colors.surface : "transparent";
    if (variant === "ghost")
      return pressed ? colors.surface : "transparent";
    return colors.tint;
  };

  const getTextColor = () => {
    if (isDisabled) return colors.background; // Or some muted color
    if (variant === "primary") return "#ffffff";
    if (variant === "secondary") return colors.text;
    if (variant === "outline") return colors.text;
    if (variant === "ghost") return colors.tint;
    return "#ffffff";
  };

  const getBorderColor = () => {
     if (variant === "outline") return colors.border;
     return "transparent";
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: getBackgroundColor(pressed),
          borderColor: getBorderColor(),
          borderWidth: variant === "outline" ? 1 : 0,
        },
        isDisabled && variant === "outline" && { opacity: 0.5 },
        isDisabled && variant === "ghost" && { opacity: 0.5 },
        style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {isloadingState ? (
          <ActivityIndicator
            size="small"
            color={getTextColor()}
            style={{ marginRight: 8 }}
          />
        ) : (
           left ? <View style={{ marginRight: 8 }}>{left}</View> : null
        )}
        
        {children ? (
            children
        ) : title ? (
          <ThemedText
            type="defaultSemiBold"
            style={{
              color: getTextColor(),
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {title}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44,
  },
  fullWidth: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
