use steel::*;
use crate::errors::VaultisError;
use crate::state::{WillAccount, will_pda};

/// Check-in: proves user is alive. Updates last_checkin timestamp.
/// This is the lightest instruction — ~2400 CU.
pub fn process_check_in(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _data: &[u8],
) -> ProgramResult {
    let [owner, will_account] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    // Must sign
    if !owner.is_signer {
        return Err(VaultisError::Unauthorized.into());
    }

    // Verify PDA
    let (expected_pda, _) = will_pda(owner.key, program_id);
    if will_account.key != &expected_pda {
        return Err(ProgramError::InvalidAccountData);
    }

    // Update timestamp
    let clock = Clock::get()?;
    let mut data_ref = will_account.try_borrow_mut_data()?;
    let will = bytemuck::from_bytes_mut::<WillAccount>(&mut data_ref);

    // Verify owner
    if will.owner != owner.key.to_bytes() {
        return Err(VaultisError::Unauthorized.into());
    }

    // Verify active
    if will.is_active != 1 {
        return Err(VaultisError::WillNotActive.into());
    }

    will.last_checkin = clock.unix_timestamp;

    msg!("Vaultis: Check-in recorded at {}", clock.unix_timestamp);
    Ok(())
}
