import { Href, Tabs, router } from "expo-router";
import React, { useEffect } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setAuthError, signOutThunk } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const { user, initializing } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (initializing) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "handyman") {
      router.replace("/handyman/(tabs)/home" as unknown as Href);
      return;
    }

    if (user.role !== "user") {
      dispatch(setAuthError("Invalid role"));
      dispatch(signOutThunk());
      router.replace("/login");
    }
  }, [dispatch, initializing, user]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="wrench.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
