import React, { useEffect, useState } from 'react';
import { getPubkey, getSigningKeypair } from '../../utils/wallet';
import { getWillPDA, buildInitWillIx, buildCheckInIx, sendTransaction, conn } from '../../utils/solana';
import { PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js';
import type { Page } from '../App';

const C = { bg: '#0A0A1A', card: '#12122A', cardAlt: '#1A1A35', border: '#2D2D5E', primary: '#7C3AED', primaryLight: '#A78BFA', text: '#F1F5F9', muted: '#94A3B8', accent: '#06D6A0', danger: '#EF4444', warning: '#F59E0B' };

interface Props { nav: (p: Page) => void; }

export default function Will({ nav }: Props) {
  const [pubkey, setPubkey] = useState('');
  const [willExists, setWillExists] = useState<boolean | null>(null);
  const [willPDA, setWillPDA] = useState('');
  const [days, setDays] = useState('365');
  const [share2, setShare2] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [txSig, setTxSig] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const pk = await getPubkey();
      if (!pk) return;
      setPubkey(pk);
      const pda = getWillPDA(pk);
      setWillPDA(pda.toBase58());
      const info = await conn.getAccountInfo(pda);
      setWillExists(!!info && info.data.length > 0);
    })();
  }, []);

  const execIx = async (ix: TransactionInstruction, label: string) => {
    if (!share2) { setError('Enter Share 2 to authorize'); return; }
    setLoading(true);
    setError('');
    setStatus(`Signing ${label}...`);
    try {
      const keypair = await getSigningKeypair(share2);
      if (!keypair) throw new Error('Wrong Share 2 or corrupted key');
      const sig = await sendTransaction(ix, keypair);
      setTxSig(sig);
      setStatus(`${label} confirmed! ✅`);
      setWillExists(true);
    } catch (e: any) {
      setError(e.message);
      setStatus('');
    }
    setLoading(false);
  };

  const handleInitWill = () => {
    const d = parseInt(days);
    if (isNaN(d) || d < 1 || d > 3650) { setError('Days must be 1–3650'); return; }
    const ix = buildInitWillIx(pubkey, d);
    execIx(ix, 'Initialize Will');
  };

  const handleCheckIn = () => {
    const ix = buildCheckInIx(pubkey);
    execIx(ix, 'Check-in');
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => nav('home')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ color: C.text, fontWeight: 800, fontSize: 18 }}>💀 Digital Will</span>
      </div>

      {/* Will PDA */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>Will PDA (on-chain address)</div>
        <div style={{ color: C.primaryLight, fontSize: 9, fontFamily: 'monospace', wordBreak: 'break-all' }}>{willPDA}</div>
        {willExists !== null && (
          <div style={{ marginTop: 8, color: willExists ? C.accent : C.warning, fontSize: 11, fontWeight: 700 }}>
            {willExists ? '● WILL EXISTS' : '○ NO WILL — Create one below'}
          </div>
        )}
      </div>

      {/* Share 2 input — needed to sign any tx */}
      <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 6 }}>Your Share 2 (to authorize transactions)</label>
      <textarea
        style={{ width: '100%', background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, fontSize: 9, fontFamily: 'monospace', marginBottom: 16, resize: 'none', height: 60, boxSizing: 'border-box', outline: 'none' }}
        placeholder="Paste Share 2 here..."
        value={share2}
        onChange={e => setShare2(e.target.value)}
      />

      {!willExists && (
        <>
          <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 6 }}>Inactivity Period (days)</label>
          <input
            style={{ width: '100%', background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px', color: C.text, fontSize: 14, marginBottom: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
            type="number"
            value={days}
            onChange={e => setDays(e.target.value)}
            min="1" max="3650"
          />
          <button onClick={handleInitWill} disabled={loading || !share2} style={{ ...btn(C.primary), opacity: (loading || !share2) ? 0.5 : 1 }}>
            🔐 Create Will on Devnet
          </button>
        </>
      )}

      {willExists && (
        <button onClick={handleCheckIn} disabled={loading || !share2} style={{ ...btn(C.accent), color: '#000', opacity: (loading || !share2) ? 0.5 : 1 }}>
          💓 Check In — I'm Alive
        </button>
      )}

      {status && (
        <div style={{ background: '#001A0D', border: `1px solid ${C.accent}`, borderRadius: 10, padding: 12, marginTop: 14 }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: txSig ? 6 : 0 }}>{status}</div>
          {txSig && (
            <>
              <div style={{ color: C.muted, fontSize: 9, fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 6 }}>{txSig}</div>
              <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noreferrer" style={{ color: C.primaryLight, fontSize: 11 }}>View on Explorer ↗</a>
            </>
          )}
        </div>
      )}

      {error && (
        <div style={{ background: '#1A0000', border: '1px solid #EF4444', borderRadius: 10, padding: 12, marginTop: 14, color: '#EF4444', fontSize: 12 }}>
          ❌ {error}
        </div>
      )}

      {/* Info */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginTop: 16 }}>
        <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.7 }}>
          💡 <strong style={{ color: C.text }}>How it works:</strong><br />
          Create a will → Add beneficiaries on mobile → Check in regularly → If you go inactive, assets auto-transfer on-chain.
        </div>
      </div>
    </div>
  );
}

function btn(bg: string): React.CSSProperties {
  return { width: '100%', background: bg, color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 };
}
