import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/button";
import { AppDropdownNotification } from "@/components/ui/dropdown-notification";
import { AppTextInput } from "@/components/ui/text-input";
import { clearError, signInThunk } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ThemedView style={styles.container}>
          <AppDropdownNotification
            message={error}
            onDismiss={() => dispatch(clearError())}
          />
          <ThemedText type="title">Login</ThemedText>
          <AppTextInput
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            value={email}
            onChangeText={(t) => {
              if (error) dispatch(clearError());
              setEmail(t);
            }}
          />
          <AppTextInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="password"
            value={password}
            onChangeText={(t) => {
              if (error) dispatch(clearError());
              setPassword(t);
            }}
          />
          <AppButton
            title="Sign In"
            loading={status === "loading"}
            onPress={async () => {
              Keyboard.dismiss();
              const result = await dispatch(signInThunk({ email, password }));
              if (signInThunk.fulfilled.match(result)) {
                await Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }
            }}
          />
          <Pressable onPress={() => router.push("/signup")}>
            <ThemedText type="link">Create an account</ThemedText>
          </Pressable>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: "relative",
    padding: 16,
    gap: 12,
    justifyContent: "center",
  },
});
