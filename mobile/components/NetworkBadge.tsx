import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/network';

export function NetworkBadge({ network }: { network: string }) {
  const isDevnet = network === 'devnet';
  return (
    <View style={[styles.badge, { backgroundColor: isDevnet ? 'rgba(255,171,45,0.12)' : 'rgba(36,211,125,0.12)' }]}>
      <View style={[styles.dot, { backgroundColor: isDevnet ? COLORS.warning : COLORS.success }]} />
      <Text style={[styles.text, { color: isDevnet ? COLORS.warning : COLORS.success }]}>
        {isDevnet ? 'DEVNET' : 'MAINNET'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
});
