import React, { useEffect, useState } from 'react';
import { getPubkey, getSigningKeypair } from '../../utils/wallet';
import { sendTransaction, conn } from '../../utils/solana';
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { Page } from '../App';

const C = { bg: '#0A0A1A', card: '#12122A', cardAlt: '#1A1A35', border: '#2D2D5E', primary: '#7C3AED', primaryLight: '#A78BFA', text: '#F1F5F9', muted: '#94A3B8', accent: '#06D6A0', danger: '#EF4444', warning: '#F59E0B' };

interface Props { nav: (p: Page) => void; }

export default function Send({ nav }: Props) {
  const [pubkey, setPubkey] = useState('');
  const [toAddr, setToAddr] = useState('');
  const [amount, setAmount] = useState('');
  const [share2, setShare2] = useState('');
  const [step, setStep] = useState<'form' | 'share2' | 'sending' | 'success' | 'error'>('form');
  const [txSig, setTxSig] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    getPubkey().then(pk => { if (pk) setPubkey(pk); });
  }, []);

  const handleSend = async () => {
    if (!toAddr || !amount || !share2) { setErrMsg('All fields required'); return; }
    setStep('sending');
    try {
      const keypair = await getSigningKeypair(share2);
      if (!keypair) throw new Error('Could not reconstruct wallet — wrong Share 2?');

      const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(toAddr),
          lamports,
        })
      );
      const { blockhash } = await conn.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = keypair.publicKey;
      tx.sign(keypair);
      const sig = await conn.sendRawTransaction(tx.serialize());
      await conn.confirmTransaction(sig, 'confirmed');
      setTxSig(sig);
      setStep('success');
    } catch (e: any) {
      setErrMsg(e.message || 'Transaction failed');
      setStep('error');
    }
  };

  if (step === 'success') return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
      <div style={{ color: C.accent, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Sent!</div>
      <div style={{ background: C.card, borderRadius: 10, padding: 12, marginBottom: 20 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>Transaction Signature</div>
        <div style={{ color: C.primaryLight, fontSize: 10, fontFamily: 'monospace', wordBreak: 'break-all' }}>{txSig}</div>
      </div>
      <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noreferrer" style={{ color: C.primaryLight, fontSize: 12, display: 'block', marginBottom: 16 }}>View on Explorer ↗</a>
      <button onClick={() => nav('home')} style={btnStyle(C.primary)}>Back to Wallet</button>
    </div>
  );

  if (step === 'error') return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>❌</div>
      <div style={{ color: C.danger, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Transaction Failed</div>
      <div style={{ background: '#1A0000', border: `1px solid ${C.danger}`, borderRadius: 10, padding: 12, marginBottom: 20, color: C.danger, fontSize: 12 }}>{errMsg}</div>
      <button onClick={() => { setStep('form'); setErrMsg(''); }} style={btnStyle(C.primary)}>Try Again</button>
    </div>
  );

  if (step === 'sending') return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
      <div style={{ color: C.text, fontSize: 16 }}>Signing & Broadcasting...</div>
      <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>Please wait</div>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => nav('home')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>←</button>
        <span style={{ color: C.text, fontWeight: 800, fontSize: 18 }}>Send SOL</span>
      </div>

      {step === 'form' && (
        <>
          <label style={labelStyle}>Recipient Address</label>
          <input
            style={inputStyle}
            placeholder="Paste wallet address..."
            value={toAddr}
            onChange={e => setToAddr(e.target.value)}
          />
          <label style={labelStyle}>Amount (SOL)</label>
          <input
            style={inputStyle}
            placeholder="0.0"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0"
            step="0.001"
          />
          <button
            onClick={() => setStep('share2')}
            disabled={!toAddr || !amount}
            style={{ ...btnStyle(C.primary), opacity: (!toAddr || !amount) ? 0.5 : 1 }}
          >
            Continue →
          </button>
        </>
      )}

      {step === 'share2' && (
        <>
          {/* Confirm summary */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Sending</div>
            <div style={{ color: C.text, fontWeight: 800, fontSize: 24 }}>{amount} SOL</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>To</div>
            <div style={{ color: C.primaryLight, fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all' }}>{toAddr}</div>
          </div>

          <label style={labelStyle}>Enter Share 2 to authorize</label>
          <textarea
            style={{ ...inputStyle, height: 80, resize: 'none', fontFamily: 'monospace', fontSize: 10 }}
            placeholder="Paste your Share 2 backup here..."
            value={share2}
            onChange={e => setShare2(e.target.value)}
          />
          {errMsg && <div style={{ color: C.danger, fontSize: 12, marginBottom: 8 }}>{errMsg}</div>}
          <button onClick={handleSend} disabled={!share2} style={{ ...btnStyle(C.primary), opacity: !share2 ? 0.5 : 1 }}>
            🔐 Sign & Send
          </button>
          <button onClick={() => setStep('form')} style={{ ...btnStyle('transparent'), color: C.muted, border: `1px solid ${C.border}`, marginTop: 8 }}>
            Back
          </button>
        </>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { color: '#94A3B8', fontSize: 12, display: 'block', marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: '100%', background: '#1A1A35', border: '1px solid #2D2D5E',
  borderRadius: 10, padding: '12px', color: '#F1F5F9', fontSize: 13,
  marginBottom: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};
function btnStyle(bg: string): React.CSSProperties {
  return { width: '100%', background: bg, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' };
}
