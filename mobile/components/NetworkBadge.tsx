import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/network';

export function NetworkBadge({ network }: { network: string }) {
  const isDevnet = network === 'devnet';
  return (
    <View style={[styles.badge, { backgroundColor: isDevnet ? '#2D1B00' : '#001A0D' }]}>
      <View style={[styles.dot, { backgroundColor: isDevnet ? COLORS.warning : COLORS.accent }]} />
      <Text style={[styles.text, { color: isDevnet ? COLORS.warning : COLORS.accent }]}>
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
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
