import { HapticTab } from "@/components/haptic-tab";
import { TabBadgesProvider, useTabBadges } from "@/hooks/useTabBadges";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";

function TabLayoutContent() {
  const { badges } = useTabBadges();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4576F2",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons size={size ?? 28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: "Explorar",
          tabBarBadge: badges.explorar > 0 ? (badges.explorar > 99 ? '99+' : badges.explorar) : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons size={size ?? 28} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="atendimentos"
        options={{
          title: "Atendimentos",
          tabBarBadge: badges.atendimentos > 0 ? (badges.atendimentos > 99 ? '99+' : badges.atendimentos) : undefined,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 size={20} name="stethoscope" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="conversas"
        options={{
          title: "Conversas",
          tabBarBadge: badges.conversas > 0 ? (badges.conversas > 99 ? '99+' : badges.conversas) : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              size={(size ?? 28) - 2}
              name="chatbubble-ellipses-outline"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pulses"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="notificacoes"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          href: null, // Hide contacts/add-contacts from tab bar
        }}
      />
      <Tabs.Screen
        name="add-contacts"
        options={{
          href: null, // Hide standalone add-contacts if present
        }}
      />
      <Tabs.Screen
        name="contacts/add-contacts"
        options={{
          href: null, // Hide nested contacts/add-contacts if present
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <TabBadgesProvider>
      <TabLayoutContent />
    </TabBadgesProvider>
  );
}
