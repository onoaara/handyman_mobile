import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen name="statistics" options={{ title: "Statistics" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
