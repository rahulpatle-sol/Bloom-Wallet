use steel::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

// Instruction discriminators
#[repr(u8)]
#[derive(Clone, Copy, Debug, Eq, PartialEq, TryFromPrimitive)]
pub enum VaultisInstruction {
    InitializeWill = 0,
    CheckIn        = 1,
    ExecuteWill    = 2,
    RevokeWill     = 3,
    AddBeneficiary = 4,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    let (tag, remaining) = data
        .split_first()
        .ok_or(ProgramError::InvalidInstructionData)?;

    let ix = VaultisInstruction::try_from(*tag)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match ix {
        VaultisInstruction::InitializeWill => {
            process_initialize_will(program_id, accounts, remaining)
        }
        VaultisInstruction::CheckIn => {
            process_check_in(program_id, accounts, remaining)
        }
        VaultisInstruction::ExecuteWill => {
            process_execute_will(program_id, accounts, remaining)
        }
        VaultisInstruction::RevokeWill => {
            process_revoke_will(program_id, accounts, remaining)
        }
        VaultisInstruction::AddBeneficiary => {
            process_add_beneficiary(program_id, accounts, remaining)
        }
    }
}
