import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator, Animated, Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../hooks/useWallet';
import { useBiometric } from '../../hooks/useBiometric';
import { WalletCard } from '../../components/WalletCard';
import { NetworkBadge } from '../../components/NetworkBadge';
import { ReceiveModal } from '../../components/ReceiveModal';
import { sendSOL, getRecentTransactions } from '../../utils/solana';
import { COLORS, DEFAULT_NETWORK } from '../../constants/network';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { pubkey, balance, loading, loadWallet, refreshBalance, checkSetup, devnetAirdrop, getSigningKeypair } = useWallet();
  const { authenticate } = useBiometric();
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [txHistory, setTxHistory] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const balanceAnim = useRef(new Animated.Value(0)).current;
  const sendSlideAnim = useRef(new Animated.Value(-20)).current;
  const sendOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const done = await checkSetup();
      if (!done) { router.replace('/onboarding'); return; }
      await loadWallet();
    })();
  }, []);

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (balance > 0) {
      Animated.sequence([
        Animated.timing(balanceAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.spring(balanceAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      ]).start();
    }
  }, [balance]);

  useEffect(() => {
    if (showSend) {
      Animated.parallel([
        Animated.spring(sendSlideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
        Animated.timing(sendOpacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(sendSlideAnim, { toValue: -20, tension: 80, friction: 12, useNativeDriver: true }),
        Animated.timing(sendOpacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [showSend]);

  const loadTxHistory = async () => {
    if (!pubkey) return;
    setLoadingTx(true);
    try {
      const txs = await getRecentTransactions(pubkey, DEFAULT_NETWORK);
      setTxHistory(txs);
    } catch { setTxHistory([]); }
    finally { setLoadingTx(false); }
  };

  useEffect(() => {
    if (pubkey) loadTxHistory();
  }, [pubkey]);

  const handleSend = async () => {
    if (!sendTo || !sendAmount) return;
    Alert.alert('Confirm Send', `Send ${sendAmount} SOL to ${sendTo.slice(0, 8)}...${sendTo.slice(-6)}?`, [
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
            Alert.alert('Sent!', `Signature: ${sig.slice(0, 20)}...`, [{ text: 'OK' }]);
            setSendTo(''); setSendAmount(''); setShowSend(false);
            await refreshBalance();
            await loadTxHistory();
          } catch (e: any) { Alert.alert('Error', e.message); }
          finally { setSending(false); }
        }
      }
    ]);
  };

  const scale = balanceAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.08, 1] });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Ionicons name="flower" size={16} color={COLORS.bloom} />
          </View>
          <Text style={styles.appName}>Bloom</Text>
        </View>
        <NetworkBadge network={DEFAULT_NETWORK} />
      </Animated.View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.balanceCard}>
            <ActivityIndicator color={COLORS.primary} size="large" />
          </View>
        ) : pubkey ? (
          <Animated.View style={[styles.balanceCard, { transform: [{ scale }] }]}>
            <WalletCard pubkey={pubkey} balance={balance} network={DEFAULT_NETWORK} onRefresh={async () => { await refreshBalance(); await loadTxHistory(); }} />
          </Animated.View>
        ) : null}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowSend(!showSend)} activeOpacity={0.7}>
            <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(85,72,208,0.15)' }]}>
              <Ionicons name="arrow-up" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => pubkey && setShowReceive(true)} activeOpacity={0.7}>
            <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(38,169,224,0.15)' }]}>
              <Ionicons name="qr-code" size={20} color={COLORS.blue} />
            </View>
            <Text style={styles.actionLabel}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(36,211,125,0.15)' }]}>
              <Ionicons name="swap-horizontal" size={20} color={COLORS.success} />
            </View>
            <Text style={styles.actionLabel}>Swap</Text>
          </TouchableOpacity>

          {DEFAULT_NETWORK === 'devnet' && (
            <TouchableOpacity style={styles.actionBtn} onPress={devnetAirdrop} activeOpacity={0.7}>
              <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(255,171,45,0.15)' }]}>
                <Ionicons name="cloud-download-outline" size={20} color={COLORS.warning} />
              </View>
              <Text style={styles.actionLabel}>Airdrop</Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View style={[styles.sendCard, { opacity: sendOpacityAnim, transform: [{ translateY: sendSlideAnim }] }]}>
          <View style={styles.sendCardHeader}>
            <Ionicons name="send" size={18} color={COLORS.primary} />
            <Text style={styles.sendCardTitle}>Send SOL</Text>
            <TouchableOpacity onPress={() => setShowSend(false)} style={{ marginLeft: 'auto' }}>
              <Ionicons name="close" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <TextInput style={styles.input} placeholder="Recipient address" placeholderTextColor={COLORS.textMuted} value={sendTo} onChangeText={setSendTo} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Amount (SOL)" placeholderTextColor={COLORS.textMuted} value={sendAmount} onChangeText={setSendAmount} keyboardType="decimal-pad" />
          <TouchableOpacity style={[styles.sendBtn, sending && styles.sendBtnDisabled]} onPress={handleSend} disabled={sending} activeOpacity={0.8}>
            {sending ? <ActivityIndicator color="#fff" size="small" /> : (
              <>
                <Ionicons name="finger-print" size={18} color="#fff" />
                <Text style={styles.sendBtnText}>Sign & Send</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={loadTxHistory}>
            <Ionicons name="refresh-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {loadingTx ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : txHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={36} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No activity yet</Text>
          </View>
        ) : (
          txHistory.slice(0, 5).map((tx, i) => (
            <TouchableOpacity key={tx.signature} style={styles.txRow} onPress={() => Alert.alert('Tx', tx.signature)} activeOpacity={0.7}>
              <View style={[styles.txIcon, { backgroundColor: 'rgba(36,211,125,0.1)' }]}>
                <Ionicons name="arrow-up" size={16} color={COLORS.success} />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>Send</Text>
                <Text style={styles.txSig} numberOfLines={1}>{tx.signature.slice(0, 16)}...</Text>
              </View>
              <View style={styles.txRight}>
                <View style={[styles.txDot, { backgroundColor: tx.confirmed ? COLORS.success : COLORS.warning }]} />
                <Text style={styles.txTime}>{tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleDateString() : 'Pending'}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <ReceiveModal visible={showReceive} onClose={() => setShowReceive(false)} pubkey={pubkey || ''} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  scroll: { flex: 1 },
  balanceCard: { marginHorizontal: 16, marginTop: 8 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, gap: 10 },
  actionBtn: { flex: 1, backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  actionIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },
  sendCard: { backgroundColor: COLORS.bgCard, borderRadius: 20, padding: 20, marginHorizontal: 20, marginTop: 16, borderWidth: 1, borderColor: COLORS.border },
  sendCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sendCardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  input: { backgroundColor: COLORS.bgElevated, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { backgroundColor: COLORS.primaryDark, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 32, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { color: COLORS.textMuted, fontSize: 14, marginTop: 12 },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 14, marginHorizontal: 20, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  txIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txTitle: { color: COLORS.text, fontWeight: '600', fontSize: 14, marginBottom: 2 },
  txSig: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'monospace' },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txDot: { width: 6, height: 6, borderRadius: 3 },
  txTime: { color: COLORS.textMuted, fontSize: 11 },
});
