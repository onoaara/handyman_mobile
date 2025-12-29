import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="notifications"
        options={{ title: "Notifications", headerShown: true }}
      />
    </Stack>
  );
}
