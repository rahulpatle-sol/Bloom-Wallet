import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../../constants/network';
import { getPubkey, getShare2Local } from '../../utils/wallet';

export default function SettingsScreen() {
  const [pubkey, setPubkey] = useState('');
  const [share2, setShare2] = useState('');
  const [showShare2, setShowShare2] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const pk = await getPubkey();
      const s2 = await getShare2Local();
      setPubkey(pk || '');
      setShare2(s2 ? s2.toString('base64') : '');
      setLoading(false);
    })();
  }, []);

const copyAddress = async () => {
    if (!pubkey) return;
    await Clipboard.setStringAsync(pubkey);
    Alert.alert('Copied!', 'Wallet address copied to clipboard');
  };

  const saveShare2ToFile = async () => {
    if (!share2) return;
    try {
      const fileName = `bloom_share2_${pubkey.slice(0, 8)}.txt`;
      const dirUri = FileSystem.Paths.document?.uri;
      if (!dirUri) { Alert.alert('Error', 'Cannot access document directory'); return; }
      const fileUri = dirUri + fileName;
      await FileSystem.writeAsStringAsync(fileUri, share2, { encoding: 'utf8' });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Save Bloom Share 2 Backup',
        });
      } else {
        Alert.alert('Saved!', `Share 2 saved to:\n${fileName}\n\nYou can find it in Files app.`);
      }
    } catch (e: any) {
      Alert.alert('Error', 'Could not save file: ' + e.message);
    }
  };

  const importShare2FromFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
        copyToCacheDirectory: true,
      });

      const assets = result.assets;
      if (result.canceled || !assets || assets.length === 0) return;
      const file = assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri);
      if (!content || content.length < 10) {
        Alert.alert('Error', 'Invalid file content');
        return;
      }

      const trimmed = content.trim();
      const validateBase64 = (str: string): boolean => {
        try { return btoa(atob(str)) === str; } catch { return false; }
      };
      if (!validateBase64(trimmed)) {
        Alert.alert('Error', 'File does not contain a valid Share 2 key');
        return;
      }

      Alert.alert(
        'Import Share 2?',
        'This will replace your current Share 2 backup. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            onPress: async () => {
              const { storeShare2Local } = await import('../../utils/wallet');
              const binaryStr = atob(trimmed);
              const bytes = Buffer.from(binaryStr);
              await storeShare2Local(bytes);
              setShare2(trimmed);
              Alert.alert('Imported!', 'Share 2 has been updated from file.');
            },
          },
        ]
      );
    } catch (e: any) {
      Alert.alert('Error', 'Could not read file: ' + e.message);
    }
  };

  const openExplorer = async (url: string) => { await Linking.openURL(url); };

  const securityItems = [
    ['checkmark-circle', 'Key never stored whole'],
    ['finger-print', 'Biometric required for every tx'],
    ['server-outline', 'Key in RAM only — wiped after sign'],
    ['globe-outline', 'No centralized server'],
    ['code-slash-outline', 'Open source'],
  ];

  const rows = [
    ['globe-outline', 'Network', 'Devnet (Test)'],
    ['code-slash-outline', 'Program', 'Bloom v1.0'],
    ['key-outline', 'Key Storage', 'Secure-store'],
    ['git-branch-outline', 'Key Scheme', "Shamir SSS (2-of-3)"],
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Settings</Text>

      {/* Wallet Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Wallet</Text>
        <View style={styles.card}>
          <View style={styles.walletRow}>
            <View style={styles.walletLeft}>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.walletLabel}>Wallet Address</Text>
                <Text style={styles.walletAddress} numberOfLines={1}>{pubkey || 'Not set'}</Text>
              </View>
            </View>
            <View style={styles.walletActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={copyAddress} activeOpacity={0.7}>
                <Ionicons name="copy-outline" size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => Linking.openURL(`https://explorer.solana.com/address/${pubkey}?cluster=devnet`)} activeOpacity={0.7}>
                <Ionicons name="open-outline" size={18} color={COLORS.blue} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Share 2 Backup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recovery Backup</Text>
        <View style={styles.card}>
          <View style={styles.share2Header}>
            <View style={styles.share2IconWrap}>
              <Ionicons name="key" size={20} color={COLORS.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.share2Title}>Share 2</Text>
              <Text style={styles.share2Desc}>Your recovery backup — save it safely!</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowShare2(!showShare2)} activeOpacity={0.7}>
            <Ionicons name={showShare2 ? 'eye-off-outline' : 'eye-outline'} size={16} color={COLORS.textSecondary} />
            <Text style={styles.toggleText}>{showShare2 ? 'Hide Share 2' : 'Show Share 2'}</Text>
          </TouchableOpacity>

          {showShare2 && (
            <View style={styles.share2Box}>
              <Text style={styles.share2Value} selectable>{share2 || 'Not available'}</Text>
            </View>
          )}

          <View style={styles.share2Actions}>
            <TouchableOpacity style={styles.actionCard} onPress={saveShare2ToFile} activeOpacity={0.7}>
              <Ionicons name="download-outline" size={22} color={COLORS.success} />
              <Text style={styles.actionCardText}>Save to File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={importShare2FromFile} activeOpacity={0.7}>
              <Ionicons name="cloud-upload-outline" size={22} color={COLORS.blue} />
              <Text style={styles.actionCardText}>Import from File</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.warningBox}>
            <Ionicons name="warning" size={14} color={COLORS.warning} />
            <Text style={styles.warningText}>
              Share 2 + Share 3 = recover your wallet without device. Keep it safe!
            </Text>
          </View>
        </View>
      </View>

      {/* Wallet Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Info</Text>
        <View style={styles.card}>
          {rows.map(([icon, label, value], i) => (
            <View key={label} style={[styles.row, i < rows.length - 1 && styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <Ionicons name={icon as any} size={18} color={COLORS.primary} />
                <Text style={styles.rowLabel}>{label}</Text>
              </View>
              <Text style={styles.rowValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          {securityItems.map(([icon, text], i) => (
            <View key={text} style={[styles.secRow, i < securityItems.length - 1 && styles.rowBorder]}>
              <Ionicons name={icon as any} size={16} color={COLORS.success} />
              <Text style={styles.secText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>
        <TouchableOpacity style={styles.linkCard} onPress={() => openExplorer('https://explorer.solana.com/?cluster=devnet')} activeOpacity={0.7}>
          <Ionicons name="compass-outline" size={20} color={COLORS.primary} />
          <Text style={styles.linkText}>Solana Explorer</Text>
          <Ionicons name="open-outline" size={14} color={COLORS.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkCard} onPress={() => openExplorer('https://faucet.solana.com')} activeOpacity={0.7}>
          <Ionicons name="water-outline" size={20} color={COLORS.blue} />
          <Text style={styles.linkText}>Solana Faucet</Text>
          <Ionicons name="open-outline" size={14} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLogo}>
          <Ionicons name="flower" size={16} color={COLORS.bloom} />
          <Text style={styles.footerText}>Bloom v1.0</Text>
        </View>
        <Text style={styles.footerSub}>Colosseum Frontier Hackathon</Text>
      </View>
    </ScrollView>
  );
}

const Buffer = require('buffer').Buffer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 28 },
  section: { marginBottom: 28 },
  sectionTitle: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12, textTransform: 'uppercase' },
  card: { backgroundColor: COLORS.bgCard, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  walletRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  walletLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  walletIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center' },
  walletLabel: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 2 },
  walletAddress: { color: COLORS.primary, fontSize: 12, fontFamily: 'monospace', maxWidth: 220 },
  walletActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  share2Header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  share2IconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,171,45,0.1)', alignItems: 'center', justifyContent: 'center' },
  share2Title: { color: COLORS.text, fontWeight: '700', fontSize: 16, marginBottom: 2 },
  share2Desc: { color: COLORS.textSecondary, fontSize: 12 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.bgElevated, borderRadius: 10, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  toggleText: { color: COLORS.textSecondary, fontSize: 13 },
  share2Box: { backgroundColor: COLORS.bgElevated, borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  share2Value: { color: COLORS.bloom, fontSize: 10, fontFamily: 'monospace', lineHeight: 16 },
  share2Actions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionCard: { flex: 1, backgroundColor: COLORS.bgElevated, borderRadius: 12, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border },
  actionCardText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600' },
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(255,171,45,0.08)', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(255,171,45,0.15)' },
  warningText: { color: COLORS.warning, fontSize: 12, flex: 1, lineHeight: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { color: COLORS.textSecondary, fontSize: 14 },
  rowValue: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  secRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 },
  secText: { color: COLORS.success, fontSize: 14, flex: 1 },
  linkCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  linkText: { flex: 1, color: COLORS.text, fontSize: 15, fontWeight: '600' },
  footer: { alignItems: 'center', paddingVertical: 32 },
  footerLogo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  footerText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  footerSub: { color: COLORS.textMuted, fontSize: 12 },
});
