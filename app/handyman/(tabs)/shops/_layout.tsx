import { Stack } from "expo-router";

export default function ShopLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "shops", headerShown: false }}
      />
    </Stack>
  );
}
