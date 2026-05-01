use steel::*;
use crate::errors::VaultisError;
use crate::state::{WillAccount, WILL_ACCOUNT_SEED, WILL_ACCOUNT_SIZE, will_pda};

/// Instruction data layout:
/// [0] inactivity_days_lo  (u16 little-endian byte 0)
/// [1] inactivity_days_hi  (u16 little-endian byte 1)
pub fn process_initialize_will(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    // Parse accounts
    let [owner, will_account, system_program] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    // Owner must sign
    if !owner.is_signer {
        return Err(VaultisError::Unauthorized.into());
    }

    // Parse inactivity_days from instruction data
    if data.len() < 2 {
        return Err(ProgramError::InvalidInstructionData);
    }
    let inactivity_days = u16::from_le_bytes([data[0], data[1]]);
    if inactivity_days == 0 || inactivity_days > 3650 {
        return Err(VaultisError::InvalidInactivityDays.into());
    }

    // Verify PDA
    let (expected_pda, bump) = will_pda(owner.key, program_id);
    if will_account.key != &expected_pda {
        return Err(ProgramError::InvalidAccountData);
    }

    // Account must not already exist
    if !will_account.data_is_empty() {
        return Err(VaultisError::WillAlreadyExists.into());
    }

    // Create PDA account
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(WILL_ACCOUNT_SIZE);
    let seeds = &[WILL_ACCOUNT_SEED, owner.key.as_ref(), &[bump]];

    invoke_signed(
        &solana_program::system_instruction::create_account(
            owner.key,
            will_account.key,
            lamports,
            WILL_ACCOUNT_SIZE as u64,
            program_id,
        ),
        &[owner.clone(), will_account.clone(), system_program.clone()],
        &[seeds],
    )?;

    // Initialize will data
    let clock = Clock::get()?;
    let mut data_ref = will_account.try_borrow_mut_data()?;
    let will = bytemuck::from_bytes_mut::<WillAccount>(&mut data_ref);

    will.owner = owner.key.to_bytes();
    will.last_checkin = clock.unix_timestamp;
    will.inactivity_days = inactivity_days;
    will.beneficiary_count = 0;
    will.is_active = 1;
    will.beneficiaries = [[0u8; 32]; 5];
    will.percentages = [0u8; 5];
    will._padding = [0u8; 3];

    msg!("Vaultis: Will initialized. Owner: {}, Inactivity: {} days", owner.key, inactivity_days);
    Ok(())
}
