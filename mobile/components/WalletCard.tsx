import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../constants/network';

interface Props {
  pubkey: string;
  balance: number;
  network: string;
  onRefresh: () => void;
}

export function WalletCard({ pubkey, balance, network, onRefresh }: Props) {
  const shortAddr = pubkey ? `${pubkey.slice(0, 6)}...${pubkey.slice(-4)}` : '';

  const copyAddress = async () => {
    await Clipboard.setStringAsync(pubkey);
  };

  return (
    <View style={styles.card}>
      <View style={styles.networkRow}>
        <View style={[styles.dot, { backgroundColor: network === 'devnet' ? COLORS.warning : COLORS.accent }]} />
        <Text style={styles.networkText}>{network.toUpperCase()}</Text>
      </View>

      <Text style={styles.balanceLabel}>Balance</Text>
      <Text style={styles.balance}>{balance.toFixed(4)} SOL</Text>

      <TouchableOpacity style={styles.addressRow} onPress={copyAddress} activeOpacity={0.7}>
        <Text style={styles.address}>{shortAddr}</Text>
        <Text style={styles.copy}>⎘ Copy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
        <Text style={styles.refreshText}>↻ Refresh</Text>
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
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  networkText: {
    color: COLORS.textMuted,
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  balanceLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  balance: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: '700',
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  address: {
    color: COLORS.primaryLight,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  copy: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  refreshBtn: {
    alignItems: 'center',
  },
  refreshText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
