import { Stack } from "expo-router";

export default function BookingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Bookings", headerShown: false }}
      />
      <Stack.Screen name="new" options={{ title: "New Booking" }} />
    </Stack>
  );
}
