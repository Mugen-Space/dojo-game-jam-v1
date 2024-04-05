use starknet::ContractAddress;

#[derive(Model, Drop, Serde)]
struct Player {
    #[key]
    player: ContractAddress,
    username: felt252,
    balance: u32,
    nft_address: ContractAddress,
}

