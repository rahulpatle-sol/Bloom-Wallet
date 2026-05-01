import { useState, useCallback } from 'react';
import {
  getWillAccount,
  buildInitializeWillIx,
  buildCheckInIx,
  buildAddBeneficiaryIx,
  sendTransaction,
  getWillPDA,
} from '../utils/solana';
import { DEFAULT_NETWORK } from '../constants/network';

export interface WillData {
  owner: string;
  lastCheckin: number;
  inactivityDays: number;
  beneficiaryCount: number;
  isActive: boolean;
  beneficiaries: string[];
  percentages: number[];
}

export function useWill(pubkey: string | null) {
  const [will, setWill] = useState<WillData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWill = useCallback(async () => {
    if (!pubkey) return;
    setLoading(true);
    try {
      const data = await getWillAccount(pubkey, DEFAULT_NETWORK);
      setWill(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [pubkey]);

  const initializeWill = useCallback(
    async (inactivityDays: number, getKeypair: () => Promise<any>) => {
      if (!pubkey) return null;
      setLoading(true);
      setError(null);
      try {
        const keypair = await getKeypair();
        if (!keypair) throw new Error('Biometric authentication failed');
        const ix = await buildInitializeWillIx(pubkey, inactivityDays, DEFAULT_NETWORK);
        const sig = await sendTransaction(ix, keypair, DEFAULT_NETWORK);
        await loadWill();
        return sig;
      } catch (e: any) {
        setError(e.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [pubkey, loadWill]
  );

  const checkIn = useCallback(
    async (getKeypair: () => Promise<any>) => {
      if (!pubkey) return null;
      setLoading(true);
      setError(null);
      try {
        const keypair = await getKeypair();
        if (!keypair) throw new Error('Biometric authentication failed');
        const ix = await buildCheckInIx(pubkey, DEFAULT_NETWORK);
        const sig = await sendTransaction(ix, keypair, DEFAULT_NETWORK);
        await loadWill();
        return sig;
      } catch (e: any) {
        setError(e.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [pubkey, loadWill]
  );

  const addBeneficiary = useCallback(
    async (
      beneficiaryPubkey: string,
      percentage: number,
      slot: number,
      getKeypair: () => Promise<any>
    ) => {
      if (!pubkey) return null;
      setLoading(true);
      setError(null);
      try {
        const keypair = await getKeypair();
        if (!keypair) throw new Error('Biometric authentication failed');
        const ix = await buildAddBeneficiaryIx(pubkey, beneficiaryPubkey, percentage, slot, DEFAULT_NETWORK);
        const sig = await sendTransaction(ix, keypair, DEFAULT_NETWORK);
        await loadWill();
        return sig;
      } catch (e: any) {
        setError(e.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [pubkey, loadWill]
  );

  const willPDA = pubkey ? getWillPDA(pubkey, DEFAULT_NETWORK).toBase58() : null;

  // Days since last check-in
  const daysSinceCheckin = will
    ? Math.floor((Date.now() / 1000 - will.lastCheckin) / 86400)
    : 0;

  // Days remaining before will executes
  const daysUntilExecution = will
    ? Math.max(0, will.inactivityDays - daysSinceCheckin)
    : 0;

  return {
    will,
    loading,
    error,
    willPDA,
    daysSinceCheckin,
    daysUntilExecution,
    loadWill,
    initializeWill,
    checkIn,
    addBeneficiary,
  };
}
