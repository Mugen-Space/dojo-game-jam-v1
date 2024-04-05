use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32,
    player1: ContractAddress,
    player2: ContractAddress,
    choice1: u8,
    choice2: u8,
    seed: u8
}

mod errors {
    const GAME_NOT_HOST: felt252 = 'Game: user is not the host';
    const GAME_IS_HOST: felt252 = 'Game: user is the host';
    const GAME_TRANSFER_SAME_HOST: felt252 = 'Game: transfer to the same host';
    const GAME_TOO_MANY_PLAYERS: felt252 = 'Game: too many players';
    const GAME_TOO_FEW_PLAYERS: felt252 = 'Game: too few players';
    const GAME_IS_FULL: felt252 = 'Game: is full';
    const GAME_NOT_FULL: felt252 = 'Game: not full';
    const GAME_IS_EMPTY: felt252 = 'Game: is empty';
    const GAME_NOT_ONLY_ONE: felt252 = 'Game: not only one';
    const GAME_IS_OVER: felt252 = 'Game: is over';
    const GAME_NOT_OVER: felt252 = 'Game: not over';
    const GAME_NOT_STARTED: felt252 = 'Game: not started';
    const GAME_HAS_STARTED: felt252 = 'Game: has started';
    const GAME_NOT_EXISTS: felt252 = 'Game: does not exist';
    const GAME_DOES_EXIST: felt252 = 'Game: does exist';
    const GAME_INVALID_HOST: felt252 = 'Game: invalid host';
    const GAME_CHOICE_DONE: felt252 = 'Game: already choosed';
    const GAME_INVALID_CHOICE: felt252 = 'Game: invalid choice';
}

#[generate_trait]
impl GameImpl of GameTrait {
    #[inline(always)]
    fn new(game_id: u32, host: ContractAddress) -> Game {
        assert(!host.is_zero(), errors::GAME_INVALID_HOST);
        let player = starknet::contract_address_const::<0x0>();
        Game { game_id, player1: player, player2: player, choice1: 0, choice2: 0, seed: 12 }
    }
    #[inline(always)]
    fn join(mut game: Game, player: ContractAddress) {
        assert(!player.is_zero(), errors::GAME_INVALID_HOST);
        let const_player = starknet::contract_address_const::<0x0>();
        if (game.player1 == const_player) {
            game.player1 = player;
        } else {
            game.player2 = player;
        }
    }
    #[inline(always)]
    fn choose(mut game: Game, player: ContractAddress, choice: u8) {
        assert(!player.is_zero(), errors::GAME_INVALID_HOST);
        if (game.player1 == player) {
            game.choice1 = choice;
        } else {
            game.choice2 = choice;
        }
    }
}

#[generate_trait]
impl GameAssert of AssertTrait {
    #[inline(always)]
    fn assert_can_join(self: Game, player: ContractAddress) {
        let const_player = starknet::contract_address_const::<0x0>();
        let check1 = (self.player1 == const_player);
        let check2 = (self.player2 == const_player);
        assert((check1 || check2), errors::GAME_IS_FULL);
    }

    #[inline(always)]
    fn assert_can_send_choice(self: Game) {
        let const_player = starknet::contract_address_const::<0x0>();
        let check1 = (self.player1 == const_player);
        let check2 = (self.player2 == const_player);
        assert((check1 || check2), errors::GAME_NOT_FULL);
    }

    #[inline(always)]
    fn assert_can_choose(self: Game, choice: u8, player: ContractAddress) {
        if (self.player1 == player) {
            assert(self.choice1 != 0, errors::GAME_CHOICE_DONE);
        }
        if (self.player2 == player) {
            assert(self.choice2 != 0, errors::GAME_CHOICE_DONE);
        }
    }
    #[inline(always)]
    fn assert_valid_choice(choice: u8) {
        assert((choice == 1 || choice == 2), errors::GAME_INVALID_CHOICE);
    }
}
