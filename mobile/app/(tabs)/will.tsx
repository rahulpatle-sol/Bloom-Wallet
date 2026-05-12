import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator, Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../hooks/useWallet';
import { useWill } from '../../hooks/useWill';
import { useBiometric } from '../../hooks/useBiometric';
import { BeneficiaryRow } from '../../components/BeneficiaryRow';
import { COLORS } from '../../constants/network';

export default function WillScreen() {
  const { pubkey, loadWallet, getSigningKeypair } = useWallet();
  const { will, loading, willPDA, daysSinceCheckin, daysUntilExecution, loadWill, initializeWill, checkIn, addBeneficiary, revokeWill } = useWill(pubkey);
  const { authenticate } = useBiometric();

  const [inactivityDays, setInactivityDays] = useState('365');
  const [newBeneficiary, setNewBeneficiary] = useState('');
  const [newPercentage, setNewPercentage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => { loadWallet().then(() => loadWill()); }, []);

  const handleInitWill = async () => {
    const days = parseInt(inactivityDays);
    if (isNaN(days) || days < 1 || days > 3650) { Alert.alert('Invalid', 'Enter days between 1 and 3650'); return; }
    Alert.alert('Create Will?', `Assets auto-transfer after ${days} days of inactivity.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Create', onPress: async () => {
        const sig = await initializeWill(days, getSigningKeypair);
        if (sig) Alert.alert('Will Created!', `Tx: ${sig.slice(0, 20)}...`);
        else Alert.alert('Error', 'Failed to create will');
      }}
    ]);
  };

  const handleCheckIn = async () => {
    const biometricOk = await authenticate('Check in — prove you\'re alive');
    if (!biometricOk) return;
    const sig = await checkIn(getSigningKeypair);
    if (sig) Alert.alert('Checked In!', `Last check-in updated.`);
    else Alert.alert('Error', 'Check-in failed');
  };

  const handleAddBeneficiary = async () => {
    if (!newBeneficiary || !newPercentage) return;
    const pct = parseInt(newPercentage);
    if (isNaN(pct) || pct <= 0 || pct > 100) { Alert.alert('Invalid', 'Percentage must be 1-100'); return; }
    const slot = will?.beneficiaryCount ?? 0;
    const sig = await addBeneficiary(newBeneficiary, pct, slot, getSigningKeypair);
    if (sig) { Alert.alert('Beneficiary Added!'); setNewBeneficiary(''); setNewPercentage(''); setShowAddForm(false); }
    else Alert.alert('Error', 'Failed to add beneficiary');
  };

  const handleRevoke = async () => {
    Alert.alert('Revoke Will?', 'This will permanently deactivate your will. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Revoke', style: 'destructive', onPress: async () => {
        const biometricOk = await authenticate('Revoke will — verify your identity');
        if (!biometricOk) return;
        const sig = await revokeWill(getSigningKeypair);
        if (sig) Alert.alert('Will Revoked!');
        else Alert.alert('Error', 'Failed to revoke will');
      }},
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  const progress = will ? Math.min(100, (daysSinceCheckin / will.inactivityDays) * 100) : 0;
  const isUrgent = will && daysSinceCheckin > will.inactivityDays * 0.8;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Living Will</Text>
          <Text style={styles.subtitle}>Your on-chain inheritance plan</Text>
        </View>
        <View style={styles.willBadge}>
          <Ionicons name="leaf" size={14} color={COLORS.success} />
        </View>
      </View>

      {!will ? (
        <View style={styles.createCard}>
          <View style={styles.createIconWrap}>
            <Ionicons name="document-text-outline" size={36} color={COLORS.primary} />
          </View>
          <Text style={styles.createTitle}>No Will Found</Text>
          <Text style={styles.createDesc}>Create your living will. Assets auto-transfer to beneficiaries after inactivity period.</Text>
          <Text style={styles.label}>Inactivity period (days)</Text>
          <TextInput style={styles.input} value={inactivityDays} onChangeText={setInactivityDays} keyboardType="numeric" placeholderTextColor={COLORS.textMuted} />
          <TouchableOpacity style={styles.btn} onPress={handleInitWill} activeOpacity={0.8}>
            <Ionicons name="finger-print" size={18} color="#fff" />
            <Text style={styles.btnText}>Create Will</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Status */}
          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <View style={[styles.statusDot, { backgroundColor: will.isActive ? COLORS.success : COLORS.danger }]} />
              <Text style={styles.statusText}>{will.isActive ? 'ACTIVE' : 'REVOKED'}</Text>
            </View>
            <View style={styles.statusRight}>
              <TouchableOpacity style={[styles.checkinBtn, { backgroundColor: COLORS.success }]} onPress={handleCheckIn} activeOpacity={0.8}>
                <Ionicons name="heart" size={14} color="#000" />
                <Text style={[styles.checkinBtnText, { color: '#000' }]}>Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.revokeBtn]} onPress={handleRevoke} activeOpacity={0.8}>
                <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Timer Card */}
          <View style={styles.timerCard}>
            <View style={styles.timerHeader}>
              <Ionicons name="time-outline" size={18} color={isUrgent ? COLORS.danger : COLORS.primary} />
              <Text style={styles.timerHeaderText}>Time Remaining</Text>
            </View>
            <View style={styles.timerBig}>
              <Text style={[styles.timerDays, { color: isUrgent ? COLORS.danger : COLORS.text }]}>{daysSinceCheckin}</Text>
              <Text style={styles.timerDaysLabel}>days since check-in</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: isUrgent ? COLORS.danger : COLORS.primary }]} />
            </View>
            <View style={styles.timerMeta}>
              <Text style={styles.timerMetaText}>{will.inactivityDays - daysSinceCheckin} days until execution</Text>
            </View>
          </View>

          {/* Beneficiaries */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Beneficiaries ({will.beneficiaryCount}/5)</Text>
              <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
                <Ionicons name="add-circle" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {will.beneficiaries.length === 0 && (
              <View style={styles.emptyBeneficiary}>
                <Ionicons name="people-outline" size={28} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>No beneficiaries added yet</Text>
              </View>
            )}

            {will.beneficiaries.map((addr, i) => (
              <BeneficiaryRow key={addr} address={addr} percentage={will.percentages[i]} index={i} />
            ))}

            {showAddForm && (
              <View style={styles.addForm}>
                <TextInput style={styles.input} placeholder="Beneficiary wallet address" placeholderTextColor={COLORS.textMuted} value={newBeneficiary} onChangeText={setNewBeneficiary} autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Percentage (e.g. 50)" placeholderTextColor={COLORS.textMuted} value={newPercentage} onChangeText={setNewPercentage} keyboardType="numeric" />
                <TouchableOpacity style={styles.btnSmall} onPress={handleAddBeneficiary} activeOpacity={0.8}>
                  <Text style={styles.btnSmallText}>Add Beneficiary</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* PDA */}
          <View style={styles.pdaCard}>
            <View style={styles.pdaHeader}>
              <Ionicons name="server-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.pdaLabel}>On-chain PDA</Text>
            </View>
            <Text style={styles.pdaValue} selectable numberOfLines={1}>{willPDA}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  headerLeft: {},
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  willBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  createCard: { backgroundColor: COLORS.bgCard, borderRadius: 20, padding: 24, marginHorizontal: 20, borderWidth: 1, borderColor: COLORS.border },
  createIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  createTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  createDesc: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: 20 },
  label: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 8 },
  input: { backgroundColor: COLORS.bgElevated, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  btn: { backgroundColor: COLORS.primaryDark, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnSmall: { backgroundColor: COLORS.primaryDark, borderRadius: 10, padding: 14, alignItems: 'center' },
  btnSmallText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  statusCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12, backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusText: { color: COLORS.text, fontWeight: '700', letterSpacing: 2, fontSize: 13 },
  checkinBtn: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkinBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  revokeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,69,69,0.1)', borderWidth: 1, borderColor: 'rgba(255,69,69,0.2)', alignItems: 'center', justifyContent: 'center' },
  timerCard: { backgroundColor: COLORS.bgCard, borderRadius: 20, padding: 20, marginHorizontal: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  timerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  timerHeaderText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  timerBig: { alignItems: 'center', marginBottom: 16 },
  timerDays: { fontSize: 64, fontWeight: '800' },
  timerDaysLabel: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  progressBar: { width: '100%', height: 6, backgroundColor: COLORS.bgElevated, borderRadius: 3, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  timerMeta: { alignItems: 'center' },
  timerMetaText: { color: COLORS.textMuted, fontSize: 12 },
  section: { marginHorizontal: 20, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  emptyBeneficiary: { alignItems: 'center', paddingVertical: 32, backgroundColor: COLORS.bgCard, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  emptyText: { color: COLORS.textMuted, fontSize: 13, marginTop: 8 },
  addForm: { backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16, marginTop: 8, borderWidth: 1, borderColor: COLORS.border },
  pdaCard: { marginHorizontal: 20, backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  pdaHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  pdaLabel: { color: COLORS.textSecondary, fontSize: 12 },
  pdaValue: { color: COLORS.primary, fontSize: 11, fontFamily: 'monospace' },
});
