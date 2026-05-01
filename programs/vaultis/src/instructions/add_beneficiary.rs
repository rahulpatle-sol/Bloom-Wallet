use steel::*;
use crate::errors::VaultisError;
use crate::state::{WillAccount, MAX_BENEFICIARIES, will_pda};

/// Instruction data:
/// [0..32]  beneficiary pubkey bytes
/// [32]     percentage (u8)
/// [33]     slot index (0-4, u8) — which slot to set
pub fn process_add_beneficiary(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    let [owner, will_account] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    if !owner.is_signer {
        return Err(VaultisError::Unauthorized.into());
    }

    if data.len() < 34 {
        return Err(ProgramError::InvalidInstructionData);
    }

    let beneficiary_bytes: [u8; 32] = data[0..32].try_into().unwrap();
    let percentage = data[32];
    let slot = data[33] as usize;

    if slot >= MAX_BENEFICIARIES {
        return Err(VaultisError::MaxBeneficiariesReached.into());
    }

    if percentage == 0 || percentage > 100 {
        return Err(VaultisError::InvalidPercentages.into());
    }

    let (expected_pda, _) = will_pda(owner.key, program_id);
    if will_account.key != &expected_pda {
        return Err(ProgramError::InvalidAccountData);
    }

    let mut data_ref = will_account.try_borrow_mut_data()?;
    let will = bytemuck::from_bytes_mut::<WillAccount>(&mut data_ref);

    if will.owner != owner.key.to_bytes() {
        return Err(VaultisError::Unauthorized.into());
    }

    if will.is_active != 1 {
        return Err(VaultisError::WillNotActive.into());
    }

    // Check if this is a new slot
    let is_new_slot = will.beneficiaries[slot] == [0u8; 32];
    if is_new_slot && will.beneficiary_count as usize >= MAX_BENEFICIARIES {
        return Err(VaultisError::MaxBeneficiariesReached.into());
    }

    will.beneficiaries[slot] = beneficiary_bytes;
    will.percentages[slot] = percentage;

    if is_new_slot {
        will.beneficiary_count += 1;
    }

    msg!(
        "Vaultis: Beneficiary set at slot {} with {}%",
        slot,
        percentage
    );
    Ok(())
}
