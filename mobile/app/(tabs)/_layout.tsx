import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Radius, Typography } from '../../constants/theme';
import { useTheme } from '../../constants/useTheme';
import { Home, Mic, BarChart2, User } from 'lucide-react-native';

export default function TabLayout() {
  const { colors, shadows, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 1.5,
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 10,
          shadowColor: colors.neuDarkDeep,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.6 : 0.25,
          shadowRadius: 10,
          elevation: 12,
        },
        tabBarActiveTintColor: colors.primaryAccent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          ...Typography.labelSm,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && [shadows.sunken, { backgroundColor: colors.surfaceSunken }]]}>
              <Home size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && [shadows.sunken, { backgroundColor: colors.surfaceSunken }]]}>
              <Mic size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && [shadows.sunken, { backgroundColor: colors.surfaceSunken }]]}>
              <BarChart2 size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && [shadows.sunken, { backgroundColor: colors.surfaceSunken }]]}>
              <User size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 38,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
