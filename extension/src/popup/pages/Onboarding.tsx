import React, { useState } from 'react';
import { setupWallet, createCredential } from '../../utils/wallet';

interface Props { onComplete: () => void; }

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<'welcome' | 'biometric' | 'backup' | 'done'>('welcome');
  const [share2, setShare2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    try {
      // WebAuthn credential — biometric in browser
      await createCredential();
      const result = await setupWallet();
      setShare2(result.share2Base64);
      setStep('backup');
    } catch (e: any) {
      setError(e.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  const C = { bg: '#0A0A1A', card: '#12122A', border: '#2D2D5E', primary: '#7C3AED', primaryLight: '#A78BFA', text: '#F1F5F9', muted: '#94A3B8', accent: '#06D6A0', warning: '#F59E0B' };

  if (step === 'welcome') return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: C.primaryLight, letterSpacing: 3, marginBottom: 8 }}>VAULTIS</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Biometric Solana wallet{'\n'}+ Digital Will on Devnet</div>
      <div style={{ background: '#2D1B00', borderRadius: 8, padding: 10, marginBottom: 20, color: C.warning, fontSize: 12 }}>
        🟡 DEVNET — Safe to test
      </div>
      <button onClick={() => setStep('biometric')} style={btnStyle(C.primary)}>Get Started</button>
    </div>
  );

  if (step === 'biometric') return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>👁️</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Enable Biometric</div>
      <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
        Your browser's biometric (Touch ID, Windows Hello) will protect your wallet. Your face/fingerprint never leaves your device.
      </div>
      {error && <div style={{ color: '#EF4444', background: '#1A0000', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 12 }}>{error}</div>}
      <button onClick={handleSetup} disabled={loading} style={btnStyle(C.primary)}>
        {loading ? 'Setting up...' : '🔐 Enable Biometric & Create Wallet'}
      </button>
    </div>
  );

  if (step === 'backup') return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Save Recovery Key</div>
      <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
        Copy Share 2 below and store it safely. You need 2-of-3 shares to recover your wallet.
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>SHARE 2 — SAVE THIS</div>
        <div style={{ color: C.primaryLight, fontSize: 10, fontFamily: 'monospace', wordBreak: 'break-all', userSelect: 'all' }}>{share2}</div>
      </div>
      <div style={{ background: '#2D1B00', borderRadius: 8, padding: 10, marginBottom: 16, color: C.warning, fontSize: 12 }}>
        ⚠️ Without Share 2 + your device, funds are GONE.
      </div>
      <button onClick={() => { setStep('done'); onComplete(); }} style={btnStyle(C.primary)}>I've saved it — Open Wallet</button>
    </div>
  );

  return null;
}

function btnStyle(bg: string): React.CSSProperties {
  return { width: '100%', background: bg, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' };
}
