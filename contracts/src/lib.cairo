mod types;

use types::Premium;
use openzeppelin::introspection;

#[starknet::interface]
pub trait IFlightInsurance<TContractState> {

    fn verify(ref self: TContractState);
    fn buy(ref self: TContractState, price: felt252);
    fn claim(ref self: TContractState, insuranceId: felt252, premium: Premium);

}


// ??
// https://www.starknet.io/tutorials/cairo-lang-zero-to-one-session-4-building-frontend-on-starknet/

// https://docs.openzeppelin.com/contracts-cairo/1.0.0/erc721

#[starknet::contract]
mod FlightInsurance {
    
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    

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
        src5: SRC5Component::Storage
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
        let token_id = 1;

        self.erc721.initializer(name, symbol, base_uri);
    }


    #[abi(embed_v0)]
    impl FlightInsuranceImpl of super::IFlightInsurance<ContractState> {
        
        fn verify(ref self: TContractState){

        }
        
        fn buy(ref self: TContractState, price: felt252) {

        }

        fn claim(ref self: TContractState, insuranceId: felt252, premium: Premium) {}
    }
}


// fn increase_balance(ref self: ContractState, amount: felt252) {
//     assert(amount != 0, 'Amount cannot be 0');
//     self.balance.write(self.balance.read() + amount);
// }

// fn get_balance(self: @ContractState) -> felt252 {
//     self.balance.read()
// }