import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Share, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../constants/network';

interface ReceiveModalProps {
  visible: boolean;
  onClose: () => void;
  pubkey: string;
}

export function ReceiveModal({ visible, onClose, pubkey }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(pubkey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: pubkey });
    } catch {
      Alert.alert('Address', pubkey);
    }
  };

  const shortPub = pubkey
    ? `${pubkey.slice(0, 12)}...${pubkey.slice(-8)}`
    : 'Loading...';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Receive SOL</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            {pubkey ? (
              <View style={styles.qrWrapper}>
                <QRCode
                  value={pubkey}
                  size={220}
                  backgroundColor={COLORS.bg}
                  color={COLORS.text}
                />
              </View>
            ) : (
              <View style={styles.qrPlaceholder}>
                <ActivityIndicator color={COLORS.primary} size="large" />
              </View>
            )}
          </View>

          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Your Address</Text>
            <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">{shortPub}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCopy} activeOpacity={0.7}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(85,72,208,0.15)' }]}>
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={20} color={copied ? COLORS.success : COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>{copied ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(36,211,125,0.15)' }]}>
                <Ionicons name="share-social-outline" size={20} color={COLORS.success} />
              </View>
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert('Explorer', `https://solscan.io/account/${pubkey}?cluster=devnet`)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(38,169,224,0.15)' }]}>
                <Ionicons name="open-outline" size={20} color={COLORS.blue} />
              </View>
              <Text style={styles.actionLabel}>Explorer</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>Share this address to receive SOL tokens on the Solana network.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.bgElevated, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 48, paddingHorizontal: 24 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  closeBtn: { padding: 4 },
  qrContainer: { alignItems: 'center', marginBottom: 24 },
  qrWrapper: { padding: 20, backgroundColor: COLORS.bg, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  qrPlaceholder: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  addressBox: { backgroundColor: COLORS.bg, borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  addressLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  address: { fontSize: 13, color: COLORS.text, fontFamily: 'monospace' },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  actionBtn: { flex: 1, backgroundColor: COLORS.bg, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  hint: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
});