use steel::*;
use crate::errors::VaultisError;
use crate::state::{WillAccount, will_pda};

/// Revoke will: owner cancels the will. Marks as inactive.
pub fn process_revoke_will(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _data: &[u8],
) -> ProgramResult {
    let [owner, will_account] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    if !owner.is_signer {
        return Err(VaultisError::Unauthorized.into());
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
        return Err(VaultisError::WillAlreadyRevoked.into());
    }

    will.is_active = 0;
    msg!("Vaultis: Will revoked by owner {}", owner.key);
    Ok(())
}
