import React, { useEffect, useState } from 'react';
import { getPubkey } from '../../utils/wallet';
import { C } from '../App';
import type { Page } from '../App';

interface Props { nav: (p: Page) => void; }

export default function Settings({ nav }: Props) {
  const [pubkey, setPubkey] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getPubkey().then(pk => {
      if (pk) setPubkey(pk);
    });
  }, []);

  const copyAddr = () => {
    if (pubkey) {
      navigator.clipboard.writeText(pubkey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ padding: 20, background: C.bg, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => nav('home')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ color: C.text, fontWeight: 800, fontSize: 20 }}>Settings</span>
      </div>

      <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>My Wallet</div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.cardAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>💰</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 2 }}>Wallet Address</div>
            <div style={{ color: C.primary, fontSize: 11, fontFamily: 'monospace', maxWidth: 260, wordBreak: 'break-all' }}>
              {pubkey || 'Loading...'}
            </div>
          </div>
          <button onClick={copyAddr} style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: '8px 12px', color: copied ? C.accent : C.primary, fontSize: 11, cursor: 'pointer' }}>
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
      </div>

      <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Security</div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 24 }}>
        {[
          ['✓', 'Biometric (fingerprint / Face ID)', C.accent],
          ['✓', 'Key never stored whole', C.accent],
          ['✓', '2-of-3 Shamir key scheme', C.accent],
          ['✓', 'Open source', C.accent],
        ].map(([icon, text, color]) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: color as string, fontSize: 14 }}>{icon as string}</span>
            <span style={{ color: C.text, fontSize: 13 }}>{text as string}</span>
          </div>
        ))}
      </div>

      <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Info</div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 24 }}>
        {[
          ['🌐', 'Network', 'Devnet (Test)'],
          ['🔑', 'Key Scheme', 'Shamir SSS (2-of-3)'],
        ].map(([icon, label, value]) => (
          <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>{icon as string}</span>
              <span style={{ color: C.muted, fontSize: 13 }}>{label as string}</span>
            </div>
            <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{value as string}</span>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>🌸</span>
          <span style={{ color: C.primary, fontWeight: 800, fontSize: 16 }}>Bloom</span>
        </div>
        <div style={{ color: C.muted, fontSize: 12 }}>Version 1.0.0</div>
        <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Colosseum Frontier Hackathon</div>
      </div>
    </div>
  );
}