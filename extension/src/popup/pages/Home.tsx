import React, { useEffect, useState } from 'react';
import { getPubkey } from '../../utils/wallet';
import { getBalance, getRecentTransactions, conn } from '../../utils/solana';
import { C } from '../App';
import type { Page } from '../App';

interface Props { nav: (p: Page) => void; }

export default function Home({ nav }: Props) {
  const [pubkey, setPubkey] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const pk = await getPubkey();
      if (pk) {
        setPubkey(pk);
        const bal = await getBalance(pk);
        setBalance(bal);
        const recent = await getRecentTransactions(pk, 5);
        setTxs(recent);
      }
      setLoading(false);
    })();
  }, []);

  const copyAddr = () => {
    navigator.clipboard.writeText(pubkey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const airdrop = async () => {
    setLoading(true);
    try {
      await fetch('https://api.devnet.solana.com', {
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
      const recent = await getRecentTransactions(pubkey, 5);
      setTxs(recent);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const short = pubkey ? `${pubkey.slice(0, 8)}...${pubkey.slice(-6)}` : '';
  const qrDataUrl = pubkey ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pubkey)}` : '';

  return (
    <div style={{ padding: '20px 20px 0', background: C.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            🌸
          </div>
          <span style={{ color: C.text, fontWeight: 800, fontSize: 17, letterSpacing: 1 }}>Bloom</span>
        </div>
        <div style={{ background: 'rgba(232,168,124,0.1)', border: `1px solid rgba(232,168,124,0.2)`, borderRadius: 20, padding: '4px 10px' }}>
          <span style={{ color: C.bloom, fontSize: 10, fontWeight: 700 }}>DEVNET</span>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setShowQR(false)}
        >
          <div style={{ background: C.card, borderRadius: 20, padding: 24, textAlign: 'center', maxWidth: 300, border: `1px solid ${C.border}` }}>
            <div style={{ color: C.text, fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Receive SOL</div>
            <img src={qrDataUrl} alt="QR" style={{ borderRadius: 12, marginBottom: 16, background: '#fff', padding: 8 }} />
            <div style={{ background: C.cardAlt, borderRadius: 10, padding: 12, marginBottom: 16, border: `1px solid ${C.border}` }}>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>Your Address</div>
              <div style={{ color: C.primary, fontSize: 10, fontFamily: 'monospace', wordBreak: 'break-all' }}>{pubkey}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); copyAddr(); }}
              style={{ width: '100%', background: C.primaryDark, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
            >
              {copied ? '✓ Copied!' : 'Copy Address'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowQR(false); }}
              style={{ width: '100%', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px', marginTop: 8, cursor: 'pointer', fontSize: 12 }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Balance Card */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Total Balance</div>
        {loading ? (
          <div style={{ color: C.muted, fontSize: 28 }}>Loading...</div>
        ) : (
          <div style={{ color: C.text, fontSize: 38, fontWeight: 800, marginBottom: 16 }}>
            {balance.toFixed(4)} <span style={{ fontSize: 16, color: C.muted }}>SOL</span>
          </div>
        )}
        <button
          onClick={copyAddr}
          style={{ width: '100%', background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: copied ? C.accent : C.primary, fontSize: 11, cursor: 'pointer', fontFamily: 'monospace', textAlign: 'left', marginBottom: 8 }}
        >
          {copied ? '✓ Copied!' : `${short} ↗`}
        </button>
        <button
          onClick={() => setShowQR(true)}
          style={{ width: '100%', background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.accent, fontSize: 11, cursor: 'pointer' }}
        >
          📋 Show QR Code
        </button>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        <button onClick={() => nav('send')} style={actionBtn(C.primaryDark)}>
          <span style={{ fontSize: 18 }}>↗</span>
          <span style={{ fontSize: 10, marginTop: 4, fontWeight: 600 }}>Send</span>
        </button>
        <button onClick={() => setShowQR(true)} style={actionBtn('#1A3A1A')}>
          <span style={{ fontSize: 18 }}>📋</span>
          <span style={{ fontSize: 10, marginTop: 4, fontWeight: 600 }}>Receive</span>
        </button>
        <button onClick={airdrop} disabled={loading} style={{ ...actionBtn('#2A1A00'), opacity: loading ? 0.5 : 1 }}>
          <span style={{ fontSize: 18 }}>🪂</span>
          <span style={{ fontSize: 10, marginTop: 4, fontWeight: 600 }}>Airdrop</span>
        </button>
      </div>

      {/* Will card */}
      <div
        onClick={() => nav('will')}
        style={{ background: '#12002A', border: `1px solid ${C.primaryDark}`, borderRadius: 14, padding: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}
      >
        <span style={{ fontSize: 24 }}>💀</span>
        <div>
          <div style={{ color: C.primary, fontWeight: 700, fontSize: 13 }}>Digital Will</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Set up on-chain inheritance →</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Recent Activity</div>
        {loading ? (
          <div style={{ color: C.muted, fontSize: 12 }}>Loading...</div>
        ) : txs.length === 0 ? (
          <div style={{ color: C.muted, fontSize: 12 }}>No transactions yet</div>
        ) : (
          txs.map((tx) => (
            <div
              key={tx.signature}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>Transaction</div>
                <div style={{ color: C.muted, fontSize: 9, fontFamily: 'monospace', marginTop: 2 }}>{tx.signature.slice(0, 16)}...{tx.signature.slice(-8)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: tx.confirmed ? C.accent : C.warning }} />
                <a
                  href={`https://solscan.io/tx/${tx.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: C.primary, fontSize: 10 }}
                >
                  View ↗
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function actionBtn(bg: string): React.CSSProperties {
  return {
    background: bg,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: '14px 0',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'inherit',
  };
}