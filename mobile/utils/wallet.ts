import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import * as SecureStore from 'expo-secure-store';
import { Keypair } from '@solana/web3.js';
import { split, combine } from './shamir';

const SHARE_1_KEY = 'vaultis_share_1';
const SHARE_2_KEY = 'vaultis_share_2_local';
const PUBKEY_KEY  = 'vaultis_pubkey';
const SETUP_DONE  = 'vaultis_setup_done';

export function generateKeypair(): Keypair {
  return Keypair.generate();
}

export function splitPrivateKey(privateKey: Uint8Array): {
  share1: Buffer; share2: Buffer; share3: Buffer;
} {
  const shares = split(Buffer.from(privateKey), 3, 2);
  return { share1: shares[0], share2: shares[1], share3: shares[2] };
}

export function reconstructPrivateKey(shareA: Buffer, shareB: Buffer): Uint8Array {
  return new Uint8Array(combine([shareA, shareB]));
}

export async function storeShare1(share: Buffer): Promise<void> {
  await SecureStore.setItemAsync(SHARE_1_KEY, share.toString('base64'), {
    requireAuthentication: true,
    authenticationPrompt: 'Unlock your Vaultis wallet',
  });
}

export async function getShare1(): Promise<Buffer | null> {
  try {
    const val = await SecureStore.getItemAsync(SHARE_1_KEY, {
      requireAuthentication: true,
      authenticationPrompt: 'Unlock your Vaultis wallet',
    });
    return val ? Buffer.from(val, 'base64') : null;
  } catch { return null; }
}

export async function storeShare2Local(share: Buffer): Promise<void> {
  await SecureStore.setItemAsync(SHARE_2_KEY, share.toString('base64'));
}

export async function getShare2Local(): Promise<Buffer | null> {
  try {
    const val = await SecureStore.getItemAsync(SHARE_2_KEY);
    return val ? Buffer.from(val, 'base64') : null;
  } catch { return null; }
}

export async function storePubkey(pubkey: string): Promise<void> {
  await SecureStore.setItemAsync(PUBKEY_KEY, pubkey);
}

export async function getPubkey(): Promise<string | null> {
  return SecureStore.getItemAsync(PUBKEY_KEY);
}

export async function markSetupDone(): Promise<void> {
  await SecureStore.setItemAsync(SETUP_DONE, '1');
}

export async function isSetupDone(): Promise<boolean> {
  const val = await SecureStore.getItemAsync(SETUP_DONE);
  return val === '1';
}

export async function setupNewWallet(): Promise<{
  keypair: Keypair; share2Base64: string; share3Base64: string;
}> {
  const keypair = generateKeypair();
  const { share1, share2, share3 } = splitPrivateKey(keypair.secretKey);
  await storeShare1(share1);
  await storeShare2Local(share2);
  await storePubkey(keypair.publicKey.toBase58());
  await markSetupDone();
  return {
    keypair,
    share2Base64: share2.toString('base64'),
    share3Base64: share3.toString('base64'),
  };
}

export async function getSigningKeypair(): Promise<Keypair | null> {
  try {
    const share1 = await getShare1();
    const share2 = await getShare2Local();
    if (!share1 || !share2) return null;
    const privateKey = reconstructPrivateKey(share1, share2);
    const keypair = Keypair.fromSecretKey(privateKey);
    privateKey.fill(0);
    return keypair;
  } catch { return null; }
}
