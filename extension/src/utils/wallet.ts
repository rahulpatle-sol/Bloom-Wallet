import { Buffer } from 'buffer';
import nacl from 'tweetnacl';
import * as sss from 'shamirs-secret-sharing';
import { Keypair } from '@solana/web3.js';

const SHARE1_KEY = 'bloom_share1';
const SHARE2_KEY = 'bloom_share2';
const PUBKEY_KEY = 'bloom_pubkey';
const SETUP_KEY = 'bloom_setup';
const CRED_ID_KEY = 'bloom_cred_id';

function chromeGet(key: string): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key] ?? null);
    });
  });
}

function chromeSet(key: string, value: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

export function generateKeypair(): Keypair {
  return Keypair.generate();
}

export function splitKey(secretKey: Uint8Array): { share1: Buffer; share2: Buffer; share3: Buffer } {
  const secret = Buffer.from(secretKey);
  const shares = sss.split(secret, { shares: 3, threshold: 2 });
  return { share1: shares[0], share2: shares[1], share3: shares[2] };
}

export function reconstructKey(a: Buffer, b: Buffer): Uint8Array {
  return new Uint8Array(sss.combine([a, b]));
}

export async function createCredential(): Promise<string> {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'Bloom Wallet', id: location.hostname || 'bloom' },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: 'bloom-user',
        displayName: 'Bloom User',
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
    },
  }) as PublicKeyCredential;
  const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
  await chromeSet(CRED_ID_KEY, credId);
  return credId;
}

export async function assertCredential(credentialId: string): Promise<boolean> {
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const rawId = Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0));
    await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{ id: rawId, type: 'public-key' }],
        userVerification: 'required',
        timeout: 60000,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function setupWallet() {
  const credId = await createCredential();
  const keypair = generateKeypair();
  const { share1, share2, share3 } = splitKey(keypair.secretKey);

  await chromeSet(SHARE1_KEY, share1.toString('base64'));
  await chromeSet(SHARE2_KEY, share2.toString('base64'));
  await chromeSet(PUBKEY_KEY, keypair.publicKey.toBase58());
  await chromeSet(SETUP_KEY, '1');

  return {
    keypair,
    share2Base64: share2.toString('base64'),
    share3Base64: share3.toString('base64'),
  };
}

export async function isSetup(): Promise<boolean> {
  const v = await chromeGet(SETUP_KEY);
  return v === '1';
}

export async function getPubkey(): Promise<string | null> {
  return chromeGet(PUBKEY_KEY);
}

export async function getSigningKeypair(share2Base64: string): Promise<Keypair | null> {
  try {
    const credId = await chromeGet(CRED_ID_KEY);
    if (!credId) return null;
    const ok = await assertCredential(credId);
    if (!ok) return null;

    const s1b64 = await chromeGet(SHARE1_KEY);
    if (!s1b64) return null;
    const share1 = Buffer.from(s1b64, 'base64');
    const share2 = Buffer.from(share2Base64, 'base64');
    const secretKey = reconstructKey(share1, share2);
    const keypair = Keypair.fromSecretKey(secretKey);
    secretKey.fill(0);
    return keypair;
  } catch {
    return null;
  }
}