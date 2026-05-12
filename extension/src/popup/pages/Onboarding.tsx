import React, { useState } from 'react';
import { setupWallet, createCredential } from '../../utils/wallet';
import { C } from '../App';

interface Props { onComplete: () => void; }

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<'welcome' | 'biometric' | 'backup' | 'done'>('welcome');
  const [share2, setShare2] = useState('');
  const [share3, setShare3] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    try {
      await createCredential();
      const result = await setupWallet();
      setShare2(result.share2Base64);
      setShare3(result.share3Base64);
      setStep('backup');
    } catch (e: any) {
      setError(e.message || 'Setup failed. Make sure biometric authentication is available in your browser.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'welcome') return (
    <div style={{ padding: 28, textAlign: 'center', background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🌸</div>
      <div style={{ color: C.primary, fontWeight: 900, fontSize: 28, letterSpacing: 4, marginBottom: 8 }}>BLOOM</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>Biometric Solana wallet</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 28, lineHeight: 1.6 }}>No seed phrase. No password. Your fingerprint is your key.</div>
      <div style={{ background: 'rgba(232,168,124,0.1)', border: `1px solid rgba(232,168,124,0.2)`, borderRadius: 10, padding: '10px 16px', marginBottom: 28, color: C.bloom, fontSize: 12, fontWeight: 600 }}>
        🟡 DEVNET — Test environment only
      </div>
      <button onClick={() => setStep('biometric')} style={btnStyle(C.primaryDark)}>
        Get Started →
      </button>
      <div style={{ color: C.muted, fontSize: 11, marginTop: 20 }}>
        Only supports fingerprint / Face ID biometric
      </div>
    </div>
  );

  if (step === 'biometric') return (
    <div style={{ padding: 28, background: C.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontSize: 52, textAlign: 'center', marginBottom: 20 }}>👁️</div>
      <div style={{ color: C.text, fontWeight: 800, fontSize: 20, marginBottom: 10, textAlign: 'center' }}>Enable Biometric</div>
      <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 24, textAlign: 'center' }}>
        Your browser's biometric (Touch ID, Windows Hello, etc.) will protect your wallet. Your biometric data never leaves your device.
      </div>
      {error && (
        <div style={{ color: C.danger, background: 'rgba(248,113,113,0.1)', border: `1px solid ${C.danger}`, borderRadius: 10, padding: '12px', marginBottom: 16, fontSize: 12 }}>
          {error}
        </div>
      )}
      <button onClick={handleSetup} disabled={loading} style={{ ...btnStyle(C.primaryDark), opacity: loading ? 0.6 : 1 }}>
        {loading ? '⏳ Setting up...' : '🔐 Enable Biometric & Create Wallet'}
      </button>
      <button onClick={() => setStep('welcome')} style={{ ...btnStyle('transparent'), color: C.muted, marginTop: 12, border: `1px solid ${C.border}` }}>
        Back
      </button>
    </div>
  );

  if (step === 'backup') return (
    <div style={{ padding: 24, background: C.bg, minHeight: '100vh' }}>
      <div style={{ color: C.text, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Save Your Recovery Keys</div>
      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 20 }}>
        Write down BOTH keys below and store them safely. You need any 2-of-3 shares to recover your wallet.
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Key 1 — Browser (auto-saved)</div>
        <div style={{ color: C.muted, fontSize: 11 }}>Secured by your biometric. Available on this device.</div>
      </div>

      <div style={{ background: C.card, border: `1px solid rgba(85,72,208,0.3)`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
        <div style={{ color: C.primary, fontSize: 10, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Key 2 — Save This ⭐</div>
        <div style={{ color: C.primary, fontSize: 10, fontFamily: 'monospace', wordBreak: 'break-all', userSelect: 'all', maxHeight: 100, overflow: 'hidden' }}>{share2}</div>
      </div>

      <div style={{ background: C.card, border: `1px solid rgba(232,168,124,0.3)`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <div style={{ color: C.bloom, fontSize: 10, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Key 3 — Save This Too ⭐</div>
        <div style={{ color: C.bloom, fontSize: 10, fontFamily: 'monospace', wordBreak: 'break-all', userSelect: 'all', maxHeight: 100, overflow: 'hidden' }}>{share3}</div>
      </div>

      <div style={{ background: 'rgba(248,113,113,0.1)', border: `1px solid rgba(248,113,113,0.2)`, borderRadius: 10, padding: '12px', marginBottom: 20, color: C.danger, fontSize: 12 }}>
        ⚠️ Without at least 2 of 3 keys, your funds cannot be recovered. Store them in separate secure locations.
      </div>

      <button onClick={() => { setStep('done'); onComplete(); }} style={btnStyle(C.primaryDark)}>
        ✓ I've Saved My Keys — Open Bloom
      </button>
    </div>
  );

  return null;
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    width: '100%',
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };
}