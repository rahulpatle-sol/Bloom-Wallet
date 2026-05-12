import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/network';

interface Props {
  address: string;
  percentage: number;
  index: number;
}

export function BeneficiaryRow({ address, percentage, index }: Props) {
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <View style={styles.row}>
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
      <Text style={styles.address}>{short}</Text>
      <View style={styles.pctBadge}>
        <Ionicons name="person-outline" size={10} color={COLORS.primary} />
        <Text style={styles.pctText}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  indexBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  indexText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  address: { flex: 1, color: COLORS.text, fontFamily: 'monospace', fontSize: 14 },
  pctBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.bgElevated, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  pctText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
});
