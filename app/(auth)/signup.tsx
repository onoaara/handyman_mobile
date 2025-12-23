import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/button";
import { AppDropdownNotification } from "@/components/ui/dropdown-notification";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppSelectInput } from "@/components/ui/select-input";
import { AppTextInput } from "@/components/ui/text-input";
import {
  clearError,
  setAuthError,
  signUpThunk,
  type Role,
} from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
    null
  );

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
          <View style={styles.photoRow}>
            <View style={styles.avatarWrap}>
              {profilePictureUri ? (
                <Image
                  source={{ uri: profilePictureUri }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <IconSymbol name="person.fill" size={30} color="#fff" />
                </View>
              )}
            </View>
            <View style={styles.photoActions}>
              <Pressable
                onPress={async () => {
                  if (error) dispatch(clearError());

                  const perm =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (!perm.granted) {
                    dispatch(setAuthError("Media library permission required"));
                    return;
                  }

                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.85,
                  });

                  if (result.canceled) return;
                  const uri = result.assets[0]?.uri ?? null;
                  setProfilePictureUri(uri);
                }}
                style={styles.photoButton}
              >
                <IconSymbol name="camera" size={18} color="#2f95dc" />
                <ThemedText type="link">
                  {profilePictureUri ? "Change photo" : "Upload photo"}
                </ThemedText>
              </Pressable>
              {profilePictureUri ? (
                <Pressable
                  onPress={() => setProfilePictureUri(null)}
                  style={styles.removePhoto}
                >
                  <ThemedText type="link">Remove</ThemedText>
                </Pressable>
              ) : null}
            </View>
          </View>
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
          <AppTextInput
            label="Location"
            placeholder="Enter your location..."
            value={location}
            onChangeText={(t) => {
              if (error) dispatch(clearError());
              setLocation(t);
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
                signUpThunk({
                  name,
                  email,
                  password,
                  role,
                  location,
                  profilePictureUri,
                })
              );
              if (signUpThunk.fulfilled.match(result)) {
                await Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
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
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 72,
    height: 72,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarFallback: {
    backgroundColor: "#2f95dc",
    alignItems: "center",
    justifyContent: "center",
  },
  photoActions: {
    flex: 1,
    gap: 10,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  removePhoto: {
    alignSelf: "flex-start",
  },
});
