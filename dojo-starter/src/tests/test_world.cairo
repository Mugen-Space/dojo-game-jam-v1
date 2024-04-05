#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;

    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    use starknet::testing::{set_contract_address};
    // import test utils
    use dojo_starter::{
        systems::{actions::{actions, IActionsDispatcher, IActionsDispatcherTrait}},
        models::{
            position::{Position, Vec2, position}, moves::{Moves, Direction, moves},
            game::{Game, game}
        }
    };
    use debug::print;


    #[test]
    #[available_gas(30000000)]
    fn test_move() {
        // caller
        let caller = starknet::contract_address_const::<0x0>();

        // models
        let mut models = array![position::TEST_CLASS_HASH, moves::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        // call spawn()
        actions_system.spawn();

        // call move with direction right
        actions_system.move(Direction::Right);

        // Check world state
        let moves = get!(world, caller, Moves);

        // casting right direction
        let right_dir_felt: felt252 = Direction::Right.into();

        // check moves
        assert(moves.remaining == 99, 'moves is wrong');

        // check last direction
        assert(moves.last_direction.into() == right_dir_felt, 'last direction is wrong');

        // get new_position
        let new_position = get!(world, caller, Position);

        // check new position x
        assert(new_position.vec.x == 11, 'position x is wrong');

        // check new position y
        assert(new_position.vec.y == 10, 'position y is wrong');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_game_creation() {
        // caller
        let caller = starknet::contract_address_const::<0x1>();
        set_contract_address(caller);
        // models
        let mut models = array![game::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        // call spawn()
        actions_system.create_game();
        let game_state = get!(world, 1, Game);

        let ideal_caller = starknet::contract_address_const::<0x0>();

        // check state
        // println!("Hello, {:?}", game_state.seed);
        assert(game_state.game_id == 1, 'game_id is wrong');
        assert(game_state.player1 == ideal_caller, 'player1 is wrong');
        assert(game_state.player2 == ideal_caller, 'player2 is wrong');
        assert(game_state.choice1 == 0, 'choice1 is wrong');
        assert(game_state.choice2 == 0, 'choice2 is wrong');
        assert(game_state.seed == 0, 'seed is wrong');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_game_join() {
        // caller
        let caller = starknet::contract_address_const::<0x1>();
        set_contract_address(caller);
        // models
        let mut models = array![game::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        // call spawn()
        actions_system.create_game();
        let caller1 = starknet::contract_address_const::<0x2>();
        set_contract_address(caller1);
        actions_system.join_game(1);
        let game_state = get!(world, 1, Game);

        let ideal_caller = starknet::contract_address_const::<0x0>();

        // check state
        assert(game_state.game_id == 1, 'game_id is wrong');
        assert(game_state.player1 == caller1, 'player1 is wrong');
        assert(game_state.player2 == ideal_caller, 'player2 is wrong');
        assert(game_state.choice1 == 0, 'choice1 is wrong');
        assert(game_state.choice2 == 0, 'choice2 is wrong');
        assert(game_state.seed == 0, 'seed is wrong');

        let caller2 = starknet::contract_address_const::<0x3>();
        set_contract_address(caller2);
        actions_system.join_game(1);
        let game_state = get!(world, 1, Game);

        // check state
        // println!("Hello, {:?}", game_state.player2);
        assert(game_state.game_id == 1, 'game_id is wrong');
        assert(game_state.player1 == caller1, 'player1 is wrong');
        assert(game_state.player2 == caller2, 'player2 is wrong');
        assert(game_state.choice1 == 0, 'choice1 is wrong');
        assert(game_state.choice2 == 0, 'choice2 is wrong');
        assert(game_state.seed == 0, 'seed is wrong');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_game_choice() {
        // caller
        let caller = starknet::contract_address_const::<0x1>();
        set_contract_address(caller);
        // models
        let mut models = array![game::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        // call spawn()
        actions_system.create_game();
        let caller1 = starknet::contract_address_const::<0x2>();
        set_contract_address(caller1);
        actions_system.join_game(1);

        let caller2 = starknet::contract_address_const::<0x3>();
        set_contract_address(caller2);
        actions_system.join_game(1);

        actions_system.send_choice(2, 1);

        let game_state = get!(world, 1, Game);

        // println!("Hello, {:?}, {:?}", game_state.player2, game_state.choice1);
        assert(game_state.game_id == 1, 'game_id is wrong');
        assert(game_state.player1 == caller1, 'player1 is wrong');
        assert(game_state.player2 == caller2, 'player2 is wrong');
        assert(game_state.choice1 == 0, 'choice1 is wrong');
        assert(game_state.choice2 == 2, 'choice2 is wrong');
        assert(game_state.seed == 0, 'seed is wrong');
    }
}
