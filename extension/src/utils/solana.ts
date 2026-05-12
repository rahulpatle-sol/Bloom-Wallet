import {
  Connection, PublicKey, Transaction, SystemProgram,
  LAMPORTS_PER_SOL, TransactionInstruction, Keypair
} from '@solana/web3.js';
import { Buffer } from 'buffer';

export const DEVNET_RPC = 'https://api.devnet.solana.com';
export const WILL_SEED = 'will';
export const PROGRAM_ID_DEVNET = new PublicKey('6s75VMyVkP3T86FNvMP5LkMuVXrD3xZN3W3GT3BDJWEp');

export const conn = new Connection(DEVNET_RPC, 'confirmed');

export function getWillPDA(ownerPubkey: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from(WILL_SEED), new PublicKey(ownerPubkey).toBuffer()],
    PROGRAM_ID_DEVNET
  );
  return pda;
}

export async function getBalance(pubkey: string): Promise<number> {
  try {
    const lamps = await conn.getBalance(new PublicKey(pubkey));
    return lamps / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export async function sendTransaction(
  ix: TransactionInstruction,
  keypair: Keypair
): Promise<string> {
  const tx = new Transaction().add(ix);
  const { blockhash } = await conn.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = keypair.publicKey;
  tx.sign(keypair);
  const sig = await conn.sendRawTransaction(tx.serialize());
  await conn.confirmTransaction(sig, 'confirmed');
  return sig;
}

export function buildCheckInIx(ownerPubkey: string): TransactionInstruction {
  const pda = getWillPDA(ownerPubkey);
  const data = Buffer.alloc(1);
  data[0] = 1;
  return new TransactionInstruction({
    programId: PROGRAM_ID_DEVNET,
    keys: [
      { pubkey: new PublicKey(ownerPubkey), isSigner: true, isWritable: false },
      { pubkey: pda, isSigner: false, isWritable: true },
    ],
    data,
  });
}

export function buildInitWillIx(ownerPubkey: string, days: number): TransactionInstruction {
  const pda = getWillPDA(ownerPubkey);
  const data = Buffer.alloc(3);
  data[0] = 0;
  data.writeUInt16LE(days, 1);
  return new TransactionInstruction({
    programId: PROGRAM_ID_DEVNET,
    keys: [
      { pubkey: new PublicKey(ownerPubkey), isSigner: true, isWritable: true },
      { pubkey: pda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
}

export function buildRevokeWillIx(ownerPubkey: string): TransactionInstruction {
  const pda = getWillPDA(ownerPubkey);
  const data = Buffer.alloc(1);
  data[0] = 3;
  return new TransactionInstruction({
    programId: PROGRAM_ID_DEVNET,
    keys: [
      { pubkey: new PublicKey(ownerPubkey), isSigner: true, isWritable: false },
      { pubkey: pda, isSigner: false, isWritable: true },
    ],
    data,
  });
}

export async function getRecentTransactions(pubkey: string, limit = 10) {
  try {
    const pk = new PublicKey(pubkey);
    const sigs = await conn.getSignaturesForAddress(pk, { limit });
    return sigs.map(s => ({
      signature: s.signature,
      slot: s.slot,
      blockTime: s.blockTime ?? null,
      confirmed: s.confirmationStatus === 'confirmed',
    }));
  } catch {
    return [];
  }
}