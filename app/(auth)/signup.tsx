import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/button";
import { AppDropdownNotification } from "@/components/ui/dropdown-notification";
import { AppSelectInput } from "@/components/ui/select-input";
import { AppTextInput } from "@/components/ui/text-input";
import { clearError, signUpThunk, type Role } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("user");

  const passwordMismatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={styles.screen}>
        <AppDropdownNotification
          message={error}
          onDismiss={() => dispatch(clearError())}
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          // keyboardDismissMode="on-drag"
          contentContainerStyle={styles.content}
        >
          <ThemedText type="title">Create Account</ThemedText>
          <AppTextInput
            label="Full Name"
            placeholder="Enter your name..."
            textContentType="name"
            value={name}
            onChangeText={(t) => {
              if (error) dispatch(clearError());
              setName(t);
            }}
          />
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
          <AppSelectInput<Role>
            label="Role"
            value={role}
            options={[
              { label: "Handyman", value: "handyman" },
              { label: "User", value: "user" },
            ]}
            onChange={(v) => {
              if (error) dispatch(clearError());
              setRole(v);
            }}
          />
          <AppTextInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
            value={password}
            onChangeText={(t) => {
              if (error) dispatch(clearError());
              setPassword(t);
            }}
          />
          <AppTextInput
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="password"
            value={confirmPassword}
            error={passwordMismatch ? "Passwords do not match" : undefined}
            onChangeText={(t) => {
              if (error) dispatch(clearError());
              setConfirmPassword(t);
            }}
          />
          <AppButton
            title="Create Account"
            loading={status === "loading"}
            disabled={passwordMismatch}
            onPress={async () => {
              if (passwordMismatch) return;
              Keyboard.dismiss();
              const result = await dispatch(
                signUpThunk({ name, email, password, role })
              );
              if (signUpThunk.fulfilled.match(result)) {
                await Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
                router.replace("/(tabs)/home");
              }
            }}
          />
          <Pressable onPress={() => router.push("/login")}>
            <ThemedText type="link">Already have an account? Login</ThemedText>
          </Pressable>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  screen: {
    flex: 1,
    position: "relative",
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingVertical: 100,
    gap: 12,
    justifyContent: "center",
  },
});
