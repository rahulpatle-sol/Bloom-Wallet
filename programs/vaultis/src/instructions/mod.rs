pub mod initialize_will;
pub mod check_in;
pub mod execute_will;
pub mod revoke_will;
pub mod add_beneficiary;

pub use initialize_will::process_initialize_will;
pub use check_in::process_check_in;
pub use execute_will::process_execute_will;
pub use revoke_will::process_revoke_will;
pub use add_beneficiary::process_add_beneficiary;
