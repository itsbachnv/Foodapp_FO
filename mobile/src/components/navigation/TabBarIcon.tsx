import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface TabBarIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}

export function TabBarIcon({ icon, label, focused }: TabBarIconProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
        <Ionicons name={icon} size={focused ? 21 : 20} color={focused ? '#fff' : Colors.textLight} />
      </View>
      <Text style={[styles.label, focused && styles.labelFocused]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapFocused: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '600',
  },
  labelFocused: {
    color: Colors.primary,
    fontWeight: '800',
  },
});
