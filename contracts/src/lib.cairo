mod types;

use types::Premium;

#[starknet::interface]
pub trait IFlightInsurance<TContractState> {

    fn verify(ref self: TContractState);
    fn buy(ref self: TContractState, price: u256);
    fn claim(ref self: TContractState, insuranceId: felt252, premium: Premium);

}


// ??
// https://www.starknet.io/tutorials/cairo-lang-zero-to-one-session-4-building-frontend-on-starknet/

// https://docs.openzeppelin.com/contracts-cairo/1.0.0/erc721

#[starknet::contract]
mod FlightInsurance {
    
    use starknet::ContractAddress;
use starknet::get_contract_address;
    use starknet::get_caller_address;
    use starknet::contract_address_const;
    use crate::Premium;
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map};
    
    
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};

    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    
    // IERC20 token address of USDC
    // https://voyager.online/token/0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
    pub const USDC_TOKEN_ADDRESS: felt252 = 0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8;

    pub mod Errors {
        pub const NOT_ENOUGH_FUNDS: felt252 = 'Not enough funds';
     
    }


    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
  

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,

        token_id: u256,
        whitelist: Map<ContractAddress, bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        let name = "FlightInsurance";
        let symbol = "FLI";
        let base_uri = "";
        self.token_id.write(1);

        self.erc721.initializer(name, symbol, base_uri);
    }


    #[abi(embed_v0)]
    impl FlightInsuranceImpl of super::IFlightInsurance<ContractState> {
        
        fn verify(ref self: ContractState) {
            let caller = get_caller_address();
            let is_whitelisted = self.whitelist.entry(caller).read();
            assert(is_whitelisted, 'Caller not whitelisted');
        }
        
        fn buy(ref self: ContractState, price: u256) {

            // FIXME: Verify ZK proof associated

            // Pay the price
            let erc20_dispatcher = IERC20Dispatcher { contract_address: contract_address_const::<USDC_TOKEN_ADDRESS>() };
            let success = erc20_dispatcher.transfer_from(get_caller_address(), get_contract_address(), price);
            assert(success, Errors::NOT_ENOUGH_FUNDS);

            // Mint a new insurance token
            self.erc721.mint(get_caller_address(), self.token_id.read());
        }

        fn claim(ref self: ContractState, insuranceId: felt252, premium: Premium) {}
    }
}
