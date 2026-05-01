import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
        <Text style={styles.pctText}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  indexText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  address: {
    flex: 1,
    color: COLORS.text,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  pctBadge: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pctText: {
    color: COLORS.primaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
});
