import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useWallet } from '../../hooks/useWallet';
import { useBiometric } from '../../hooks/useBiometric';
import { WalletCard } from '../../components/WalletCard';
import { NetworkBadge } from '../../components/NetworkBadge';
import { sendSOL } from '../../utils/solana';
import { COLORS, DEFAULT_NETWORK } from '../../constants/network';

export default function HomeScreen() {
  const { pubkey, balance, loading, loadWallet, refreshBalance, checkSetup, devnetAirdrop, getSigningKeypair } = useWallet();
  const { authenticate } = useBiometric();
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [showSend, setShowSend] = useState(false);

  useEffect(() => {
    (async () => {
      const done = await checkSetup();
      if (!done) {
        router.replace('/onboarding');
        return;
      }
      await loadWallet();
    })();
  }, []);

  const handleSend = async () => {
    if (!sendTo || !sendAmount) return;
    Alert.alert(
      'Confirm Send',
      `Send ${sendAmount} SOL to\n${sendTo.slice(0, 8)}...${sendTo.slice(-6)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setSending(true);
            try {
              const biometricOk = await authenticate('Confirm transaction');
              if (!biometricOk) { Alert.alert('Cancelled'); return; }
              const keypair = await getSigningKeypair();
              if (!keypair) throw new Error('Could not unlock wallet');
              const sig = await sendSOL(keypair, sendTo, parseFloat(sendAmount), DEFAULT_NETWORK);
              Alert.alert('Sent! ✅', `Signature:\n${sig.slice(0, 20)}...`);
              setSendTo('');
              setSendAmount('');
              setShowSend(false);
              await refreshBalance();
            } catch (e: any) {
              Alert.alert('Error', e.message);
            } finally {
              setSending(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.appName}>VAULTIS</Text>
        <NetworkBadge network={DEFAULT_NETWORK} />
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : pubkey ? (
        <WalletCard
          pubkey={pubkey}
          balance={balance}
          network={DEFAULT_NETWORK}
          onRefresh={refreshBalance}
        />
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowSend(!showSend)}>
          <Text style={styles.actionIcon}>↗</Text>
          <Text style={styles.actionLabel}>Send</Text>
        </TouchableOpacity>

        {DEFAULT_NETWORK === 'devnet' && (
          <TouchableOpacity style={styles.actionBtn} onPress={devnetAirdrop} disabled={loading}>
            <Text style={styles.actionIcon}>🪂</Text>
            <Text style={styles.actionLabel}>Airdrop</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Send Form */}
      {showSend && (
        <View style={styles.sendForm}>
          <Text style={styles.sendTitle}>Send SOL</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipient address"
            placeholderTextColor={COLORS.textMuted}
            value={sendTo}
            onChangeText={setSendTo}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Amount (SOL)"
            placeholderTextColor={COLORS.textMuted}
            value={sendAmount}
            onChangeText={setSendAmount}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={[styles.sendBtn, sending && styles.disabled]}
            onPress={handleSend}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendBtnText}>🔐 Biometric & Send</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Explorer Link Info */}
      {pubkey && (
        <View style={styles.explorerCard}>
          <Text style={styles.explorerLabel}>View on Solana Explorer</Text>
          <Text style={styles.explorerLink} selectable>
            https://explorer.solana.com/address/{pubkey}?cluster=devnet
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  appName: { color: COLORS.primaryLight, fontSize: 22, fontWeight: '900', letterSpacing: 4 },
  actions: { flexDirection: 'row', gap: 12, padding: 16, marginTop: 16 },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: { fontSize: 24, color: COLORS.primaryLight, marginBottom: 4 },
  actionLabel: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  sendForm: {
    margin: 16,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendTitle: { color: COLORS.text, fontWeight: '700', fontSize: 18, marginBottom: 16 },
  input: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 10,
    padding: 14,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: 'monospace',
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  sendBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.6 },
  explorerCard: {
    margin: 16,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  explorerLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 6 },
  explorerLink: { color: COLORS.primaryLight, fontSize: 11, fontFamily: 'monospace' },
});
