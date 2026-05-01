use steel::*;
use bytemuck::{Pod, Zeroable};

pub const MAX_BENEFICIARIES: usize = 5;
pub const WILL_ACCOUNT_SEED: &[u8] = b"will";
pub const WILL_ACCOUNT_SIZE: usize = std::mem::size_of::<WillAccount>();

/// On-chain representation of a user's digital will.
/// Tight-packed for minimal rent + compute units.
#[repr(C)]
#[derive(Clone, Copy, Pod, Zeroable)]
pub struct WillAccount {
    /// Owner's wallet pubkey
    pub owner: [u8; 32],

    /// Unix timestamp of last check-in
    pub last_checkin: i64,

    /// Days of inactivity before will executes
    pub inactivity_days: u16,

    /// Number of active beneficiaries
    pub beneficiary_count: u8,

    /// 0 = inactive/revoked, 1 = active
    pub is_active: u8,

    /// Beneficiary pubkeys (padded to MAX_BENEFICIARIES)
    pub beneficiaries: [[u8; 32]; 5],

    /// Share percentages (must sum to 100 when will executes)
    pub percentages: [u8; 5],

    /// Padding for alignment
    pub _padding: [u8; 3],
}

impl WillAccount {
    pub fn owner_pubkey(&self) -> Pubkey {
        Pubkey::from(self.owner)
    }

    pub fn is_active(&self) -> bool {
        self.is_active == 1
    }

    pub fn seconds_until_execution(&self, now: i64) -> i64 {
        let inactivity_seconds = (self.inactivity_days as i64) * 86_400;
        let elapsed = now - self.last_checkin;
        inactivity_seconds - elapsed
    }

    pub fn can_execute(&self, now: i64) -> bool {
        self.is_active() && self.seconds_until_execution(now) <= 0
    }

    pub fn beneficiary_pubkey(&self, idx: usize) -> Pubkey {
        Pubkey::from(self.beneficiaries[idx])
    }

    pub fn validate_percentages(&self) -> bool {
        let total: u16 = self.percentages[..self.beneficiary_count as usize]
            .iter()
            .map(|&p| p as u16)
            .sum();
        total == 100
    }
}

/// PDA derivation helper
pub fn will_pda(owner: &Pubkey, program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[WILL_ACCOUNT_SEED, owner.as_ref()],
        program_id,
    )
}
