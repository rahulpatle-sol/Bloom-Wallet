use steel::*;
use crate::errors::VaultisError;
use crate::state::{WillAccount, will_pda};

/// Execute will: permissionless — anyone can call after inactivity period.
/// Transfers SOL proportionally to all beneficiaries.
/// Marks will as inactive after execution.
pub fn process_execute_will(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _data: &[u8],
) -> ProgramResult {
    if accounts.len() < 3 {
        return Err(ProgramError::NotEnoughAccountKeys);
    }

    // accounts[0] = caller (executor — anyone)
    // accounts[1] = will_account (PDA)
    // accounts[2..] = beneficiary accounts (must match stored pubkeys)
    let caller = &accounts[0];
    let will_account = &accounts[1];
    let beneficiary_accounts = &accounts[2..];

    // Verify PDA — derive from stored owner
    let will_data = will_account.try_borrow_data()?;
    let will = bytemuck::from_bytes::<WillAccount>(&will_data);
    let owner_pubkey = will.owner_pubkey();

    let (expected_pda, _) = will_pda(&owner_pubkey, program_id);
    if will_account.key != &expected_pda {
        return Err(ProgramError::InvalidAccountData);
    }

    // Check active
    if will.is_active != 1 {
        return Err(VaultisError::WillNotActive.into());
    }

    // Check inactivity period
    let clock = Clock::get()?;
    if !will.can_execute(clock.unix_timestamp) {
        let remaining = will.seconds_until_execution(clock.unix_timestamp);
        msg!("Vaultis: Cannot execute yet. {} seconds remaining", remaining);
        return Err(VaultisError::InactivityPeriodNotPassed.into());
    }

    // Validate percentages
    if !will.validate_percentages() {
        return Err(VaultisError::InvalidPercentages.into());
    }

    let beneficiary_count = will.beneficiary_count as usize;

    // Validate beneficiary accounts match stored pubkeys
    if beneficiary_accounts.len() < beneficiary_count {
        return Err(ProgramError::NotEnoughAccountKeys);
    }

    for i in 0..beneficiary_count {
        if beneficiary_accounts[i].key != &will.beneficiary_pubkey(i) {
            return Err(ProgramError::InvalidAccountData);
        }
    }

    // Get available lamports (leave rent-exempt minimum)
    let rent = Rent::get()?;
    let rent_exempt = rent.minimum_balance(will_account.data_len());
    let available = will_account
        .lamports()
        .checked_sub(rent_exempt)
        .ok_or(VaultisError::Overflow)?;

    // Store transfer amounts before mutating will
    let mut transfer_amounts = [0u64; 5];
    for i in 0..beneficiary_count {
        let pct = will.percentages[i] as u64;
        transfer_amounts[i] = available
            .checked_mul(pct)
            .and_then(|v| v.checked_div(100))
            .ok_or(VaultisError::Overflow)?;
    }

    drop(will_data); // Release borrow before mutation

    // Execute transfers
    for i in 0..beneficiary_count {
        if transfer_amounts[i] == 0 {
            continue;
        }
        **will_account.try_borrow_mut_lamports()? -= transfer_amounts[i];
        **beneficiary_accounts[i].try_borrow_mut_lamports()? += transfer_amounts[i];
        msg!(
            "Vaultis: Transferred {} lamports to beneficiary {}",
            transfer_amounts[i],
            beneficiary_accounts[i].key
        );
    }

    // Mark will as inactive
    let mut data_ref = will_account.try_borrow_mut_data()?;
    let will_mut = bytemuck::from_bytes_mut::<WillAccount>(&mut data_ref);
    will_mut.is_active = 0;

    msg!("Vaultis: Will executed successfully. Caller: {}", caller.key);
    Ok(())
}
