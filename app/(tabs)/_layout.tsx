import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../src/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: "rgba(12,14,20,0.98)",
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
          display: "flex",
          zIndex: 100,
          elevation: 20,
        },
        tabBarHideOnKeyboard: false,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="discover" options={{ title: "Discover", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="compass-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="social" options={{ title: "Social", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-group-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="library" options={{ title: "Library", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="bookmark-multiple-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}