import React, { useEffect, useState } from 'react';
import { getPubkey } from '../../utils/wallet';
import { getBalance } from '../../utils/solana';
import type { Page } from '../App';

const C = {
  bg: '#0A0A1A', card: '#12122A', cardAlt: '#1A1A35',
  border: '#2D2D5E', primary: '#7C3AED', primaryLight: '#A78BFA',
  text: '#F1F5F9', muted: '#94A3B8', accent: '#06D6A0', warning: '#F59E0B',
};

interface Props { nav: (p: Page) => void; }

export default function Home({ nav }: Props) {
  const [pubkey, setPubkey] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const pk = await getPubkey();
      if (pk) {
        setPubkey(pk);
        const bal = await getBalance(pk);
        setBalance(bal);
      }
      setLoading(false);
    })();
  }, []);

  const copyAddr = () => {
    navigator.clipboard.writeText(pubkey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const airdrop = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.devnet.solana.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1,
          method: 'requestAirdrop',
          params: [pubkey, 1_000_000_000],
        }),
      });
      await new Promise(r => setTimeout(r, 3000));
      const bal = await getBalance(pubkey);
      setBalance(bal);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const short = pubkey ? `${pubkey.slice(0, 8)}...${pubkey.slice(-6)}` : '';

  return (
    <div style={{ padding: 20, paddingBottom: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ color: C.primaryLight, fontWeight: 900, fontSize: 18, letterSpacing: 3 }}>VAULTIS</span>
        <span style={{ background: '#2D1B00', color: C.warning, fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700 }}>DEVNET</span>
      </div>

      {/* Balance card */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}>Balance</div>
        {loading
          ? <div style={{ color: C.muted, fontSize: 24 }}>Loading...</div>
          : <div style={{ color: C.text, fontSize: 36, fontWeight: 800 }}>{balance.toFixed(4)} <span style={{ fontSize: 16, color: C.muted }}>SOL</span></div>
        }
        <button
          onClick={copyAddr}
          style={{ marginTop: 12, background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 14px', color: copied ? C.accent : C.primaryLight, fontSize: 12, cursor: 'pointer', fontFamily: 'monospace', width: '100%', textAlign: 'left' }}
        >
          {copied ? '✅ Copied!' : `${short} ⎘`}
        </button>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <button onClick={() => nav('send')} style={actionBtn}>
          <span style={{ fontSize: 22 }}>↗</span>
          <span style={{ fontSize: 12, marginTop: 4 }}>Send</span>
        </button>
        <button onClick={airdrop} disabled={loading} style={actionBtn}>
          <span style={{ fontSize: 22 }}>🪂</span>
          <span style={{ fontSize: 12, marginTop: 4 }}>Airdrop 1 SOL</span>
        </button>
      </div>

      {/* Will reminder */}
      <div
        onClick={() => nav('will')}
        style={{ background: '#12002A', border: `1px solid ${C.primary}`, borderRadius: 12, padding: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <span style={{ fontSize: 24 }}>💀</span>
        <div>
          <div style={{ color: C.primaryLight, fontWeight: 700, fontSize: 13 }}>Digital Will</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Set up your on-chain inheritance →</div>
        </div>
      </div>

      {/* Explorer */}
      {pubkey && (
        <div style={{ marginTop: 12, padding: '10px 0' }}>
          <a
            href={`https://explorer.solana.com/address/${pubkey}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            style={{ color: C.muted, fontSize: 11, textDecoration: 'none' }}
          >
            🔭 View on Explorer ↗
          </a>
        </div>
      )}
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  background: '#12122A',
  border: '1px solid #2D2D5E',
  borderRadius: 12,
  padding: '16px 0',
  color: '#F1F5F9',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'inherit',
  fontSize: 14,
};
