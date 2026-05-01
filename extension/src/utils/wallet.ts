import { Buffer } from 'buffer';
import nacl from 'tweetnacl';
import * as sss from 'shamirs-secret-sharing';
import { Keypair } from '@solana/web3.js';

const SHARE1_KEY = 'vaultis_share1';
const PUBKEY_KEY = 'vaultis_pubkey';
const SETUP_KEY  = 'vaultis_setup';

// Chrome storage helper
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

export function splitKey(secretKey: Uint8Array) {
  const secret = Buffer.from(secretKey);
  const [s1, s2, s3] = sss.split(secret, { shares: 3, threshold: 2 });
  return { share1: s1, share2: s2, share3: s3 };
}

export function reconstructKey(a: Buffer, b: Buffer): Uint8Array {
  return new Uint8Array(sss.combine([a, b]));
}

// WebAuthn helpers — biometric in browser
export async function createCredential(): Promise<string> {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'Vaultis', id: location.hostname || 'vaultis' },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: 'vaultis-user',
        displayName: 'Vaultis User',
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
    },
  }) as PublicKeyCredential;
  return btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
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
  const keypair = generateKeypair();
  const { share1, share2, share3 } = splitKey(keypair.secretKey);

  await chromeSet(SHARE1_KEY, share1.toString('base64'));
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
