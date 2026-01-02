import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="notifications/index"
        options={{
          title: "Notifications",
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="services"
        options={{
          title: "Services",
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
