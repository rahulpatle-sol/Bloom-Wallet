import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from '@solana/web3.js';
import { Buffer } from 'buffer';
import { DEFAULT_NETWORK, NETWORKS, PROGRAM_ID, WILL_ACCOUNT_SEED } from '../constants/network';

let _connection: Connection | null = null;

export function getConnection(network = DEFAULT_NETWORK): Connection {
  if (!_connection) {
    _connection = new Connection(NETWORKS[network], 'confirmed');
  }
  return _connection;
}

export function resetConnection(network = DEFAULT_NETWORK): Connection {
  _connection = new Connection(NETWORKS[network], 'confirmed');
  return _connection;
}

export async function getBalance(pubkey: string, network = DEFAULT_NETWORK): Promise<number> {
  const conn = getConnection(network);
  const pk = new PublicKey(pubkey);
  const lamports = await conn.getBalance(pk);
  return lamports / LAMPORTS_PER_SOL;
}

export async function airdrop(pubkey: string, network = DEFAULT_NETWORK): Promise<void> {
  if (network !== 'devnet') throw new Error('Airdrop only available on devnet');
  const conn = getConnection(network);
  const pk = new PublicKey(pubkey);
  const sig = await conn.requestAirdrop(pk, 2 * LAMPORTS_PER_SOL);
  await conn.confirmTransaction(sig, 'confirmed');
}

export async function sendSOL(
  fromKeypair: { publicKey: PublicKey; secretKey: Uint8Array },
  toPubkey: string,
  amountSOL: number,
  network = DEFAULT_NETWORK
): Promise<string> {
  const conn = getConnection(network);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: new PublicKey(toPubkey),
      lamports: Math.floor(amountSOL * LAMPORTS_PER_SOL),
    })
  );
  const { blockhash } = await conn.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = fromKeypair.publicKey;
  tx.sign(fromKeypair as any);
  const sig = await conn.sendRawTransaction(tx.serialize());
  await conn.confirmTransaction(sig, 'confirmed');
  return sig;
}

// ============================================
// WILL PROGRAM INSTRUCTIONS
// ============================================
export function getWillPDA(ownerPubkey: string, network = DEFAULT_NETWORK): PublicKey {
  const programId = new PublicKey(PROGRAM_ID[network] || PROGRAM_ID.devnet);
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from(WILL_ACCOUNT_SEED), new PublicKey(ownerPubkey).toBuffer()],
    programId
  );
  return pda;
}

export async function buildInitializeWillIx(
  ownerPubkey: string,
  inactivityDays: number,
  network = DEFAULT_NETWORK
): Promise<TransactionInstruction> {
  const programId = new PublicKey(PROGRAM_ID[network] || PROGRAM_ID.devnet);
  const owner = new PublicKey(ownerPubkey);
  const willPDA = getWillPDA(ownerPubkey, network);

  const data = Buffer.alloc(3);
  data[0] = 0; // InitializeWill discriminator
  data.writeUInt16LE(inactivityDays, 1);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true },
      { pubkey: willPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
}

export async function buildCheckInIx(
  ownerPubkey: string,
  network = DEFAULT_NETWORK
): Promise<TransactionInstruction> {
  const programId = new PublicKey(PROGRAM_ID[network] || PROGRAM_ID.devnet);
  const owner = new PublicKey(ownerPubkey);
  const willPDA = getWillPDA(ownerPubkey, network);

  const data = Buffer.alloc(1);
  data[0] = 1; // CheckIn discriminator

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: false },
      { pubkey: willPDA, isSigner: false, isWritable: true },
    ],
    data,
  });
}

export async function buildAddBeneficiaryIx(
  ownerPubkey: string,
  beneficiaryPubkey: string,
  percentage: number,
  slot: number,
  network = DEFAULT_NETWORK
): Promise<TransactionInstruction> {
  const programId = new PublicKey(PROGRAM_ID[network] || PROGRAM_ID.devnet);
  const owner = new PublicKey(ownerPubkey);
  const beneficiary = new PublicKey(beneficiaryPubkey);
  const willPDA = getWillPDA(ownerPubkey, network);

  const data = Buffer.alloc(34);
  data[0] = 4; // AddBeneficiary discriminator
  beneficiary.toBuffer().copy(data, 1);
  data[33] = percentage;
  // Note: slot in instruction data: we embed in the last byte differently
  // Actual layout: [discriminator(1)] [beneficiary(32)] [percentage(1)] [slot(1)]
  const fullData = Buffer.alloc(35);
  fullData[0] = 4;
  beneficiary.toBuffer().copy(fullData, 1);
  fullData[33] = percentage;
  fullData[34] = slot;

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: owner, isSigner: true, isWritable: false },
      { pubkey: willPDA, isSigner: false, isWritable: true },
    ],
    data: fullData,
  });
}

export async function sendTransaction(
  ix: TransactionInstruction,
  keypair: { publicKey: PublicKey; secretKey: Uint8Array },
  network = DEFAULT_NETWORK
): Promise<string> {
  const conn = getConnection(network);
  const tx = new Transaction().add(ix);
  const { blockhash } = await conn.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = keypair.publicKey;
  tx.sign(keypair as any);
  const sig = await conn.sendRawTransaction(tx.serialize());
  await conn.confirmTransaction(sig, 'confirmed');
  return sig;
}

export async function getWillAccount(ownerPubkey: string, network = DEFAULT_NETWORK) {
  try {
    const conn = getConnection(network);
    const willPDA = getWillPDA(ownerPubkey, network);
    const info = await conn.getAccountInfo(willPDA);
    if (!info) return null;

    // Parse WillAccount manually (matches Rust struct layout)
    const d = info.data;
    const view = new DataView(d.buffer, d.byteOffset);

    const owner = new PublicKey(d.slice(0, 32)).toBase58();
    const lastCheckin = Number(view.getBigInt64(32, true));
    const inactivityDays = view.getUint16(40, true);
    const beneficiaryCount = d[42];
    const isActive = d[43] === 1;

    const beneficiaries: string[] = [];
    const percentages: number[] = [];
    for (let i = 0; i < beneficiaryCount; i++) {
      const start = 44 + i * 32;
      beneficiaries.push(new PublicKey(d.slice(start, start + 32)).toBase58());
      percentages.push(d[44 + 5 * 32 + i]);
    }

    return { owner, lastCheckin, inactivityDays, beneficiaryCount, isActive, beneficiaries, percentages };
  } catch {
    return null;
  }
}
