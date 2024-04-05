use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use dojo_starter::models::game::{Game};
use dojo_starter::models::player::{Player};

#[derive(Drop)]
struct Store {
    world: IWorldDispatcher
}

#[generate_trait]
impl StoreImpl of StoreTrait {
    fn new(world: IWorldDispatcher) -> Store {
        Store { world: world }
    }
    fn get_game(ref self: Store, id: u32) -> Game {
        get!(self.world, id, (Game))
    }
    fn set_game(ref self: Store, game: Game) {
        set!(self.world, (game));
    }
    fn get_player(ref self: Store, player: ContractAddress) -> Player {
        get!(self.world, player, (Player))
    }
    fn set_player(ref self: Store, player: Player) {
        set!(self.world, (player));
    }
}
