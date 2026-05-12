import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../constants/network';

interface Props {
  pubkey: string;
  balance: number;
  network: string;
  onRefresh: () => void;
}

export function WalletCard({ pubkey, balance, network, onRefresh }: Props) {
  const shortAddr = pubkey ? `${pubkey.slice(0, 8)}...${pubkey.slice(-4)}` : '';

  const copyAddress = async () => {
    await Clipboard.setStringAsync(pubkey);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.solanaBadge}>
          <View style={styles.solanaDot} />
          <Text style={styles.solanaText}>SOLANA</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} activeOpacity={0.7}>
          <Ionicons name="refresh-outline" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.balanceLabel}>Total Balance</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.balance}>{balance.toFixed(4)}</Text>
        <Text style={styles.currency}>SOL</Text>
      </View>

      <TouchableOpacity style={styles.addressRow} onPress={copyAddress} activeOpacity={0.7}>
        <Text style={styles.address}>{shortAddr}</Text>
        <Ionicons name="copy-outline" size={14} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  solanaBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  solanaDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.success },
  solanaText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 1.5 },
  balanceLabel: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 6 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 20 },
  balance: { fontSize: 40, fontWeight: '800', color: COLORS.text },
  currency: { fontSize: 18, color: COLORS.textSecondary, fontWeight: '600' },
  addressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.bgElevated, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  address: { color: COLORS.primary, fontSize: 13, fontFamily: 'monospace', flex: 1 },
});
