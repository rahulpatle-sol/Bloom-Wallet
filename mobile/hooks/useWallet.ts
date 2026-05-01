import { useState, useCallback } from 'react';
import { getPubkey, getSigningKeypair, isSetupDone, setupNewWallet } from '../utils/wallet';
import { getBalance, airdrop as airdropFn } from '../utils/solana';
import { DEFAULT_NETWORK } from '../constants/network';

export function useWallet() {
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    const pk = await getPubkey();
    setPubkey(pk);
    if (pk) {
      const bal = await getBalance(pk);
      setBalance(bal);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!pubkey) return;
    const bal = await getBalance(pubkey);
    setBalance(bal);
  }, [pubkey]);

  const createWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await setupNewWallet();
      setPubkey(result.keypair.publicKey.toBase58());
      return result;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const devnetAirdrop = useCallback(async () => {
    if (!pubkey) return;
    setLoading(true);
    try {
      await airdropFn(pubkey, 'devnet');
      await refreshBalance();
    } catch (e: any) {
      setError('Airdrop failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [pubkey, refreshBalance]);

  const checkSetup = useCallback(async () => {
    return isSetupDone();
  }, []);

  return {
    pubkey,
    balance,
    loading,
    error,
    loadWallet,
    refreshBalance,
    createWallet,
    devnetAirdrop,
    checkSetup,
    getSigningKeypair,
  };
}
