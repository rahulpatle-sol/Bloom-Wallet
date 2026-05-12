import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Dimensions, Animated, TextInput
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBiometric } from '../hooks/useBiometric';
import { useWallet } from '../hooks/useWallet';
import { COLORS } from '../constants/network';
import { getShare2Local, storeShare1 } from '../utils/wallet';
import { Keypair } from '@solana/web3.js';

const { width } = Dimensions.get('window');

type Step = 'welcome' | 'recover' | 'biometric' | 'creating' | 'backup' | 'done';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('welcome');
  const [share2, setShare2] = useState('');
  const [share3, setShare3] = useState('');
  const [recoverInput, setRecoverInput] = useState('');
  const [recoverError, setRecoverError] = useState('');
  const [recovering, setRecovering] = useState(false);
  const { isSupported, biometricType, authenticate } = useBiometric();
  const { createWallet } = useWallet();

  const heroAnim = useState(new Animated.Value(0))[0];
  const cardAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(cardAnim, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, []);

  const handleBiometricSetup = async () => {
    const success = await authenticate('Set up Bloom — verify your identity');
    if (!success) { Alert.alert('Authentication failed', 'Please try again'); return; }
    setStep('creating');
    const result = await createWallet();
    if (!result) { Alert.alert('Error', 'Failed to create wallet. Try again.'); setStep('biometric'); return; }
    setShare2(result.share2Base64);
    setShare3(result.share3Base64);
    setStep('backup');
  };

  const handleRecover = async () => {
    if (!recoverInput.trim()) { setRecoverError('Please enter Share 2'); return; }
    setRecovering(true);
    setRecoverError('');
    try {
      const biometricOk = await authenticate('Recover wallet — verify your identity');
      if (!biometricOk) { setRecoverError('Biometric failed. Try again.'); setRecovering(false); return; }

      const share2Buffer = Buffer.from(recoverInput.trim(), 'base64');
      if (!share2Buffer || share2Buffer.length === 0) {
        setRecoverError('Invalid Share 2 format. Check your backup.');
        setRecovering(false);
        return;
      }

      Alert.alert(
        'Import Share 3?',
        'Do you have Share 3 backup too? You need 2 of 3 shares to recover.\n\nTap YES if you have it, NO to skip.',
        [
          { text: 'Skip (use Share 2 only)', onPress: () => {} },
          {
            text: 'Yes, import Share 3',
            onPress: () => {
              Alert.prompt(
                'Enter Share 3',
                'Paste your Share 3 backup:',
                async (share3Input) => {
                  if (share3Input) {
                    try {
                      const share3Buf = Buffer.from(share3Input.trim(), 'base64');
                      const { combine } = await import('../utils/shamir');
                      const secret = new Uint8Array(combine([share2Buffer, share3Buf]));
                      const keypair = Keypair.fromSecretKey(secret);
                      const pubkey = keypair.publicKey.toBase58();
                      secret.fill(0);

                      const { split } = await import('../utils/shamir');
                      const shares = split(Buffer.from(keypair.secretKey), 3, 2);
                      await storeShare1(shares[0]);
                      const { getShare2Local } = await import('../utils/wallet');
                      const s2local = await getShare2Local();
                      if (!s2local) {
                        const { storeShare2Local } = await import('../utils/wallet');
                        await storeShare2Local(shares[1]);
                      }
                      const { storePubkey, markSetupDone } = await import('../utils/wallet');
                      await storePubkey(pubkey);
                      await markSetupDone();

                      Alert.alert('Wallet Recovered!', `Your wallet is back: ${pubkey.slice(0, 8)}...`, [
                        { text: 'Open Wallet', onPress: () => router.replace('/(tabs)') }
                      ]);
                    } catch {
                      setRecoverError('Recovery failed. Check your shares.');
                    }
                    setRecovering(false);
                  }
                },
                'plain-text'
              );
            }
          },
        ]
      );
    } catch (e: any) {
      setRecoverError(e.message || 'Recovery failed');
      setRecovering(false);
    }
  };

  if (step === 'welcome') {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.heroWrap, { opacity: heroAnim, transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }]}>
          <View style={styles.logoWrap}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Ionicons name="flower" size={36} color={COLORS.bloom} />
              </View>
            </View>
          </View>
          <Text style={styles.title}>Bloom</Text>
          <Text style={styles.subtitle}>Your wallet. Your face.{'\n'}Even after you're gone.</Text>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: cardAnim, transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}>
          <View style={styles.features}>
            {[
              ['finger-print', 'No seed phrase', 'Your biometric IS your key'],
              ['document-text', 'Living Will', 'Assets bloom onward when inactive'],
              ['globe-outline', 'Fully decentralized', 'No server, just Solana'],
            ].map(([icon, title, desc]) => (
              <View key={title} style={styles.feature}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={icon as any} size={22} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>{title}</Text>
                  <Text style={styles.featureDesc}>{desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.networkNotice}>
            <View style={styles.devnetDot} />
            <Text style={styles.networkText}>DEVNET — Safe to test</Text>
          </View>

          <TouchableOpacity style={styles.btn} onPress={() => setStep('biometric')} activeOpacity={0.8}>
            <Ionicons name="add-circle" size={18} color="#fff" />
            <Text style={styles.btnText}>Create New Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => setStep('recover')} activeOpacity={0.8}>
            <Ionicons name="refresh" size={18} color={COLORS.primary} />
            <Text style={[styles.btnText, { color: COLORS.primary }]}>Recover Existing Wallet</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  if (step === 'recover') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 40 }]}>
        <Animated.View style={{ opacity: cardAnim }}>
          <View style={styles.backupHeader}>
            <Ionicons name="refresh" size={40} color={COLORS.primary} />
            <Text style={styles.stepTitle}>Recover Your Wallet</Text>
            <Text style={styles.stepDesc}>
              Lost your app? No problem!{'\n\n'}
              Enter your Share 2 backup to restore your wallet. You need 2 of 3 shares.
            </Text>
          </View>

          <View style={styles.shareBox}>
            <View style={styles.shareBoxHeader}>
              <Ionicons name="key" size={16} color={COLORS.warning} />
              <Text style={styles.shareLabel}>Share 2 — Your Recovery Backup</Text>
            </View>
            <TextInput
              style={[styles.input, { fontFamily: 'monospace', fontSize: 12, height: 100, textAlignVertical: 'top' }]}
              placeholder="Paste your Share 2 (base64 string)..."
              placeholderTextColor={COLORS.textMuted}
              value={recoverInput}
              onChangeText={setRecoverInput}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.warningBox}>
            <Ionicons name="warning" size={16} color={COLORS.warning} />
            <Text style={styles.warningText}>
              If you only have Share 2, you need your device (Share 1 biometric) too.{'\n\n'}
              If you lost your device too, you need Share 2 + Share 3.
            </Text>
          </View>

          {recoverError ? (
            <View style={[styles.warningBox, { backgroundColor: 'rgba(255,69,69,0.1)', borderColor: 'rgba(255,69,69,0.2)' }]}>
              <Ionicons name="close-circle" size={16} color={COLORS.danger} />
              <Text style={[styles.warningText, { color: COLORS.danger }]}>{recoverError}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={[styles.btn, recovering && styles.btnDisabled]} onPress={handleRecover} disabled={recovering} activeOpacity={0.8}>
            {recovering ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="finger-print" size={18} color="#fff" />
                <Text style={styles.btnText}>Authenticate & Recover</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnSecondary, { marginTop: 10 }]} onPress={() => { setRecoverInput(''); setRecoverError(''); setStep('welcome'); }} activeOpacity={0.8}>
            <Text style={[styles.btnText, { color: COLORS.primary }]}>Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    );
  }

  if (step === 'biometric') {
    return (
      <View style={styles.container}>
        <Text style={styles.stepTitle}>Set up {biometricType}</Text>
        <Text style={styles.stepDesc}>
          Bloom uses {biometricType} to protect your wallet.{'\n\n'}
          Your biometric data never leaves your device.
        </Text>

        <Animated.View style={[styles.biometricArtWrap, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.biometricCircle}>
            <View style={styles.biometricInner}>
              <Ionicons name="finger-print" size={64} color={COLORS.primary} />
            </View>
            <View style={styles.biometricRing1} />
            <View style={styles.biometricRing2} />
            <View style={styles.biometricRing3} />
          </View>
          <View style={styles.floatingEmojis}>
            <Animated.Text style={[styles.floatingEmoji, styles.fe1]}>🔐</Animated.Text>
            <Animated.Text style={[styles.floatingEmoji, styles.fe2]}>🛡️</Animated.Text>
            <Animated.Text style={[styles.floatingEmoji, styles.fe3]}>💎</Animated.Text>
            <Animated.Text style={[styles.floatingEmoji, styles.fe4]}>✨</Animated.Text>
          </View>
        </Animated.View>

        <Text style={styles.biometricTip}>
          {biometricType === 'Face ID' ? '👆 Point your camera at your face' : '👆 Touch your fingerprint sensor'}
        </Text>

        {!isSupported && (
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={16} color={COLORS.warning} />
            <Text style={styles.warningText}>Biometric not available on this device.</Text>
          </View>
        )}
        <TouchableOpacity style={[styles.btn, !isSupported && styles.btnDisabled]} onPress={handleBiometricSetup} disabled={!isSupported} activeOpacity={0.8}>
          <Ionicons name="finger-print" size={18} color="#fff" />
          <Text style={styles.btnText}>Enable {biometricType} & Create Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'creating') {
    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.creatingWrap}>
          <View style={styles.creatingSpinner}>
            <Ionicons name="flower" size={48} color={COLORS.bloom} />
          </View>
          <Animated.View style={[styles.creatingPulse]} />
        </View>
        <Text style={styles.creatingTitle}>Planting your wallet...</Text>
        <Text style={styles.creatingSub}>Growing secure keys on Solana 🌱</Text>
      </View>
    );
  }

  if (step === 'backup') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backupHeader}>
          <View style={styles.backupIconWrap}>
            <Ionicons name="shield-checkmark" size={36} color={COLORS.success} />
          </View>
          <Text style={styles.stepTitle}>Backup Your Key</Text>
          <Text style={styles.stepDesc}>
            Your key is split into 3 shares. Share 1 is biometric-locked on your device.{'\n\n'}
            Copy Share 2 below and save it somewhere safe.
          </Text>
        </View>
        <View style={styles.shareBox}>
          <View style={styles.shareBoxHeader}>
            <Ionicons name="key" size={16} color={COLORS.warning} />
            <Text style={styles.shareLabel}>Share 2 — SAVE THIS!</Text>
          </View>
          <Text style={styles.shareValue} selectable>{share2}</Text>
        </View>
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={16} color={COLORS.warning} />
          <Text style={styles.warningText}>If you lose Share 2 and your device, funds are GONE forever.</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => setStep('done')} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.btnText}>I've saved it — Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (step === 'done') {
    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.doneWrap}>
          <View style={styles.doneCircle}>
            <Ionicons name="checkmark" size={48} color={COLORS.success} />
          </View>
          <View style={styles.donePetals}>
            <Text style={styles.donePetal}>🌸</Text>
            <Text style={styles.donePetal}>🌺</Text>
            <Text style={styles.donePetal}>🌼</Text>
            <Text style={styles.donePetal}>🌻</Text>
          </View>
        </View>
        <Text style={styles.stepTitle}>Wallet Ready!</Text>
        <Text style={styles.stepDesc}>Welcome to Bloom. Your wallet is secured on Solana.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.8}>
          <Text style={styles.btnText}>Open Wallet</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 24, paddingTop: 80 },
  center: { alignItems: 'center', justifyContent: 'center' },
  heroWrap: { alignItems: 'center', marginBottom: 40 },
  logoWrap: { marginBottom: 20 },
  logoOuter: { width: 100, height: 100, borderRadius: 28, borderWidth: 1.5, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgCard, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20 },
  logoInner: { width: 72, height: 72, borderRadius: 20, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 42, fontWeight: '800', color: COLORS.text, letterSpacing: -1, marginBottom: 8 },
  subtitle: { fontSize: 17, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 26 },
  card: { backgroundColor: COLORS.bgCard, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  features: { gap: 20, marginBottom: 28 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  featureTitle: { color: COLORS.text, fontWeight: '700', fontSize: 16, marginBottom: 2 },
  featureDesc: { color: COLORS.textSecondary, fontSize: 13 },
  networkNotice: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,171,45,0.1)', borderRadius: 10, padding: 12, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,171,45,0.2)' },
  devnetDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.warning },
  networkText: { color: COLORS.warning, fontSize: 13, fontWeight: '600' },
  btn: { backgroundColor: COLORS.primaryDark, borderRadius: 14, padding: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginBottom: 12 },
  btnSecondary: { backgroundColor: COLORS.bgElevated, borderWidth: 1, borderColor: COLORS.primary, marginBottom: 0 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  stepTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 16, textAlign: 'center' },
  stepDesc: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 24, marginBottom: 32, textAlign: 'center' },
  biometricArtWrap: { alignItems: 'center', marginBottom: 24 },
  biometricCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.primary, position: 'relative' },
  biometricInner: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center' },
  biometricRing1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 1, borderColor: 'rgba(171,159,242,0.3)' },
  biometricRing2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 0.5, borderColor: 'rgba(171,159,242,0.15)' },
  biometricRing3: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 0.5, borderColor: 'rgba(171,159,242,0.08)' },
  floatingEmojis: { position: 'relative', width: 0, height: 0 },
  floatingEmoji: { position: 'absolute', fontSize: 20 },
  fe1: { top: -10, left: -60, transform: [{ rotate: '-15deg' }] },
  fe2: { top: 30, left: -70, transform: [{ rotate: '10deg' }] },
  fe3: { top: -10, left: 40, transform: [{ rotate: '20deg' }] },
  fe4: { top: 30, left: 50, transform: [{ rotate: '-5deg' }] },
  biometricTip: { textAlign: 'center', color: COLORS.textSecondary, fontSize: 14, marginBottom: 24, fontStyle: 'italic' },
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(255,69,69,0.1)', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,69,69,0.2)' },
  warningText: { color: COLORS.danger, fontSize: 13, flex: 1, lineHeight: 20 },
  backupHeader: { alignItems: 'center', marginBottom: 24 },
  backupIconWrap: { width: 72, height: 72, borderRadius: 20, backgroundColor: COLORS.bgCard, borderWidth: 1.5, borderColor: COLORS.success, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  shareBox: { backgroundColor: COLORS.bgElevated, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  shareBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  shareLabel: { color: COLORS.warning, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  shareValue: { color: COLORS.bloom, fontSize: 11, fontFamily: 'monospace', lineHeight: 18 },
  input: { backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  creatingWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  creatingSpinner: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.bgCard, borderWidth: 1.5, borderColor: COLORS.bloom, alignItems: 'center', justifyContent: 'center' },
  creatingPulse: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.bloom, opacity: 0.3 },
  creatingTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  creatingSub: { color: COLORS.textSecondary, fontSize: 14 },
  doneWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 32, position: 'relative' },
  doneCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: COLORS.bgCard, borderWidth: 2, borderColor: COLORS.success, alignItems: 'center', justifyContent: 'center' },
  donePetals: { position: 'absolute', width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  donePetal: { position: 'absolute', fontSize: 24 },
});