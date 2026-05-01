# 🔐 VAULTIS

> Biometric Solana wallet + Digital Will — no seed phrase, fully decentralized

Built for **Colosseum Solana Frontier Hackathon**

---

## 📁 Project Structure

```
vaultis/
├── programs/vaultis/     ← Steel on-chain program (Rust)
├── mobile/               ← React Native Expo app
├── extension/            ← Chrome Extension (MV3)
└── README.md
```

---

## ⚙️ Prerequisites

Install these first:

```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana CLI (v1.18+)
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Steel CLI
cargo install steel-cli

# Node.js v20+
# Download from https://nodejs.org

# Expo CLI
npm install -g expo-cli eas-cli
```

---

## 🦀 Part 1 — Deploy On-Chain Program

```bash
cd programs/vaultis

# Build
cargo build-bpf

# Set Solana to devnet
solana config set --url devnet

# Create wallet (or use existing)
solana-keygen new --outfile ~/.config/solana/id.json

# Get devnet SOL
solana airdrop 2

# Deploy
solana program deploy target/deploy/vaultis.so

# ⚠️ COPY the program ID printed after deploy!
# Example: "Program Id: AbcXyz1234..."
```

### Update Program ID in code:

After deploy, update these files with your program ID:

**mobile/constants/network.ts**
```ts
export const PROGRAM_ID = {
  devnet: 'YOUR_PROGRAM_ID_HERE',
  ...
}
```

**extension/src/utils/solana.ts**
```ts
export const PROGRAM_ID_DEVNET = 'YOUR_PROGRAM_ID_HERE';
```

---

## 📱 Part 2 — Mobile App

```bash
cd mobile

# Install dependencies
npm install

# Start Expo (scan QR with Expo Go app)
npx expo start

# For Android emulator
npx expo start --android

# For iOS simulator (Mac only)
npx expo start --ios
```

### First Run Flow:
1. App opens → Onboarding screen
2. Enable biometric (Face ID / fingerprint)
3. Wallet created, Share 2 shown → **SAVE IT**
4. Home screen → Airdrop devnet SOL → Test send
5. Will tab → Create will → Add beneficiaries → Check in

---

## 🌐 Part 3 — Chrome Extension

```bash
cd extension

# Install dependencies
npm install

# Build
npm run build
# This creates a dist/ folder

# Load in Chrome:
# 1. Open chrome://extensions
# 2. Enable "Developer mode" (top right toggle)
# 3. Click "Load unpacked"
# 4. Select the extension/dist/ folder
# 5. Vaultis icon appears in toolbar ✅
```

### Extension First Run:
1. Click Vaultis icon in Chrome
2. Enable biometric (Touch ID / Windows Hello)
3. Save Share 2 backup
4. Airdrop devnet SOL
5. Test send → Will tab → Create will

---

## 🧪 Testing on Devnet

### Test wallet-to-wallet send:
1. Open two browser profiles or use Phantom devnet wallet
2. Send SOL between them

### Test will execution (simulated):
```bash
# On Solana CLI, call execute_will after setting 1-day inactivity
# Wait 1 day OR modify check for testing to 1 minute
solana program invoke <PROGRAM_ID> \
  --instruction-data 02 \  # 0x02 = ExecuteWill
  --account <WILL_PDA> \
  --account <BENEFICIARY>
```

### Useful devnet commands:
```bash
# Check balance
solana balance

# Get more devnet SOL
solana airdrop 2

# Watch program logs
solana logs <PROGRAM_ID>

# Check account data
solana account <WILL_PDA_ADDRESS>
```

---

## 🔒 Security Notes

- Private key **NEVER** stored whole — always in Shamir shares
- Share 1 on device (biometric-locked via expo-secure-store)
- Share 2 = your manual backup (save somewhere safe!)
- Share 3 = future on-chain encrypted storage
- Key reconstructed only in RAM, wiped after signing
- No admin key on program — fully trustless once deployed

---

## 🗺️ Roadmap (Post-Hackathon)

- [ ] On-chain encrypted Share 3 storage (PDA)
- [ ] SPL token transfers in will (not just SOL)
- [ ] Guardian-based social recovery (3-of-5)
- [ ] Formal security audit
- [ ] iOS App Store + Chrome Web Store submission
- [ ] Mainnet deployment

---

## 📝 Tech Stack

| Layer | Tech |
|---|---|
| On-chain | Steel 3.0 (Rust) |
| Mobile | React Native + Expo SDK 52 |
| Biometric (mobile) | expo-local-authentication |
| Key storage | expo-secure-store |
| Extension | React + Vite + Chrome MV3 |
| Biometric (web) | WebAuthn API |
| Key splitting | shamirs-secret-sharing |
| Solana client | @solana/web3.js |
| Network | Devnet (Helius for mainnet) |

---

## 🏆 Colosseum Frontier Submission

**Track:** Consumer + Infrastructure  
**Tagline:** "The last wallet you'll ever need — even after you're gone"  
**Built by:** Rahul Patle × Claude

---

*VAULTIS v1.0 — Devnet Only*
