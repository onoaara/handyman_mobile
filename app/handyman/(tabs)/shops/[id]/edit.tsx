import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { updateShopThunk } from "@/store/shopSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditShopScreen() {
  const { id } = useLocalSearchParams();
  const shop = useAppSelector((state) =>
    state.shops.shops.find((s) => s.id === id)
  );

  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shop) {
      setName(shop.name);
      setDescription(shop.description || "");
      setAddress(shop.address);
      setPhone(shop.phone || "");
      setLocation(shop.location || "");
    }
  }, [shop]);

  const handleUpdate = async () => {
    if (!shop) return;
    if (!name || !address) {
      setError("Name and address are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await dispatch(
        updateShopThunk({
          id: shop.id,
          updates: {
            name,
            description,
            address,
            phone,
            location,
          },
        })
      ).unwrap();
      router.back();
    } catch (err: any) {
      setError(err.message || "Failed to update shop");
    } finally {
      setLoading(false);
    }
  };

  if (!shop) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Shop not found</ThemedText>
        <AppButton title="Go Back" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.container}>
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            <View style={styles.header}>
              <ThemedText type="title">Edit Shop</ThemedText>
            </View>

            {error && (
              <ThemedText style={{ color: "red", marginBottom: 10 }}>
                {error}
              </ThemedText>
            )}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold">Shop Name *</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  placeholder="e.g. Joe's Plumbing"
                  placeholderTextColor={colors.icon}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold">Description</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  placeholder="Describe your services..."
                  placeholderTextColor={colors.icon}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold">Address *</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                      minHeight: 40,
                    },
                  ]}
                  placeholder="Shop address"
                  placeholderTextColor={colors.icon}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold">Phone</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  placeholder="Contact number"
                  placeholderTextColor={colors.icon}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

               <View style={styles.inputGroup}>
                <ThemedText type="defaultSemiBold">Location</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  placeholder="City, State"
                  placeholderTextColor={colors.icon}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <AppButton
                title="Save Changes"
                onPress={handleUpdate}
                loading={loading}
              />
            </View>
          </ScrollView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});
