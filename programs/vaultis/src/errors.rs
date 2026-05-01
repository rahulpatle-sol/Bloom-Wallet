use steel::*;
use thiserror::Error;

#[derive(Debug, Error, Clone, Copy, PartialEq, Eq)]
#[repr(u32)]
pub enum VaultisError {
    #[error("Will is not active")]
    WillNotActive = 0,

    #[error("Inactivity period has not passed yet")]
    InactivityPeriodNotPassed = 1,

    #[error("Beneficiary percentages do not sum to 100")]
    InvalidPercentages = 2,

    #[error("Maximum beneficiaries reached (5)")]
    MaxBeneficiariesReached = 3,

    #[error("Unauthorized: only the will owner can perform this action")]
    Unauthorized = 4,

    #[error("Invalid inactivity days (must be 1-3650)")]
    InvalidInactivityDays = 5,

    #[error("Will already exists for this owner")]
    WillAlreadyExists = 6,

    #[error("Beneficiary address is invalid")]
    InvalidBeneficiary = 7,

    #[error("Arithmetic overflow")]
    Overflow = 8,

    #[error("Will is already revoked")]
    WillAlreadyRevoked = 9,
}

impl From<VaultisError> for ProgramError {
    fn from(e: VaultisError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
