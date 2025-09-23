import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-book"
        options={{
          title: "Add Book",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-plus"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Saved Books",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bookshelf"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="magnify"
              color={color}
              size={size ?? 28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
