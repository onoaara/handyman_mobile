/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1e293b",
    background: "#ffffff",
    surface: "#f8fafc",
    textMuted: "#64748b",
    border: "#e2e8f0",
    accent: "#3b82f6",
    onAccent: "#ffffff",
    tint: "#3b82f6",
    icon: "#64748b",
    tabIconDefault: "#64748b",
    tabIconSelected: "#3b82f6",
  },
  dark: {
    text: "#f1f5f9",
    background: "#0f172a",
    surface: "#1e293b",
    textMuted: "#94a3b8",
    border: "#334155",
    accent: "#3b82f6",
    onAccent: "#ffffff",
    tint: "#3b82f6",
    icon: "#94a3b8",
    tabIconDefault: "#94a3b8",
    tabIconSelected: "#3b82f6",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
