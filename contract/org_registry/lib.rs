#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod org_registry {
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Identity commitment (Poseidon hash of identity secret)
    pub type IdentityCommitment = [u8; 32];
    
    /// Organization ID
    pub type OrgId = u32;
    
    /// File ID
    pub type FileId = u32;
    
    /// Proof hash (hash of the ZK proof)
    pub type ProofHash = [u8; 32];
    
    /// Public signals hash
    pub type PublicSignalsHash = [u8; 32];

    #[ink(storage)]
    pub struct OrgRegistry {
        /// Mapping from address to their identity commitments
        identity_commitments: Mapping<AccountId, Vec<IdentityCommitment>>,
        /// Mapping from address to organizations they belong to
        user_orgs: Mapping<AccountId, Vec<OrgId>>,
        /// Mapping from org ID to Merkle root
        org_roots: Mapping<OrgId, [u8; 32]>,
        /// Mapping from (user, org) to latest verification timestamp
        verifications: Mapping<(AccountId, OrgId), u64>,
        /// Organization counter
        org_counter: OrgId,
    }

    #[ink(event)]
    pub struct IdentityCreated {
        #[ink(topic)]
        user: AccountId,
        #[ink(topic)]
        identity_commitment: IdentityCommitment,
    }

    #[ink(event)]
    pub struct OrgRootUpdated {
        #[ink(topic)]
        org_id: OrgId,
        #[ink(topic)]
        new_root: [u8; 32],
    }

    #[ink(event)]
    pub struct ProofVerified {
        #[ink(topic)]
        user: AccountId,
        #[ink(topic)]
        org_id: OrgId,
        #[ink(topic)]
        file_id: FileId,
        timestamp: u64,
    }

    impl Default for OrgRegistry {
        fn default() -> Self {
            Self::new()
        }
    }

    impl OrgRegistry {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                identity_commitments: Mapping::new(),
                user_orgs: Mapping::new(),
                org_roots: Mapping::new(),
                verifications: Mapping::new(),
                org_counter: 0,
            }
        }

        /// Register a new identity commitment
        #[ink(message)]
        pub fn register_identity(&mut self, identity_commitment: IdentityCommitment) -> Result<(), ()> {
            let caller = self.env().caller();
            
            let mut commitments = self.identity_commitments.get(caller).unwrap_or_default();
            commitments.push(identity_commitment);
            self.identity_commitments.insert(caller, &commitments);
            
            self.env().emit_event(IdentityCreated {
                user: caller,
                identity_commitment,
            });
            
            Ok(())
        }

        /// Get all identity commitments for an address
        #[ink(message)]
        pub fn get_identity_commitments(&self, address: AccountId) -> Vec<IdentityCommitment> {
            self.identity_commitments.get(address).unwrap_or_default()
        }

        /// Update organization Merkle root
        #[ink(message)]
        pub fn update_org_root(&mut self, org_id: OrgId, new_root: [u8; 32]) -> Result<(), ()> {
            // In production, add access control here (only org admin can update)
            self.org_roots.insert(org_id, &new_root);
            
            self.env().emit_event(OrgRootUpdated {
                org_id,
                new_root,
            });
            
            Ok(())
        }

        /// Get organization Merkle root
        #[ink(message)]
        pub fn get_org_root(&self, org_id: OrgId) -> Option<[u8; 32]> {
            self.org_roots.get(org_id)
        }

        /// Verify ZK proof and record verification
        #[ink(message)]
        pub fn verify_proof(
            &mut self,
            org_id: OrgId,
            file_id: FileId,
            _proof_hash: ProofHash,
            _public_signals_hash: PublicSignalsHash,
        ) -> Result<(), ()> {
            let caller = self.env().caller();
            let timestamp = self.env().block_timestamp();
            
            // Verify org root exists
            let _org_root = self.org_roots.get(org_id).ok_or(())?;
            
            // In production, verify proof_hash matches actual proof
            // For now, we accept any proof hash (backend will verify the actual proof)
            
            // Record verification
            self.verifications.insert((caller, org_id), &timestamp);
            
            // Update user's org list if not already present
            let mut user_orgs = self.user_orgs.get(caller).unwrap_or_default();
            if !user_orgs.contains(&org_id) {
                user_orgs.push(org_id);
                self.user_orgs.insert(caller, &user_orgs);
            }
            
            self.env().emit_event(ProofVerified {
                user: caller,
                org_id,
                file_id,
                timestamp,
            });
            
            Ok(())
        }

        /// Get organizations for a user
        #[ink(message)]
        pub fn get_user_orgs(&self, address: AccountId) -> Vec<OrgId> {
            self.user_orgs.get(address).unwrap_or_default()
        }

        /// Get latest verification timestamp for user and org
        #[ink(message)]
        pub fn get_latest_verification(&self, address: AccountId, org_id: OrgId) -> Option<u64> {
            self.verifications.get((address, org_id))
        }

        /// Create a new organization (returns org ID)
        #[ink(message)]
        pub fn create_org(&mut self) -> OrgId {
            let org_id = self.org_counter;
            // Use checked_add to prevent overflow (clippy requirement)
            self.org_counter = self.org_counter.checked_add(1)
                .expect("Organization counter overflow");
            org_id
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn test_register_identity() {
            let mut contract = OrgRegistry::new();
            let commitment: IdentityCommitment = [1u8; 32];
            
            assert!(contract.register_identity(commitment).is_ok());
            
            let commitments = contract.get_identity_commitments(contract.env().caller());
            assert_eq!(commitments.len(), 1);
        }

        #[ink::test]
        fn test_org_root() {
            let mut contract = OrgRegistry::new();
            let org_id = 1;
            let root: [u8; 32] = [2u8; 32];
            
            assert!(contract.update_org_root(org_id, root).is_ok());
            assert_eq!(contract.get_org_root(org_id), Some(root));
        }
    }
}

