import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { COLORS, DEFAULT_NETWORK } from '../../constants/network';

export default function SettingsScreen() {
  const openExplorer = async (url: string) => {
    await Linking.openURL(url);
  };

  const rows = [
    { label: 'Network', value: DEFAULT_NETWORK === 'devnet' ? '🟡 Devnet (Test)' : '🟢 Mainnet' },
    { label: 'Program', value: 'Vaultis v1.0 (Steel)' },
    { label: 'Key Storage', value: 'expo-secure-store (biometric)' },
    { label: 'Key Scheme', value: "Shamir's SSS (2-of-3)" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Info</Text>
        {rows.map(({ label, value }) => (
          <View key={label} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            ✅ Private key never stored whole{'\n'}
            ✅ Biometric required for every tx{'\n'}
            ✅ Key reconstructed in RAM only{'\n'}
            ✅ No centralized server{'\n'}
            ✅ Open source
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => openExplorer('https://explorer.solana.com/?cluster=devnet')}
        >
          <Text style={styles.linkText}>🔭 Solana Explorer (Devnet)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => openExplorer('https://faucet.solana.com')}
        >
          <Text style={styles.linkText}>🪂 Solana Faucet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>VAULTIS v1.0 — Colosseum Frontier Hackathon</Text>
        <Text style={styles.footerSub}>Built with Steel + Expo SDK 52</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.text, marginBottom: 32 },
  section: { marginBottom: 28 },
  sectionTitle: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.bgCard, padding: 14, borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: COLORS.border },
  rowLabel: { color: COLORS.textMuted, fontSize: 14 },
  rowValue: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  infoCard: { backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  infoText: { color: COLORS.accent, fontSize: 14, lineHeight: 26 },
  linkBtn: { backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  linkText: { color: COLORS.primaryLight, fontWeight: '600', fontSize: 15 },
  footer: { alignItems: 'center', paddingVertical: 32 },
  footerText: { color: COLORS.textMuted, fontSize: 13 },
  footerSub: { color: COLORS.border, fontSize: 11, marginTop: 4 },
});
