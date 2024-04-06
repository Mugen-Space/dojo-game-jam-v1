use dojo_starter::models::moves::Direction;
use dojo_starter::models::position::Position;

// define the interface
#[dojo::interface]
trait IActions {
    fn create_game();
    fn join_game(game_id: u32);
    fn send_choice(choice: u8, game_id: u32);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::{IActions, next_position};

    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{position::{Position, Vec2}, moves::{Moves, Direction}};
    use dojo_starter::store::{Store, StoreTrait};
    use dojo_starter::models::game::{Game, GameTrait, GameAssert};

    use dojo_starter::models::player::{Player};


    // // declaring custom event struct
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        Gamejoined: Gamejoined,
        GameEnded: GameEnded
    }

    // // // declaring custom event struct
    #[derive(starknet::Event, Model, Copy, Drop, Serde)]
    struct GameCreated {
        #[key]
        game_id: u32,
        owner: ContractAddress
    }

    #[derive(starknet::Event, Model, Copy, Drop, Serde)]
    struct Gamejoined {
        #[key]
        game_id: u32,
        player: ContractAddress
    }

    #[derive(starknet::Event, Model, Copy, Drop, Serde)]
    struct GameEnded {
        #[key]
        game_id: u32,
        seed: u32
    }

    // impl: implement functions specified in trait
    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        // fn spawn(world: IWorldDispatcher) {
        //     // Get the address of the current caller, possibly the player's address.
        //     let player = get_caller_address();
        //     // Retrieve the player's current position from the world.
        //     let position = get!(world, player, (Position));

        //     // Update the world state with the new data.
        //     // 1. Increase the player's remaining moves by 1.
        //     // 2. Move the player's position 10 units in both the x and y direction.
        //     set!(
        //         world,
        //         (
        //             Moves { player, remaining: 100, last_direction: Direction::None(()) },
        //             Position {
        //                 player, vec: Vec2 { x: position.vec.x + 10, y: position.vec.y + 10 }
        //             },
        //         )
        //     );
        // }

        // Implementation of the move function for the ContractState struct.
        // fn move(world: IWorldDispatcher, direction: Direction) {
        //     // Get the address of the current caller, possibly the player's address.
        //     let player = get_caller_address();

        //     // Retrieve the player's current position and moves data from the world.
        //     let (mut position, mut moves) = get!(world, player, (Position, Moves));

        //     // Deduct one from the player's remaining moves.
        //     moves.remaining -= 1;

        //     // Update the last direction the player moved in.
        //     moves.last_direction = direction;

        //     // Calculate the player's next position based on the provided direction.
        //     let next = next_position(position, direction);

        //     // // Update the world state with the new moves data and position.
        //     set!(world, (moves, next));
        // // Emit an event to the world to notify about the player's move.
        // // emit!(world, Moved { player, direction });
        // }

        fn create_game(world: IWorldDispatcher) {
            let mut store: Store = StoreTrait::new(world);
            let caller = get_caller_address();
            let game_id = world.uuid();
            let mut game = GameTrait::new(game_id: game_id, host: caller);
            store.set_game(game);
            emit!(world, GameCreated { game_id: game_id, owner: caller });
        }
        fn join_game(world: IWorldDispatcher, game_id: u32) {
            let mut store: Store = StoreTrait::new(world);
            let caller = get_caller_address();
            let mut game = store.get_game(game_id);
            // println!("join game, {:?}, {:?}, {:?}", caller, game.player1, game_id);
            GameAssert::assert_can_join(ref game: game, player: caller);
            game = GameTrait::join(game: game, player: caller);
            store.set_game(game);
            emit!(world, Gamejoined { game_id, player: caller });
        }
        fn send_choice(world: IWorldDispatcher, choice: u8, game_id: u32) {
            let mut store: Store = StoreTrait::new(world);
            let caller = get_caller_address();
            let mut game = store.get_game(game_id);
            GameAssert::assert_valid_choice(choice);
            GameAssert::assert_can_send_choice(game);
            GameAssert::assert_can_choose(game, choice, player: caller);
            game = GameTrait::choose(game, player: caller, choice: choice);
            store.set_game(game);
            if (game.choice1 != 0 && game.choice2 != 0) {
                emit!(world, GameEnded { game_id, seed: 1 });
            }
        }
    }
}

// Define function like this:
fn next_position(mut position: Position, direction: Direction) -> Position {
    match direction {
        Direction::None => { return position; },
        Direction::Left => { position.vec.x -= 1; },
        Direction::Right => { position.vec.x += 1; },
        Direction::Up => { position.vec.y -= 1; },
        Direction::Down => { position.vec.y += 1; },
    };
    position
}
