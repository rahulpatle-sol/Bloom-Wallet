import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useBiometric } from '../hooks/useBiometric';
import { useWallet } from '../hooks/useWallet';
import { COLORS, DEFAULT_NETWORK } from '../constants/network';

type Step = 'welcome' | 'biometric' | 'creating' | 'backup' | 'done';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('welcome');
  const [share2, setShare2] = useState('');
  const [share3, setShare3] = useState('');
  const { isSupported, biometricType, authenticate } = useBiometric();
  const { createWallet, loading } = useWallet();

  const handleBiometricSetup = async () => {
    const success = await authenticate('Set up Vaultis — verify your identity');
    if (!success) {
      Alert.alert('Authentication failed', 'Please try again');
      return;
    }
    setStep('creating');
    const result = await createWallet();
    if (!result) {
      Alert.alert('Error', 'Failed to create wallet. Try again.');
      setStep('biometric');
      return;
    }
    setShare2(result.share2Base64);
    setShare3(result.share3Base64);
    setStep('backup');
  };

  if (step === 'welcome') {
    return (
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.logo}>🔐</Text>
          <Text style={styles.title}>Vaultis</Text>
          <Text style={styles.subtitle}>Your wallet. Your face.{'\n'}Even after you're gone.</Text>
        </View>

        <View style={styles.features}>
          {[
            ['🧬', 'No seed phrase', 'Your biometric IS your key'],
            ['💀', 'Digital Will', 'Assets auto-transfer when you\'re inactive'],
            ['🔓', 'Fully decentralized', 'No server, no company, just Solana'],
          ].map(([icon, title, desc]) => (
            <View key={title} style={styles.feature}>
              <Text style={styles.featureIcon}>{icon}</Text>
              <View>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDesc}>{desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.networkNotice}>
          <Text style={styles.networkText}>🟡 Running on DEVNET — safe to test</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => setStep('biometric')}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'biometric') {
    return (
      <View style={styles.container}>
        <Text style={styles.stepTitle}>Set up {biometricType}</Text>
        <Text style={styles.stepDesc}>
          Vaultis uses {biometricType} to protect your wallet.{'\n\n'}
          Your biometric data never leaves your device — it unlocks your key share stored locally.
        </Text>
        <Text style={styles.emoji}>👁️</Text>
        {!isSupported && (
          <Text style={styles.warning}>
            ⚠️ Biometric not available on this device. Please enable Face ID or fingerprint in Settings.
          </Text>
        )}
        <TouchableOpacity
          style={[styles.btn, !isSupported && styles.btnDisabled]}
          onPress={handleBiometricSetup}
          disabled={!isSupported}
        >
          <Text style={styles.btnText}>Enable {biometricType} & Create Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'creating') {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.stepDesc}>Creating your wallet securely...</Text>
      </View>
    );
  }

  if (step === 'backup') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.stepTitle}>Back Up Your Recovery Key</Text>
        <Text style={styles.stepDesc}>
          Your key is split into 3 shares. Share 1 is on your device (biometric-locked).{'\n\n'}
          Copy Share 2 below and save it somewhere safe (Google Drive, notes, etc). You need 2-of-3 shares to recover.
        </Text>
        <View style={styles.shareBox}>
          <Text style={styles.shareLabel}>Share 2 (Save this!)</Text>
          <Text style={styles.shareValue} selectable>{share2}</Text>
        </View>
        <Text style={styles.warning}>
          ⚠️ If you lose Share 2 and your device, your funds are GONE forever. Back this up NOW.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => setStep('done')}>
          <Text style={styles.btnText}>I've saved it — Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (step === 'done') {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emoji}>✅</Text>
        <Text style={styles.stepTitle}>Wallet Ready!</Text>
        <Text style={styles.stepDesc}>Welcome to Vaultis. Your wallet is protected by your biometric and secured on Solana.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.btnText}>Open Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 24,
    paddingTop: 80,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 42, fontWeight: '800', color: COLORS.primaryLight, letterSpacing: 2 },
  subtitle: { fontSize: 18, color: COLORS.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 26 },
  features: { gap: 20, marginBottom: 40 },
  feature: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  featureIcon: { fontSize: 28 },
  featureTitle: { color: COLORS.text, fontWeight: '700', fontSize: 16 },
  featureDesc: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  networkNotice: { backgroundColor: '#2D1B00', borderRadius: 10, padding: 12, marginBottom: 24 },
  networkText: { color: COLORS.warning, fontSize: 13, textAlign: 'center' },
  btn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 18, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  stepTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  stepDesc: { color: COLORS.textMuted, fontSize: 15, lineHeight: 24, marginBottom: 32 },
  emoji: { fontSize: 72, textAlign: 'center', marginBottom: 24 },
  warning: { color: COLORS.warning, fontSize: 13, backgroundColor: '#2D1B00', padding: 12, borderRadius: 10, marginBottom: 24 },
  shareBox: { backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  shareLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 8 },
  shareValue: { color: COLORS.primaryLight, fontSize: 12, fontFamily: 'monospace', lineHeight: 18 },
});
