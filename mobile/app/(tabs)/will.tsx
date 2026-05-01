import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useWallet } from '../../hooks/useWallet';
import { useWill } from '../../hooks/useWill';
import { useBiometric } from '../../hooks/useBiometric';
import { BeneficiaryRow } from '../../components/BeneficiaryRow';
import { COLORS } from '../../constants/network';

export default function WillScreen() {
  const { pubkey, loadWallet, getSigningKeypair } = useWallet();
  const { will, loading, willPDA, daysSinceCheckin, daysUntilExecution, loadWill, initializeWill, checkIn, addBeneficiary } = useWill(pubkey);
  const { authenticate } = useBiometric();

  const [inactivityDays, setInactivityDays] = useState('365');
  const [newBeneficiary, setNewBeneficiary] = useState('');
  const [newPercentage, setNewPercentage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadWallet().then(() => loadWill());
  }, []);

  const handleInitWill = async () => {
    const days = parseInt(inactivityDays);
    if (isNaN(days) || days < 1 || days > 3650) {
      Alert.alert('Invalid', 'Enter days between 1 and 3650');
      return;
    }
    Alert.alert(
      'Create Will?',
      `Your assets will auto-transfer after ${days} days of inactivity.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async () => {
            const sig = await initializeWill(days, getSigningKeypair);
            if (sig) Alert.alert('Will Created! ✅', `Tx: ${sig.slice(0, 20)}...`);
            else Alert.alert('Error', 'Failed to create will');
          }
        }
      ]
    );
  };

  const handleCheckIn = async () => {
    const biometricOk = await authenticate('Check in — prove you\'re alive');
    if (!biometricOk) return;
    const sig = await checkIn(getSigningKeypair);
    if (sig) Alert.alert('Checked In! ✅', `Last check-in updated.\nTx: ${sig.slice(0, 20)}...`);
    else Alert.alert('Error', 'Check-in failed');
  };

  const handleAddBeneficiary = async () => {
    if (!newBeneficiary || !newPercentage) return;
    const pct = parseInt(newPercentage);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      Alert.alert('Invalid', 'Percentage must be 1-100');
      return;
    }
    const slot = will?.beneficiaryCount ?? 0;
    const sig = await addBeneficiary(newBeneficiary, pct, slot, getSigningKeypair);
    if (sig) {
      Alert.alert('Beneficiary Added! ✅');
      setNewBeneficiary('');
      setNewPercentage('');
      setShowAddForm(false);
    } else {
      Alert.alert('Error', 'Failed to add beneficiary');
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Will</Text>
        <Text style={styles.subtitle}>Your on-chain inheritance plan</Text>
      </View>

      {!will ? (
        // No will exists yet
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚰️ No Will Found</Text>
          <Text style={styles.cardDesc}>
            Create your digital will. If you don't check in for the set period, your assets automatically transfer to your beneficiaries.
          </Text>
          <Text style={styles.label}>Inactivity period (days)</Text>
          <TextInput
            style={styles.input}
            value={inactivityDays}
            onChangeText={setInactivityDays}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textMuted}
          />
          <TouchableOpacity style={styles.btn} onPress={handleInitWill}>
            <Text style={styles.btnText}>🔐 Create Will</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Status card */}
          <View style={styles.statusCard}>
            <View style={[styles.statusDot, { backgroundColor: will.isActive ? COLORS.accent : COLORS.danger }]} />
            <Text style={styles.statusText}>{will.isActive ? 'ACTIVE' : 'REVOKED'}</Text>
          </View>

          {/* Timer */}
          <View style={styles.timerCard}>
            <Text style={styles.timerLabel}>Days since last check-in</Text>
            <Text style={[styles.timerDays, { color: daysSinceCheckin > will.inactivityDays * 0.8 ? COLORS.danger : COLORS.accent }]}>
              {daysSinceCheckin}
            </Text>
            <Text style={styles.timerSub}>/ {will.inactivityDays} days before execution</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {
                width: `${Math.min(100, (daysSinceCheckin / will.inactivityDays) * 100)}%` as any,
                backgroundColor: daysSinceCheckin > will.inactivityDays * 0.8 ? COLORS.danger : COLORS.primary,
              }]} />
            </View>
            <TouchableOpacity style={styles.checkinBtn} onPress={handleCheckIn}>
              <Text style={styles.checkinText}>💓 I'm Alive — Check In</Text>
            </TouchableOpacity>
          </View>

          {/* Beneficiaries */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Beneficiaries ({will.beneficiaryCount}/5)</Text>
              <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
                <Text style={styles.addBtn}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {will.beneficiaries.map((addr, i) => (
              <BeneficiaryRow key={addr} address={addr} percentage={will.percentages[i]} index={i} />
            ))}

            {showAddForm && (
              <View style={styles.addForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Beneficiary wallet address"
                  placeholderTextColor={COLORS.textMuted}
                  value={newBeneficiary}
                  onChangeText={setNewBeneficiary}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Percentage (e.g. 50)"
                  placeholderTextColor={COLORS.textMuted}
                  value={newPercentage}
                  onChangeText={setNewPercentage}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.btn} onPress={handleAddBeneficiary}>
                  <Text style={styles.btnText}>Add Beneficiary</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Will PDA */}
          <View style={styles.pdaCard}>
            <Text style={styles.pdaLabel}>Will PDA Address (on-chain)</Text>
            <Text style={styles.pdaValue} selectable>{willPDA}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  header: { padding: 24, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.text },
  subtitle: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
  card: { margin: 16, backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { color: COLORS.text, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  cardDesc: { color: COLORS.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  label: { color: COLORS.textMuted, fontSize: 13, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 10,
    padding: 14,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { color: COLORS.text, fontWeight: '700', letterSpacing: 2 },
  timerCard: {
    margin: 16,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  timerLabel: { color: COLORS.textMuted, fontSize: 13, marginBottom: 8 },
  timerDays: { fontSize: 64, fontWeight: '900' },
  timerSub: { color: COLORS.textMuted, fontSize: 13, marginBottom: 16 },
  progressBar: { width: '100%', height: 6, backgroundColor: COLORS.bgCardAlt, borderRadius: 3, marginBottom: 20, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  checkinBtn: { backgroundColor: COLORS.accent, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  checkinText: { color: '#000', fontWeight: '800', fontSize: 16 },
  section: { margin: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  addBtn: { color: COLORS.primaryLight, fontWeight: '700', fontSize: 15 },
  addForm: { backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16, marginTop: 8, borderWidth: 1, borderColor: COLORS.border },
  pdaCard: { margin: 16, backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  pdaLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 6 },
  pdaValue: { color: COLORS.primaryLight, fontSize: 11, fontFamily: 'monospace' },
});
