import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/network';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primaryLight,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.bgCard,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        headerStyle: { backgroundColor: COLORS.bg },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '800', fontSize: 20 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Wallet', tabBarIcon: ({ color }) => <TabIcon label="💰" color={color} /> }}
      />
      <Tabs.Screen
        name="will"
        options={{ title: 'Will', tabBarIcon: ({ color }) => <TabIcon label="💀" color={color} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color }) => <TabIcon label="⚙️" color={color} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ label, color }: { label: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 22 }}>{label}</Text>;
}
