import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/button";
import { AppDropdownNotification } from "@/components/ui/dropdown-notification";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppTextInput } from "@/components/ui/text-input";
import { clearError, updateProfileThunk } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
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

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((s) => s.auth);

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
    null
  );

  const currentPhoto = useMemo(() => {
    return profilePictureUri ?? user?.photoUrl ?? null;
  }, [profilePictureUri, user?.photoUrl]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setProfilePictureUri(result.assets[0].uri);
  };

  if (!user) return null;

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
          contentContainerStyle={styles.content}
        >
          <ThemedText type="title">Edit Profile</ThemedText>

          <View style={styles.photoRow}>
            <Pressable onPress={pickImage} style={styles.avatarWrap}>
              {currentPhoto ? (
                <Image source={{ uri: currentPhoto }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <IconSymbol name="person.fill" size={34} color="#2f95dc" />
                </View>
              )}
              <View style={styles.cameraBadge}>
                <IconSymbol name="camera" size={16} color="#2f95dc" />
              </View>
            </Pressable>
            <View style={styles.photoText}>
              <ThemedText type="subtitle">Profile photo</ThemedText>
              <ThemedText>Tap to change</ThemedText>
            </View>
          </View>

          <AppTextInput
            label="Full Name"
            value={displayName}
            onChangeText={(t) => {
              if (error) dispatch(clearError());
              setDisplayName(t);
            }}
            placeholder="Enter your name..."
          />

          <AppTextInput
            label="Location"
            value={location}
            onChangeText={(t) => {
              if (error) dispatch(clearError());
              setLocation(t);
            }}
            placeholder="Enter your location..."
          />

          <AppTextInput
            label="Email"
            value={user.email ?? ""}
            editable={false}
          />

          <View style={styles.actions}>
            <AppButton
              title="Save Changes"
              loading={status === "loading"}
              onPress={async () => {
                Keyboard.dismiss();
                const result = await dispatch(
                  updateProfileThunk({
                    displayName,
                    location,
                    profilePictureUri,
                  })
                );
                if (updateProfileThunk.fulfilled.match(result)) {
                  router.back();
                }
              }}
            />
            <Pressable onPress={() => router.back()} style={styles.cancel}>
              <ThemedText type="link">Cancel</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  screen: { flex: 1, padding: 16 },
  content: { gap: 14, paddingBottom: 30 },
  photoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarWrap: { position: "relative" },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarFallback: {
    borderWidth: 1,
    borderColor: "#cfe6ff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f9ff",
  },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cfe6ff",
  },
  photoText: { flex: 1, gap: 2 },
  actions: { gap: 10, marginTop: 8 },
  cancel: { alignSelf: "center", paddingVertical: 6 },
});
