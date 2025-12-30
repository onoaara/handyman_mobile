import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Profile",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="statistics"
        options={{
          title: "Statistics",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: "Settings", headerBackButtonDisplayMode: "minimal" }}
      />
    </Stack>
  );
}
