import { Stack } from "expo-router";

export default function ServicesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Services", headerShown: false }}
      />
      <Stack.Screen name="[id]" options={{ title: "Service Detail" }} />
    </Stack>
  );
}
